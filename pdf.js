function toggleFullscreen(elem, button) {
  if (!document.fullscreenElement) {
    elem.requestFullscreen()
  } else {
    document.exitFullscreen?.()
  }

  update()

  function update() {
    let fullscreen = !!document.fullscreenElement

    button.children[0].style.display = fullscreen ? "none" : ""
    button.children[1].style.display = fullscreen ? "" : "none"
  }

  document.onfullscreenchange = update
}

function createPDF(elem, pdf) {
  let outerWrapper = document.createElement("div")
  outerWrapper.style.width = "65ch"
  outerWrapper.style.maxWidth = "100%"
  outerWrapper.style.margin = "0 auto"
  elem.append(outerWrapper)

  let wrapper = document.createElement("div")
  wrapper.classList.add("pdf-wrapper")
  outerWrapper.append(wrapper)

  let title = document.createElement("h3")
  title.innerText = "Perusal Score"
  title.classList.add("piece-header")
  title.style.marginTop = "25px"
  wrapper.before(title)

  let buttons = document.createElement("div")
  buttons.classList.add("pdf-buttons")
  wrapper.append(buttons)

  let currentPage = 0

  let prev = document.createElement("button")
  prev.classList.add("icon-button")
  prev.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path></svg>`
  prev.classList.add("prev-button")
  buttons.append(prev)

  let next = document.createElement("button")
  next.classList.add("icon-button")
  next.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path></svg>`
  next.classList.add("next-button")
  buttons.append(next)

  let fullscreen = document.createElement("button")
  fullscreen.classList.add("icon-button")
  fullscreen.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48V88a8,8,0,0,1-16,0V56H168a8,8,0,0,1,0-16h40A8,8,0,0,1,216,48ZM88,200H56V168a8,8,0,0,0-16,0v40a8,8,0,0,0,8,8H88a8,8,0,0,0,0-16Zm120-40a8,8,0,0,0-8,8v32H168a8,8,0,0,0,0,16h40a8,8,0,0,0,8-8V168A8,8,0,0,0,208,160ZM88,40H48a8,8,0,0,0-8,8V88a8,8,0,0,0,16,0V56H88a8,8,0,0,0,0-16Z"></path></svg><svg xmlns="http://www.w3.org/2000/svg" style="display: none" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M152,96V48a8,8,0,0,1,16,0V88h40a8,8,0,0,1,0,16H160A8,8,0,0,1,152,96ZM96,152H48a8,8,0,0,0,0,16H88v40a8,8,0,0,0,16,0V160A8,8,0,0,0,96,152Zm112,0H160a8,8,0,0,0-8,8v48a8,8,0,0,0,16,0V168h40a8,8,0,0,0,0-16ZM96,40a8,8,0,0,0-8,8V88H48a8,8,0,0,0,0,16H96a8,8,0,0,0,8-8V48A8,8,0,0,0,96,40Z"></path></svg>`
  fullscreen.classList.add("fullscreen-button")
  buttons.append(fullscreen)

  fullscreen.onclick = () => {
    toggleFullscreen(wrapper, fullscreen)
  }

  let pdfURL = `/pdfs/${pdf}.pdf`

  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs"

  pdfjsLib.getDocument({ url: pdfURL }).promise.then(pdfDoc => {
    buttons.style.zIndex = pdfDoc.numPages + 1

    prev.onclick = () => {
      if (currentPage - 1 >= 0) {
        goToPDFPage(wrapper, currentPage - 1)
        currentPage -= 1
      }
    }

    next.onclick = () => {
      if (currentPage + 1 < pdfDoc.numPages) {
        goToPDFPage(wrapper, currentPage + 1)
        currentPage += 1
      }
    }

    let pageSets = []
    for (let i = 0; i <= pdfDoc.numPages; i++) {
      if (i % 2 == 0) continue
      let pageSet = document.createElement("div")
      pageSet.classList.add("page-set")
      pageSet.style.zIndex = pdfDoc.numPages - i
      if (i == 1) pageSet.classList.add("shown")
      else pageSet.style.display = "none"
      wrapper.append(pageSet)
      pageSets.push(pageSet)
    }

    for (let i = 0; i <= pdfDoc.numPages; i++) {
      pdfDoc.getPage(i).then(page => {
        let canvas = document.createElement("canvas")
        canvas.classList.add("pdf-canvas")
        if (i % 2 == 0) {
          pageSets[Math.floor(i / 2) - 1].append(canvas)
          console.log("2")
        } else {
          pageSets[Math.floor(i / 2)].append(canvas)
          console.log("n/a")
        }

        let viewport = page.getViewport({ scale: 1 })
        canvas.width = viewport.width * devicePixelRatio
        canvas.height = viewport.height * devicePixelRatio

        let ctx = canvas.getContext("2d")
        let renderContext = {
          canvasContext: ctx,
          viewport: viewport
        }

        ctx.scale(devicePixelRatio, devicePixelRatio)

        page.render(renderContext)
      })
    }
  })
}

function goToPDFPage(wrapper, page) {
  let pages = [...wrapper.querySelectorAll(".page-set")]
  pages[page].style.display = ""
  setTimeout(() => {
    wrapper.querySelector(".page-set.shown").classList.remove("shown")
    pages[page].classList.add("shown")
  })
  
}

window.createPDF = createPDF
window.goToPDFPage = goToPDFPage
