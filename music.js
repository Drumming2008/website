let musicPage = document.getElementById("music"),
    musicCategoryElements = {}

for (let i of Object.values(musicCategories)) {
    let details = document.createElement("details")
    
    let summary = document.createElement("summary")
    summary.innerHTML = `
        <h2>${i.name}</h2>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path></svg>
    `
    details.append(summary)

    let content = document.createElement("div")
    content.classList.add("details-content")
    details.append(content)

    musicPage.append(details)

    musicCategoryElements[i.id] = content
}

for (let i of musicData) {
    let piece = document.createElement("div")

    let title = document.createElement("h3")
    title.innerHTML = `<a href="/piece/${i.title.toLowerCase().replaceAll(" ", "-")}">${i.title}</a>`

    piece.append(title)

    musicCategoryElements[i.cat].append(piece)
}
