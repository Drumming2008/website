function createToast(text) {
  let toast = document.createElement("div")
  toast.classList.add("toast")
  toast.classList.add("hidden")
  toast.innerHTML = text
  document.body.append(toast)
  setTimeout(() => {
    toast.classList.remove("hidden")
  })
  setTimeout(() => {
    toast.classList.add("hidden")
    setTimeout(() => {
      toast.remove()
    }, 400)
  }, 2000)
}

function id(id) {
  return document.getElementById(id)
}

id("back").onclick = () => {
  location = "/"
}

let upload = id("pdf-upload")
let button = id("add-watermark")

upload.oninput = () => {
  id("upload-output").innerText = upload.files[0].name
}

button.addEventListener("click", async () => {
  if (!upload.files.length) {
    alert("Please choose a PDF first!")
    return
  }

  let file = upload.files[0]
  let bytes = await file.arrayBuffer()

  let pdfDoc = await PDFLib.PDFDocument.load(bytes)
  let font = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold)

  let pages = pdfDoc.getPages()

  for (let page of pages) {
    let { width, height } = page.getSize()

    let text = id("large-text").value
    let size = 40
    let angle = 45

    let textWidth = font.widthOfTextAtSize(text, size)
    let textHeight = font.heightAtSize(size)

    let radians = angle * Math.PI / 180

    // Size of the rotated bounding box
    let rotatedWidth =
      Math.abs(textWidth * Math.cos(radians)) +
      Math.abs(textHeight * Math.sin(radians))

    let rotatedHeight =
      Math.abs(textWidth * Math.sin(radians)) +
      Math.abs(textHeight * Math.cos(radians))

    page.drawText(text, {
      x: (width - rotatedWidth) / 2,
      y: (height - rotatedHeight) / 2,
      size,
      font,
      color: PDFLib.rgb(0, 0, 0),
      opacity: 0.875,
      rotate: PDFLib.degrees(angle)
    })

    page.drawText(id("bottom-text").value, {
      x: 5,
      y: 5,
      size: 12,
      font,
      color: PDFLib.rgb(0, 0, 0),
      opacity: 1
    })
  }

  let pdfBytes = await pdfDoc.save()

  let blob = new Blob([pdfBytes], {
    type: "application/pdf"
  })

  let url = URL.createObjectURL(blob)

  let a = document.createElement("a")
  a.href = url
  a.download = file.name.replace(/\.pdf$/i, "") + "_watermarked.pdf"
  a.click()

  URL.revokeObjectURL(url)

  createToast("Watermarked PDF Downloaded")
})

id("upload").onclick = () => {
  upload.click()
}

id("png-pdf-button").onclick = () => {
  id("png-pdf-upload").click()
}

id("png-pdf-upload").onchange = () => {
  id("png-pdf-output").innerText = id("png-pdf-upload").files[0].name
}

async function downloadPNG(hd) {
  if (!id("png-pdf-upload").files.length) {
    alert("Please choose a PDF first!")
    return
  }

  let pdfFile = id("png-pdf-upload").files[0]
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs"

  let pdf = await pdfjsLib.getDocument({
    data: await pdfFile.arrayBuffer()
  }).promise

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    let page = await pdf.getPage(pageNum)

    let viewport = page.getViewport({ scale: hd ? 8 : 2 })

    let canvas = document.createElement("canvas")
    let ctx = canvas.getContext("2d")

    canvas.width = viewport.width
    canvas.height = viewport.height

    await page.render({
      canvasContext: ctx,
      viewport
    }).promise

    let a = document.createElement("a")
    a.href = canvas.toDataURL()
    a.download = `${pdfFile.name.split(".")[0]}_${pageNum}.png`
    a.click()
  }
  createToast("PNGs Downloaded")
}

id("png-pdf-download").onclick = async () => {
  downloadPNG()
}

id("png-pdf-download-hd").onclick = async () => {
  downloadPNG(true)
}

function resetFieldsets() {
  for (let i of document.querySelectorAll("fieldset")) {
    let selector = i.querySelector(".radio-selector")
    
    function moveSelector() {
      let rect = i.getBoundingClientRect()
      let checked = i.querySelector("input:checked"), checkedRect = checked.getBoundingClientRect()
      selector.style.left = checkedRect.left - rect.left + "px"
      selector.style.height = checkedRect.height + "px"
      selector.style.width = checkedRect.width + "px"
    }

    moveSelector()

    for (let j of i.querySelectorAll("input")) {
      j.onclick = () => {
        moveSelector()
      }
    }

    addEventListener("resize", () => {
      moveSelector()
    })  
  }

  for (let i of document.querySelectorAll("#side-by-side input")) {
    i.oninput = () => {
      if (i.value == "disabled") {
        id("aspect-ratio").disabled = false
      } else {
        id("aspect-ratio-page").click()
        id("aspect-ratio").disabled = true
      }
    }
  }
}

function getFieldsetValue(fieldset) {
  return fieldset.querySelector("input:checked").value
}

resetFieldsets()

let noteData = {
  "A": {
    enharmonics: [],
    noteVariants: ["Ab", "A", "A#"]
  },
  "Bb": {
    enharmonics: [
      "A#"
    ],
    noteVariants: ["B", "Bb", "B#"]
  },
  "A#": {
    enharmonics: [
      "Bb"
    ],
    noteVariants: ["Ab", "A", "A#"]
  },
  "B": {
    enharmonics: [
      "Cb"
    ],
    noteVariants: ["Bb", "B", "B#"]
  },
  "Cb": {
    enharmonics: [
      "B"
    ],
    noteVariants: ["C", "Cb", "C#"]
  },
  "C": {
    enharmonics: [
      "B#"
    ],
    noteVariants: ["Cb", "C", "C#"]
  },
  "B#": {
    enharmonics: [
      "C"
    ],
    noteVariants: ["Bb", "B", "B#"]
  },
  "Db": {
    enharmonics: [
      "C#"
    ],
    noteVariants: ["D", "Db", "D#"]
  },
  "C#": {
    enharmonics: [
      "Db"
    ],
    noteVariants: ["Cb", "C", "C#"]
  },
  "D": {
    enharmonics: [],
    noteVariants: ["Db", "D", "D#"]
  },
  "Eb": {
    enharmonics: [
      "D#"
    ],
    noteVariants: ["E", "Eb", "E#"]
  },
  "D#": {
    enharmonics: [
      "Eb"
    ],
    noteVariants: ["Db", "D", "D#"]
  },
  "E": {
    enharmonics: [
      "Fb"
    ],
    noteVariants: ["Eb", "E", "E#"]
  },
  "Fb": {
    enharmonics: [
      "E"
    ],
    noteVariants: ["F", "Fb", "F#"]
  },
  "F": {
    enharmonics: [
      "E#"
    ],
    noteVariants: ["Fb", "F", "F#"]
  },
  "E#": {
    enharmonics: [
      "F"
    ],
    noteVariants: ["Eb", "E", "E#"]
  },
  "Gb": {
    enharmonics: [
      "F#"
    ],
    noteVariants: ["G", "Gb", "G#"]
  },
  "F#": {
    enharmonics: [
      "Gb"
    ],
    noteVariants: ["Fb", "F", "F#"]
  },
  "G": {
    enharmonics: [],
    noteVariants: ["Gb", "G", "G#"]
  },
  "Ab": {
    enharmonics: [
      "G#"
    ],
    noteVariants: ["A", "Ab", "A#"]
  },
  "G#": {
    enharmonics: [
      "Ab"
    ],
    noteVariants: ["Gb", "G", "G#"]
  }
}

function getHarpGlissandos(inputNotes) {
  let strings = ["C", "D", "E", "F", "G", "A", "B"]
  let results = []

  let allowedNotes = []

  for (let note of inputNotes) {
    allowedNotes.push(note)
    allowedNotes.push(...noteData[note].enharmonics)
  }

  allowedNotes = [...new Set(allowedNotes)]

  function search(index, tuning) {
    if (index == strings.length) {
      let valid = inputNotes.every(input => {
        return tuning.some(note => {
          return note == input || noteData[input].enharmonics.includes(note)
        })
      })

      if (valid) {
        results.push([...tuning])
      }

      return
    }

    let stringNote = strings[index]

    // Find all possible spellings for this string
    let variants = Object.keys(noteData).filter(note => {
      return note[0] == stringNote
    })

    for (let variant of variants) {
      if (allowedNotes.includes(variant)) {
        tuning.push(variant)
        search(index + 1, tuning)
        tuning.pop()
      }
    }
  }

  search(0, [])

  return results
}

let harpPedals = [
  "D", "C", "B", "E", "F", "G", "A"
]

id("check-harp-glissandos").onclick = () => {
  let value = id("harp-notes").value
  let lines = value.split("\n")
  let chars = "ABCDEFGb#"
  for (let line of lines) {
    for (let char of line.split("")) {
      if (!chars.includes(char)) {
        createToast("<b>Illegal characters!</b><br>You can only use A, B, C, D, E, F, G, #, or b!")
        return
      }
    }
  }

  let glissandos = getHarpGlissandos(lines)
  let output = id("harp-output")
  output.innerHTML = `${glissandos.length} Options<br>`
  for (let i of glissandos) {
    let option = i.sort((a, b) => {
      return harpPedals.indexOf(a.split("")[0]) - harpPedals.indexOf(b.split("")[0])
    })
    output.innerHTML += "<p></p>"
    for (let j of option) {
      output.lastChild.innerHTML += `<span>${j.replace("#", "♯").replace("b", "♭  ")} </span>`
    }
  }
}
