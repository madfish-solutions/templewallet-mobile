#!/bin/bash
# Open a Flashlight web report for a results JSON file.
#
# Flashlight 0.21.0 embeds a viewer that bundles two copies of React. The page
# renders with one copy and calls hooks on the other, so the report stays blank.
# When that binary is installed, retarget both copies before generating the page.
# flashlight report then writes the HTML and opens it in the browser.

set -euo pipefail

if [[ $# -ne 1 || -z "${1:-}" ]]; then
  echo "Usage: yarn android:flashlight:report <results.json>" >&2
  exit 1
fi

if [[ ! -f "$1" ]]; then
  echo "Report file not found: $1" >&2
  exit 1
fi

results="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"

flashlight_bin="$(command -v flashlight || true)"
if [[ -z "$flashlight_bin" ]]; then
  echo "flashlight is not installed." >&2
  exit 1
fi

python3 - "$flashlight_bin" << 'PY'
import sys
from pathlib import Path

binary = Path(sys.argv[1]).resolve()
data = binary.read_bytes()

react_broken = b'p("5yMxB",function(e,t){e.exports=h("eOWv1")})'
react_fixed = b'p("5yMxB",function(e,t){e.exports=h("5Uwnz")})'
dom_broken = b'e.exports=h("fXLjt")'
dom_fixed = b'e.exports=h("58T4P")'

if len(react_broken) != len(react_fixed) or len(dom_broken) != len(dom_fixed):
    raise SystemExit("Flashlight patch strings differ in length.")

broken_react = data.count(react_broken)
broken_dom = data.count(dom_broken)
fixed_react = data.count(react_fixed)

if broken_react == 1 and broken_dom == 1:
    backup = binary.with_name(binary.name + ".bak")
    if not backup.exists():
        backup.write_bytes(data)
        print(f"Saved the unpatched Flashlight binary to {backup}")
    binary.write_bytes(data.replace(react_broken, react_fixed).replace(dom_broken, dom_fixed))
    print(f"Patched the Flashlight report viewer in {binary}")
elif broken_react == 0 and broken_dom == 0 and fixed_react == 1:
    print(f"Flashlight report viewer in {binary} is already patched")
else:
    print(
        "This Flashlight build does not contain the known report viewer bug. Leaving it unchanged.",
        file=sys.stderr,
    )
PY

flashlight report "$results"
