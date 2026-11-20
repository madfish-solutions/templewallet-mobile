"""Record and replay the wallet API through mitmproxy, the way the extension does.

The first run stores each answer. Later runs receive that file instead of
calling the server. A 429 is not stored: replaying it would make every run look
throttled. The warm-up pass remembers those requests and fetches them again
after the app has stopped, one at a time, so the measured run replays a
complete set.

    TW_API_CACHE=api-cache TW_API_CACHE_FILL=1 mitmdump -s api-cache.py
    # run the import once, leave the app idle, then:
    TW_API_CACHE=api-cache python3 api-cache.py --fill
    # measured runs, fill off:
    TW_API_CACHE=api-cache mitmdump -s api-cache.py

Only GET and POST to the wallet APIs are stored. Every other connection,
including chromewebstore.google.com, is tunneled without decryption.
Websocket handshakes are left alone.

Running counters are written to stats.json in the cache directory: hits,
recorded, throttled, and httpErrors.
"""

import base64
import hashlib
import json
import os
import sys
import time
import urllib.error
import urllib.request
from email.message import EmailMessage
from pathlib import Path
from urllib.parse import urlparse

CACHEABLE_HOST = ("madfish", "templewallet", "tzkt", "objkt")
# The system proxy also carries this Mac's browser. These sites are not APIs.
WEBSITE_HOSTS = {"tzkt.io", "www.tzkt.io", "objkt.com", "www.objkt.com", "templewallet.com", "www.templewallet.com"}
# Decrypt only the API hosts. Everything else, including chromewebstore.google.com,
# keeps its real certificate. mitmproxy matches this expression against the hostname.
ALLOW_HOSTS = [
    r"^(?!((www\.)?(tzkt\.io|objkt\.com|templewallet\.com))$).*(tzkt\.io|objkt\.(com|media)|templewallet\.com|madfish\.solutions)$"
]
# content-encoding and content-length describe the compressed body, which is not
# what we store. nel and report-to point at a.nel.cloudflare.com; they are not
# part of the API answer. alt-svc would send the next call around the proxy.
DROP_HEADERS = ("content-encoding", "content-length", "nel", "report-to", "alt-svc")
FILL_HEADERS = ("accept", "content-type", "origin", "referer", "user-agent")
FILL_DRAIN_MS = 3 * 60 * 1000
PENDING_NAME = "pending.json"


def _pending_path(directory: Path) -> Path:
    return directory / PENDING_NAME


def _read_pending(directory: Path):
    path = _pending_path(directory)
    if not path.exists():
        return []
    return json.loads(path.read_text())


def _write_pending(directory: Path, pending):
    path = _pending_path(directory)
    temporary = path.with_suffix(".json.tmp")
    temporary.write_text(json.dumps(pending))
    temporary.replace(path)


def _retry_after_ms(value):
    if not value:
        return None
    value = value.strip()
    if value.isdigit():
        ms = int(value) * 1000
    else:
        parsed = email_date_ms(value)
        ms = parsed - int(time.time() * 1000) if parsed is not None else None
    return ms if ms and ms > 0 else None


def email_date_ms(value):
    from email.utils import parsedate_to_datetime

    try:
        return int(parsedate_to_datetime(value).timestamp() * 1000)
    except (TypeError, ValueError, OverflowError):
        return None


def _human_duration(ms):
    if ms >= 86_400_000:
        return f"{round(ms / 86_400_000)} days"
    if ms >= 3_600_000:
        return f"{round(ms / 3_600_000)} hours"
    return f"{max(1, round(ms / 60_000))} min"


def _direct_opener():
    # The Mac proxy is this mitmproxy. The refill must reach the server itself.
    class NoRedirect(urllib.request.HTTPRedirectHandler):
        def http_error_302(self, req, fp, code, msg, headers):
            return fp

        http_error_301 = http_error_303 = http_error_307 = http_error_308 = http_error_302

    class KeepStatus(urllib.request.HTTPErrorProcessor):
        def http_response(self, request, response):
            return response

        https_response = http_response

    return urllib.request.build_opener(urllib.request.ProxyHandler({}), NoRedirect, KeepStatus)


def _header_value(headers, name):
    if isinstance(headers, EmailMessage):
        return headers.get(name)
    return headers.get(name) or headers.get(name.lower())


def fill_pending(directory: Path, max_ms: int = FILL_DRAIN_MS):
    """Fetch throttled answers again and record them. The app must be idle."""
    pending = _read_pending(directory)
    deadline = time.time() + max_ms / 1000
    opener = _direct_opener()
    interval = 0.25
    pause_until = 0.0
    refused_in_a_row = 0
    filled = failed = 0
    reason = None

    while pending and time.time() < deadline:
        time.sleep(min(max(interval, pause_until - time.time()), max(0, deadline - time.time())))
        item = pending.pop(0)
        target = directory / item["file"]
        if target.exists():
            continue
        request = urllib.request.Request(
            item["url"],
            data=base64.b64decode(item["bodyBase64"]) if item.get("bodyBase64") else None,
            headers=item.get("headers") or {},
            method=item["method"],
        )
        try:
            response = opener.open(request, timeout=20)
            status = response.status
            response_headers = response.headers
            body = response.read()
        except (urllib.error.URLError, TimeoutError, OSError):
            failed += 1
            continue

        if status == 429 or status >= 500:
            retry_after = _retry_after_ms(_header_value(response_headers, "Retry-After"))
            if retry_after is not None and retry_after > max_ms:
                reason = f"the server asks to come back in {_human_duration(retry_after)}"
            else:
                refused_in_a_row += 1
                if refused_in_a_row >= 8:
                    reason = "the server refused 8 attempts in a row"
            if reason:
                pending.insert(0, item)
                break
            pause_until = time.time() + min((retry_after or interval * 4 * 1000) / 1000, 60)
            interval = min(interval * 2, 5)
            item["attempts"] = item.get("attempts", 0) + 1
            if item["attempts"] < 4:
                pending.append(item)
            else:
                failed += 1
            continue

        refused_in_a_row = 0
        interval = max(0.25, interval / 2)
        stored_headers = {}
        for name in response_headers.keys():
            if name.lower() not in DROP_HEADERS:
                stored_headers[name] = response_headers.get(name)
        target.write_text(
            json.dumps({"status": status, "headers": stored_headers, "bodyBase64": base64.b64encode(body).decode("ascii")})
        )
        filled += 1

    left = len(pending)
    if pending:
        _write_pending(directory, pending)
    elif _pending_path(directory).exists():
        _pending_path(directory).unlink()
    print(
        f"API cache warm-up fill: {filled} throttled answers fetched again and recorded, "
        f"{failed} given up, {left} left{f' ({reason})' if reason else ''}"
    )
    return 0


def main():
    if "--fill" not in sys.argv:
        print("Warm-up: TW_API_CACHE_FILL=1 mitmdump -s api-cache.py", file=sys.stderr)
        print("Then, with the app idle: python3 api-cache.py --fill", file=sys.stderr)
        return 2
    fill_pending(Path(os.environ.get("TW_API_CACHE", "api-cache")))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

from mitmproxy import ctx
from mitmproxy import http


class ApiCache:
    def __init__(self):
        self.directory = None
        self.fill = False
        self.hits = 0
        self.recorded = 0
        self.throttled = 0
        self.http_errors = 0
        self.unrecorded = {}

    def load(self, loader):
        loader.add_option("api_cache_dir", str, os.environ.get("TW_API_CACHE", "api-cache"), "Where recorded answers are stored.")

    def running(self):
        self.directory = Path(ctx.options.api_cache_dir)
        self.directory.mkdir(parents=True, exist_ok=True)
        self.fill = os.environ.get("TW_API_CACHE_FILL") == "1"
        if list(ctx.options.allow_hosts) != ALLOW_HOSTS:
            ctx.options.allow_hosts = ALLOW_HOSTS
        ctx.log.info(f"API cache directory: {self.directory.resolve()}")
        ctx.log.info("Decrypting only wallet API hosts. Other sites keep their own certificates.")
        if self.fill:
            ctx.log.info("Warm-up fill is on. Throttled answers are fetched again by: python3 api-cache.py --fill")
        self._write_stats()

    def request(self, flow: http.HTTPFlow):
        cache_file = self._cache_file(flow)
        if cache_file is None:
            return
        if not cache_file.exists():
            flow.metadata["api_cache_file"] = str(cache_file)
            return

        hit = json.loads(cache_file.read_text())
        self.hits += 1
        self._write_stats()
        flow.metadata["api_cache"] = "hit"
        flow.response = http.Response.make(hit["status"], base64.b64decode(hit["bodyBase64"]), self._replay_headers(hit["headers"]))

    def response(self, flow: http.HTTPFlow):
        cache_file = flow.metadata.get("api_cache_file")
        if not cache_file or flow.response is None:
            return

        status = flow.response.status_code
        if status == 429 or status >= 500:
            if status == 429:
                self.throttled += 1
                if self.fill:
                    self._remember_throttled(flow, Path(cache_file).name)
            else:
                self.http_errors += 1
            self._write_stats()
            self._note_unrecorded(flow, status)
            return

        # Read the decoded body first. Removing content-encoding from the live
        # response leaves the compressed bytes in place, and the browser then
        # renders them as the page.
        body = flow.response.get_content(strict=False) or b""
        payload = {
            "status": status,
            "headers": self._replay_headers(flow.response.headers),
            "bodyBase64": base64.b64encode(body).decode("ascii"),
        }
        Path(cache_file).write_text(json.dumps(payload))
        self.recorded += 1
        self._write_stats()

    def done(self):
        ctx.log.info(
            f"API cache hits={self.hits} recorded={self.recorded} throttled={self.throttled} httpErrors={self.http_errors}"
        )
        top = sorted(self.unrecorded.items(), key=lambda item: item[1], reverse=True)[:5]
        if top:
            ctx.log.info(
                "API cache not recorded: " + ", ".join(f"{key} ×{count}" for key, count in top)
            )

    def _write_stats(self):
        if self.directory is None:
            return
        payload = {
            "hits": self.hits,
            "recorded": self.recorded,
            "throttled": self.throttled,
            "httpErrors": self.http_errors,
        }
        path = self.directory / "stats.json"
        tmp = path.with_suffix(".tmp")
        tmp.write_text(json.dumps(payload))
        tmp.replace(path)

    def _remember_throttled(self, flow: http.HTTPFlow, file_name: str):
        pending = _read_pending(self.directory)
        if any(item["file"] == file_name for item in pending):
            return
        headers = {}
        for name, value in flow.request.headers.items():
            if name.lower() in FILL_HEADERS:
                headers[name] = value
        body = flow.request.content or b""
        pending.append(
            {
                "file": file_name,
                "method": flow.request.method,
                "url": flow.request.url,
                "headers": headers,
                "bodyBase64": base64.b64encode(body).decode("ascii"),
                "attempts": 0,
            }
        )
        _write_pending(self.directory, pending)

    def _note_unrecorded(self, flow: http.HTTPFlow, status: int):
        parsed = urlparse(flow.request.url)
        segments = parsed.path.split("/")[:4]
        long_at = next((index for index, segment in enumerate(segments) if len(segment) > 20), -1)
        if long_at != -1:
            segments = [*segments[:long_at], "*"]
        key = f"{status} {parsed.hostname}{'/'.join(segments)}"
        self.unrecorded[key] = self.unrecorded.get(key, 0) + 1

    def _cache_file(self, flow: http.HTTPFlow):
        request = flow.request
        host = request.host.lower().split(":")[0]
        if host in WEBSITE_HOSTS or not any(part in host for part in CACHEABLE_HOST):
            return None
        if request.method not in ("GET", "POST"):
            return None
        path = urlparse(request.url).path
        if path == "/ws" or path.startswith("/ws/"):
            return None
        if self.directory is None:
            return None

        body = request.content or b""
        key = hashlib.sha1(f"{request.method} {request.url}\n".encode() + body).hexdigest()[:24]
        return self.directory / f"{key}.json"

    @staticmethod
    def _replay_headers(headers):
        replayed = {}
        for name, value in headers.items():
            if name.lower() not in DROP_HEADERS:
                replayed[name] = value
        return replayed


addons = [ApiCache()]
