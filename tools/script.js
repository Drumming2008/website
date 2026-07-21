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
})

id("upload").onclick = () => {
  upload.click()
}

id("png-pdf-button").onclick = () => {
  id("png-pdf-upload").click()
}

id("png-pdf-download").onclick = async () => {
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

    let viewport = page.getViewport({ scale: 2 })

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
}
