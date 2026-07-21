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
