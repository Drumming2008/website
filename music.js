let musicPage = document.getElementById("music"),
    musicCategoryElements = {}, musicSubcategoryElements = {}

for (let i of musicCategories) {
    let details = document.createElement("details")
    
    let summary = document.createElement("summary")
    summary.innerHTML = `
        <h2>${i.name}</h2>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path></svg>
    `
    details.append(summary)

    let content = document.createElement("ul")
    content.classList.add("details-content")
    details.append(content)

    musicPage.append(details)

    for (let j of musicSubcategories) {
        if (j.parent != i.id) continue
        let wrapper = document.createElement("div")
        wrapper.classList.add("sub-category")
        let title = document.createElement("h3")
        title.innerText = j.name
        wrapper.append(title)
        musicSubcategoryElements[j.id] = wrapper
        content.append(wrapper)
    }

    musicCategoryElements[i.id] = content
}

for (let i of Object.values(musicData)) {
    let piece = document.createElement("li")

    let title = document.createElement("div")
    let titleLink = document.createElement("a")
    titleLink.href = "/piece/" + i.title.toLowerCase().replaceAll(" ", "-")
    titleLink.innerHTML = `${i.title}`
    title.append(titleLink)

    let titleInfo = document.createElement("div")
    titleInfo.innerHTML = `<span>for ${i.instr}</span><span class="year">${i.year}</span>`
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
        musicCategoryElements[i.cat].prepend(piece)
    }
}
