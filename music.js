let musicPage = document.getElementById("music"),
  musicCategoryElements = {}, musicSubcategoryElements = {}

let videoID = 0
for (let i of Object.keys(musicData)) {
  musicData[i].videoID = videoID
  // if (musicData[i].video) {
  //   let videoWrapper = document.createElement("div")
  //   videoWrapper.classList.add("plyr__video-embed")
  //   videoWrapper.classList.add("video-inner-wrapper")
  //   videoWrapper.id = `video-${musicData[i].videoID}`
  //   videoWrapper.innerHTML = musicData[i].video
  //   id("video-storage").append(videoWrapper)
  // }

  videoID++
}



for (let i of musicCategories) {
  let details = document.createElement("details")

  let summary = document.createElement("summary")
  summary.innerHTML = `
    <h2>${i.name.replace("/", "<b>/</b>")}</h2>
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path></svg>
  `
  details.append(summary)

  let content = document.createElement("ul")
  content.classList.add("details-content")
  details.append(content)

  id("music-content").append(details)

  musicSubcategories.push({
    name: "",
    id: i.id + "-subcat",
    parent: i.id
  })

  for (let j of musicSubcategories) {
    if (j.parent != i.id) continue
    let wrapper = document.createElement("li")
    let ul = document.createElement("ul")
    ul.classList.add("sub-category")
    let title = document.createElement("h3")
    title.innerText = j.name
    if (j.name) ul.append(title)
    else ul.style.marginLeft = "-10px"
    musicSubcategoryElements[j.id] = ul
    wrapper.append(ul)
    content.append(wrapper)
  }

  musicCategoryElements[i.id] = content
}

function sortListAlphabetically(list) {
  let items = Array.from(list.querySelectorAll("li"))
  items.sort((a, b) =>
    a.textContent.trim().localeCompare(b.textContent.trim(), undefined, {
      sensitivity: "base"
    })
  )
  let fragment = document.createDocumentFragment()

  for (let i = 0; i < items.length; i++) {
    fragment.append(items[i])
  }
  list.append(fragment)
}

for (let i of Object.values(musicData)) {
  let piece = document.createElement("li")

  let title = document.createElement("div")
  let titleLink = document.createElement("a")
  titleLink.href = "/piece/" + (i.id || i.title.toLowerCase().replaceAll(" ", "-"))
  titleLink.innerHTML = `${i.title}`
  title.append(titleLink)

  if (i.arrangement) {
    let arrangement = document.createElement("span")
    arrangement.innerText = "Arrangement"
    arrangement.classList.add("arrangement-label")
    title.prepend(arrangement)
  }

  let titleInfo = document.createElement("div")
  titleInfo.innerHTML = `<span>${i.composer ? " by " + i.composer : ""}</span><span> ${i.instr == "Lead Sheet" ? "" : "for "}${i.instr.replace("divisi", "<i>divisi</i>")}<span class="comma">,</span></span><span class="year"> ${i.year}</span>`
  title.append(titleInfo)

  titleLink.onclick = e => {
    e.preventDefault()
    parent.pushState(titleLink.href)
    moveToTab("music")
  }

  piece.append(title)

  if (i.subcat) {
    musicSubcategoryElements[i.subcat].append(piece)
  } else {
    musicSubcategoryElements[i.cat + "-subcat"].append(piece)
  }
}

for (let i of document.querySelectorAll(".sub-category")) {
  sortListAlphabetically(i)
}

for (let i of document.querySelectorAll(".details-content")) {
  id("search-content").append(i.cloneNode(true))
}

for (let i of document.querySelectorAll("#search-content a")) {
  i.onclick = e => {
    e.preventDefault()
    parent.pushState(i.href)
    moveToTab("music")
  }
}

function search() {
  if (!id("search-music").value.trim() && !id("filters").value) {
    id("music-content").style.display = ""
    id("search-content").style.display = ""
    return
  }

  id("music-content").style.display = "none"
  id("search-content").style.display = "flex"

  let index = 0
  for (let i of document.querySelectorAll("#search-content a")) {
    i.parentElement.parentElement.style.display = "none"
    i.parentElement.parentElement.parentElement.parentElement.classList.add("hidden")
    i.closest(".details-content").classList.add("hidden")
  }

  let numResults = 0
  for (let i of document.querySelectorAll("#search-content a")) {
    let value = 0
    if (i.innerText.toLowerCase().includes(id("search-music").value.toLowerCase()) || !id("search-music").value.trim()) {
      value++
    }
    if (i.parentElement.querySelector("div").lastChild.innerText.trim() == id("filters").value || !id("filters").value) {
      value++
    }

    if (value == 2) {
      i.parentElement.parentElement.style.display = ""
      i.parentElement.parentElement.style.setProperty("--delay", index)
      index++
      i.parentElement.parentElement.parentElement.parentElement.classList.remove("hidden")
      i.closest(".details-content").classList.remove("hidden")
      numResults++
    }
  }

  id("search-num").innerHTML = `${numResults} r<span>esult${numResults == 1 ? "" : "s"}</span>`
}

id("search-music").oninput = () => {
  search()
}

id("filters").onchange = () => {
  search()
}

id("music").onscroll = () => {
  let musicControlsPos = id("music-controls").getBoundingClientRect()
  id("music").classList.remove("bordered")
  for (let i of document.querySelectorAll("details")) {
    let pos = i.getBoundingClientRect()
    i.getElementsByTagName("summary")[0].classList.remove("bordered-details")
    if (pos.top <= musicControlsPos.bottom && pos.bottom > musicControlsPos.bottom) {
      id("music").classList.add("bordered")
      i.getElementsByTagName("summary")[0].classList.add("bordered-details")
      let left = 0, right = 0
      let top = pos.top - musicControlsPos.bottom
      let br = parseInt(document.documentElement.style.getPropertyValue("--br").replace("px", "")) || 5
      let bottom = (musicControlsPos.bottom + br + 1) - pos.bottom

      let clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px round var(--br))`
      id("music").style.setProperty("--clip-path", clipPath)
      break
    }
  }
}
