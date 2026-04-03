let musicCategories = [
    {
        name: "Chamber/Small Ensemble",
        id: "chamber"
    },
    {
        name: "Jazz Band/Steel Drums",
        id: "jazz"
    },
    {
        name: "Choral",
        id: "choral"
    }
]

let musicSubcategories = [
    {
        name: "SATB",
        id: "satb",
        parent: "choral"
    },
    {
        name: "TTBB",
        id: "ttbb",
        parent: "choral"
    }
]

let musicData = [
    {
        title: "Landscapes",
        instr: "String Quartet",
        year: 2025,
        cat: "chamber",
        video: '<iframe width="560" height="315" src="https://www.youtube.com/embed/vU4ypttR1Ek?si=v9GA64c-1utNalic" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'
    },
    {
        title: "Clarinet Vibes",
        instr: "Clarinet, Vibraphone",
        year: 2025,
        cat: "chamber",
        video: '<iframe width="560" height="315" src="https://www.youtube.com/embed/aw63xr-lTis?si=9PPEbQejimsEmSx7" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'
    },
    {
        title: "Deely Stan",
        instr: "Steel Drum Band",
        year: 2023,
        cat: "jazz",
        video: '<iframe width="560" height="315" src="https://www.youtube.com/embed/3S0DxOIJGFM?si=l9bTNMZujM8EW8Bk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'
    },
    {
        title: "For the Beauty of the Earth",
        instr: "TTBB Choir, <i>divisi</i>",
        year: 2025,
        cat: "choral",
        subcat: "ttbb",
        video: '<iframe width="560" height="315" src="https://www.youtube.com/embed/bfz72TKPpC0?si=AK41WPffoZDAO7BF" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'
    },
    {
        title: "The Lonely Bird",
        instr: "SATB Choir",
        year: 2025,
        cat: "choral",
        subcat: "satb"
    },
    {
        title: "The Lonely Bird",
        id: "the-lonely-bird-2",
        instr: "TTBB Choir",
        year: 2025,
        cat: "choral",
        subcat: "ttbb"
    }
]

let newMusicData = {}
for (let i of musicData) {
    newMusicData[i.id || i.title.toLowerCase().replaceAll(" ", "-")] = i
}

musicData = newMusicData
