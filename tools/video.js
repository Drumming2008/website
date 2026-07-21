import { Muxer, ArrayBufferTarget } from "https://unpkg.com/mp4-muxer/build/mp4-muxer.mjs"

id("video-upload-pdf").onclick = () => {
  id("video-pdf-input").click()
}

id("video-pdf-input").oninput = () => {
  id("video-upload-pdf-output").innerText = id("video-pdf-input").files[0].name
}

id("video-upload-video").onclick = () => {
  id("video-video-input").click()
}

id("video-video-input").oninput = () => {
  id("video-upload-video-output").innerText = id("video-video-input").files[0].name
}

let audioDuration, stepSize = 10, samples, globalViewport, audioContext, source, audioBuffer

function xToTime(pos) {
  return ((pos / (samples * devicePixelRatio)) * audioDuration) / stepSize
}

function formatTime(totalSeconds) {
  let totalMs = totalSeconds * 1000

  let mins = Math.floor(totalMs / 60000)
  let secs = Math.floor((totalMs % 60000) / 1000)
  let ms = Math.floor(totalMs % 1000)

  let paddedMins = String(mins).padStart(2, "0")
  let paddedSecs = String(secs).padStart(2, "0")
  let paddedMs = String(ms).padStart(3, "0")

  return `${paddedMins}:${paddedSecs}.${paddedMs}`
}

function addNewSlide(num) {
  let wrapper = document.createElement("div")
  wrapper.classList.add("timeline-wrapper")
  let newCanvas = document.createElement("canvas")
  wrapper.append(newCanvas)
  let number = document.createElement("div")
  number.innerText = num
  number.classList.add("timeline-number")
  wrapper.append(number)
  id("edit-timeline").append(wrapper)
  let trash = document.createElement("button")
  trash.classList.add("icon-button")
  trash.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>'
  trash.classList.add("timeline-delete")
  trash.onclick = () => {
    wrapper.remove()
  }
  wrapper.append(trash)

  let resizeBar = document.createElement("div")
  resizeBar.classList.add("resize-bar")
  resizeBar.innerHTML = "<div></div>"
  wrapper.append(resizeBar)

  let mouseDown = false

  resizeBar.onmousedown = () => {
    mouseDown = true
    document.body.classList.add("resizing")
  }

  resizeBar.ondblclick = () => {
    wrapper.style.width = (id("caret").getBoundingClientRect().left - wrapper.getBoundingClientRect().left) + "px"
  }

  document.addEventListener("mouseup", () => {
    mouseDown = false
    document.body.classList.remove("resizing")
    id("timestamp-tooltip").style.display = "none"
  })

  document.addEventListener("mousemove", e => {
    if (mouseDown) {
      let pos = (e.clientX - wrapper.getBoundingClientRect().left)
      if (pos <= 10) return
      wrapper.style.width = pos + "px"
      id("timestamp-tooltip").style.display = ""
      id("timestamp-tooltip").style.left = e.clientX + "px"
      id("timestamp-tooltip").style.top = e.clientY + "px"
      id("timestamp-tooltip").innerText = formatTime(xToTime(e.clientX- id("edit-timeline").getBoundingClientRect().left) * stepSize)
    }
  })

  return newCanvas
}

id("upload-video-files").onclick = async () => {
  if (!id("video-video-input").files.length || !id("video-pdf-input").files.length) {
    alert("Please choose both an audio/video file and a PDF!")
    return
  }

  id("video-editor-wrapper").style.display = ""
  id("video-upload-wrapper").style.display = "none"

  let pdfFile = id("video-pdf-input").files[0]
  let audioFile = id("video-video-input").files[0]

  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs"

  let pdf = await pdfjsLib.getDocument({
    data: await pdfFile.arrayBuffer()
  }).promise

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    let page = await pdf.getPage(pageNum)

    let viewport = page.getViewport({ scale: 2 })

    let canvas = document.createElement("canvas")
    let ctx = canvas.getContext("2d")

    globalViewport = viewport

    canvas.width = viewport.width
    canvas.height = viewport.height

    await page.render({
      canvasContext: ctx,
      viewport
    }).promise

    let button = document.createElement("button")
    button.innerHTML = `<div>${pageNum}</div>`
    button.append(canvas)
    id("panel-1").append(button)

    button.onclick = async () => {
      let newCanvas = addNewSlide(pageNum)
      newCanvas.width = viewport.width
      newCanvas.height = viewport.height
      await page.render({
        canvasContext: newCanvas.getContext("2d"),
        viewport
      }).promise
    }
  }

  id("order").onclick = () => {
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      id("panel-1").children[pageNum - 1].click()
    }
  }

  // audio stuff

  audioContext = new AudioContext()
  let buffer = await audioFile.arrayBuffer()
  audioBuffer = await audioContext.decodeAudioData(buffer)

  audioDuration = audioBuffer.duration

  let channelData = audioBuffer.getChannelData(0)

  samples = audioBuffer.duration * 11
  let waveform = []

  let playPos = 0, playing = false
  id("play").onclick = () => {
    if (playPos * stepSize >= audioBuffer.duration) return
    playing = true
    id("play").style.display = "none"
    id("pause").style.display = ""
    source = audioContext.createBufferSource()
    source.buffer = audioBuffer
    source.connect(audioContext.destination)
    console.log(playPos * stepSize)
    source.start(0, playPos * stepSize)
  }

  id("pause").onclick = () => {
    playing = false
    id("play").style.display = ""
    id("pause").style.display = "none"
    source.stop()
  }

  document.addEventListener("keydown", e => {
    if (e.code == "Space") {
      e.preventDefault()
      if (playing) {
        id("pause").click()
      } else {
        id("play").click()
      }
    }
    if (e.code == "Enter") {
      e.preventDefault()
      id("restart").click()
    }
  })

  id("restart").onclick = () => {
    source.stop()
    playing = false
    id("play").style.display = ""
    id("pause").style.display = "none"
    playPos = 0
    id("caret").style.left = 0
    updateTimestemp()
  }

  let mouseDown = false

  id("timeline").onmousedown = e => {
    mouseDown = true
    let pos = e.clientX - id("timeline").getBoundingClientRect().left
    id("caret").style.left = pos + "px"
    playPos = xToTime(pos)
    document.body.classList.add("grabbing")
    updateTimestemp()

    if (playing) {
      playing = false
      id("play").style.display = ""
      id("pause").style.display = "none"
      source.stop()
    }
  }

  document.addEventListener("mouseup", () => {
    mouseDown = false
    document.body.classList.remove("grabbing")
  })

  function updateTimestemp() {
    id("timestamp").innerText = formatTime(playPos * stepSize)
  }

  document.addEventListener("mousemove", e => {
    if (mouseDown) {
      document.body.classList.add("grabbing")
      let pos = e.clientX - id("timeline").getBoundingClientRect().left
      if (pos < 0) {
        pos = 0
      } else if (pos > id("timeline").getBoundingClientRect().width) {
        pos = id("timeline").getBoundingClientRect().width
      }
      id("caret").style.left = pos + "px"
      playPos = ((pos / (samples * devicePixelRatio)) * audioBuffer.duration) / stepSize
      updateTimestemp()
    }
  })

  let playInterval = setInterval(() => {
    if (playing) {
      let pos = ((playPos * stepSize) / audioBuffer.duration) * (samples * devicePixelRatio)
      id("caret").style.left = pos + "px"
      updateTimestemp()

      playPos += (1 / stepSize) / audioBuffer.duration
    }
  }, 1000 / stepSize)

  updateTimestemp()

  for (let i = 0; i < samples; i++) {
    let start = Math.floor(i * channelData.length / samples)
    let end = Math.floor((i + 1) * channelData.length / samples)

    let sum = 0

    for (let j = start; j < end; j++) {
      sum += Math.abs(channelData[j])
    }

    waveform.push(sum / (end - start))
  }

  let audioCanvas = id("audio-canvas")
  let ctx = audioCanvas.getContext("2d")

  audioCanvas.width = samples * devicePixelRatio
  audioCanvas.style.width = audioCanvas.width + "px"
  audioCanvas.height = id("timeline").getBoundingClientRect().height * devicePixelRatio
  ctx.scale(devicePixelRatio, devicePixelRatio)

  ctx.beginPath()

  ctx.fillStyle = "white"
  ctx.fillRect(0, 0, audioCanvas.width, audioCanvas.height)

  ctx.strokeStyle = "#2d4f94"
  ctx.lineWidth = 2

  for (let i = 0; i < waveform.length; i++) {
    let x = i
    let y = audioCanvas.height / 2 - waveform[i] * 100

    if (i == 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }

  ctx.stroke()

}

id("render").onclick = async () => {
  let slides = []
  for (let i of [...document.querySelectorAll(".timeline-wrapper")]) {
    let rect = i.getBoundingClientRect(), editTimelineRect = id("edit-timeline").getBoundingClientRect()
    slides.push({
      start: xToTime(rect.left - editTimelineRect.left) * stepSize,
      end: xToTime(rect.right - editTimelineRect.left) * stepSize,
      number: parseInt(i.querySelector(".timeline-number").innerText),
      image: i.querySelector("canvas").toDataURL("image/png")
    })
  }

  let frameImages = [], fps = 60, totalFrames = Math.ceil(audioDuration * fps)
  for (let frame = 0; frame < totalFrames; frame++) {
    let t = frame / fps
    let slide = slides.find(s => t >= s.start && t < s.end)
    if (!slide) continue
    let img = document.createElement("img")
    img.src = slide.image
    await img.decode()
    frameImages[frame] = img
  }

  id("video-editor-wrapper").style.display = "none"
  id("video-loading").style.display = ""

  let canvas = document.createElement("canvas")
  canvas.width = globalViewport.width
  canvas.height = globalViewport.height

  let ctx = canvas.getContext("2d")

  let muxer = new Muxer({
    target: new ArrayBufferTarget(),
    fastStart: "in-memory",
    video: {
      codec: "avc",
      width: canvas.width,
      height: canvas.height
    },
    audio: {
      codec: "aac",
      sampleRate: audioBuffer.sampleRate,
      numberOfChannels: audioBuffer.numberOfChannels
    }
  })

  let encoder = new VideoEncoder({
    output(chunk, meta) {
      muxer.addVideoChunk(chunk, meta)
    },
    error(err) {
      console.error(err)
    }
  })

  encoder.configure({
    codec: "avc1.640033",
    width: canvas.width,
    height: canvas.height,
    bitrate: 8000000,
    framerate: fps
  })

  let audioEncoder = new AudioEncoder({
    output(chunk, meta) {
      muxer.addAudioChunk(chunk, meta)
    },
    error(err) {
      console.error(err)
    }
  })

  audioEncoder.configure({
    codec: "mp4a.40.2",
    sampleRate: audioBuffer.sampleRate,
    numberOfChannels: audioBuffer.numberOfChannels,
    bitrate: 128000
  })

  let frame = 0

  for (; frame < frameImages.length; frame++) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (frameImages[frame]) {
      ctx.drawImage(
        frameImages[frame],
        0,
        0,
        canvas.width,
        canvas.height
      )
    }

    let videoFrame = new VideoFrame(canvas, {
      timestamp: Math.round(frame * 1000000 / fps),
      duration: Math.round(1000000 / fps)
    })

    encoder.encode(videoFrame)

    videoFrame.close()

    await encoder.flush()
  }

  let audioData = []

  let frameSize = 960
  let channels = audioBuffer.numberOfChannels
  let length = audioBuffer.length

  let channelArrays = []

  for (let c = 0; c < channels; c++) {
    channelArrays.push(audioBuffer.getChannelData(c))
  }

  for (let offset = 0; offset < length; offset += frameSize) {
    let frames = Math.min(frameSize, length - offset)

    let data = new Float32Array(frames * channels)

    for (let i = 0; i < frames; i++) {
      for (let c = 0; c < channels; c++) {
        data[i * channels + c] = channelArrays[c][offset + i]
      }
    }

    let audioFrame = new AudioData({
      format: "f32",
      sampleRate: audioBuffer.sampleRate,
      numberOfFrames: frames,
      numberOfChannels: channels,
      timestamp: Math.round(offset / audioBuffer.sampleRate * 1000000),
      data
    })

    audioEncoder.encode(audioFrame)

    audioFrame.close()
  }

  await audioEncoder.flush()
  await encoder.flush()

  muxer.finalize()

  let blob = new Blob([muxer.target.buffer], {
    type: "video/mp4"
  })

  id("video-loading").style.display = "none"
  id("another-video").style.display = ""

  id("another-video").onclick = () => {
    location.reload()
  }

  let url = URL.createObjectURL(blob)

  let a = document.createElement("a")
  a.href = url
  a.download = `${(id("video-video-input").files[0].name).split(".")[0]}.mp4`
  a.click()

  URL.revokeObjectURL(url)
}
