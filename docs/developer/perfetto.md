# Reading an Android Perfetto trace

Record with:

```bash
MYAPP_UPLOAD_STORE_PASSWORD=... MYAPP_UPLOAD_KEY_PASSWORD=... yarn android:perfetto
```

Open the file in `perfetto-reports/` at [ui.perfetto.dev](https://ui.perfetto.dev). The trace stays in the browser.

Flashlight’s score says the import was slow. This trace says which thread was busy, and whether frames missed.

## Find the app

In the search box, type `com.templewallet` and pin these tracks:

| Track | What a long stretch means |
| --- | --- |
| `mqt_v_js` | JavaScript is running. This is the first place to look. |
| `mqt_v_native` | A native module is running. |
| the app main thread | UI work. Slices named `Choreographer#doFrame` are frames. |
| `RenderThread` | Drawing the frame on the GPU. |

Zoom with the trackpad or scroll wheel until one `doFrame` is wide enough to click. Click a slice. The details panel shows its name and duration.

A frame that takes longer than about 16 ms is late at 60 Hz. `previousFramePending` and `PrevGpuFrameMissed` on `surfaceflinger` mark frames the display did not finish in time.

## Why the thread was not on a CPU

Colored time on `mqt_v_js` is the thread running. A gap is the thread waiting.

Click the gap and read `sched_blocked_reason` in the details. `iowait=1` means disk or a similar wait. `iowait=0` means a lock or sleep, and `caller` is the kernel function it stopped in. Pin the other thread named nearby and look at the same time range.

`binder_driver` slices name the call the app was waiting on. `power/cpu_idle` shows a CPU with nothing to run. This emulator often records no `cpu_frequency` changes, so an empty frequency track does not mean the CPU was fast.

The process list at the bottom is sampled once a second. Use it to see whether `com.templewallet` or another process took the CPU over the whole import.

## What this trace does not contain

There are no JavaScript function names. A long `mqt_v_js` slice means the JS thread was busy for that long. `yarn android:hermes` and `yarn ios:hermes` record a Hermes CPU profile of the same import. Open the converted JSON in `hermes-profiles/` at [speedscope.app](https://www.speedscope.app) or [ui.perfetto.dev](https://ui.perfetto.dev).
