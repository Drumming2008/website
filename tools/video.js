import { FFmpeg } from "https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/esm/index.js"
import { fetchFile } from "https://unpkg.com/@ffmpeg/util@0.12.1/dist/esm/index.js"

const ffmpeg = new FFmpeg()

await ffmpeg.load({
  coreURL: "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js",
  wasmURL: "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.wasm"
})
