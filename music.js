let musicPage = document.getElementById("music"),
    musicCategoryElements = {}, musicSubcategoryElements = {}

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

    musicPage.append(details)

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
