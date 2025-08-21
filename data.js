let musicCategories = [
    {
        name: "Chamber/Small Ensemble",
        id: "chamber"
    }
]

let musicData = [
    {
        title: "Landscapes",
        cat: "chamber",
        video: '<iframe width="560" height="315" src="https://www.youtube.com/embed/vU4ypttR1Ek?si=v9GA64c-1utNalic" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'
    }
]

let newMusicData = {}
for (let i of musicData) {
    newMusicData[i.title.toLowerCase().replaceAll(" ", "-")] = i
}

musicData = newMusicData
