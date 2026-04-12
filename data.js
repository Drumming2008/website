let musicCategories = [
    {
        name: "Chamber/Small Ensemble",
        id: "chamber"
    },
    {
        name: "Choral",
        id: "choral"
    },
    {
        name: "Jazz Band/Steel Drums",
        id: "jazz"
    }
]

let musicSubcategories = [
    {
        name: "SATB",
        id: "satb",
        parent: "choral"
    },
    {
        name: "SSAA",
        id: "ssaa",
        parent: "choral"
    },
    {
        name: "TTBB",
        id: "ttbb",
        parent: "choral"
    },
    {
        name: "Jazz",
        id: "jazz",
        parent: "jazz"
    },
    {
        name: "Steel Drums",
        id: "steel drums",
        parent: "jazz"
    }
]

let musicData = [
    {
        title: "Landscapes",
        instr: "String Quartet",
        year: 2025,
        cat: "chamber",
        video: '<iframe width="560" height="315" src="https://www.youtube.com/embed/vU4ypttR1Ek?si=v9GA64c-1utNalic" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        desc: "“Landscapes” is a piece for string quartet that I originally composed for a summer program at Boston Conservatory at Berklee. I liked the themes in the original score, but had ideas for improving it and adding to it. In this piece, I wanted to experiment with something different and used some aleatoric pizzicato that sounds a bit like rain. Because I haven’t often used extended techniques in my compositions, I thought it would be interesting to combine the aleatoric pizzicato with more traditional melody. The melody almost floats on top of the harmony, which sits almost static, or changes slowly at random times. I hope the listener will experience the different landscapes that the same theme is shown in during the piece."
    },
    {
        title: "Turbulence",
        instr: "String Trio",
        year: 2024,
        cat: "chamber"
    },
    {
        title: "Clarinet Vibes",
        instr: "Clarinet, Vibraphone",
        year: 2025,
        cat: "chamber",
        video: '<iframe width="560" height="315" src="https://www.youtube.com/embed/aw63xr-lTis?si=9PPEbQejimsEmSx7" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'
    },
    {
        title: "Binary Rhythms",
        instr: "Percussion Trio",
        year: 2025,
        cat: "chamber",
        desc: "My inspiration for this piece was to write something engaging, while not heavily relying on melody and harmony. With the nature of percussion being closely tied to rhythm more so than pitch, this piece seemed like the perfect time to try taking a diﬀerent approach than I normally do. I start oﬀ the piece with just a single repeated rhythm, giving the listener something to grab onto as a theme throughout the piece, even though it isn’t melodic. Later on, I do introduce pitched instruments, although my approach to using them was more as color than as specific notes or chords in a key. I hope that this piece accomplishes the goal of creating an interesting experience for the listener that highlights rhythm."},
    {
        title: "Deely Stan",
        instr: "Steel Drum Band",
        year: 2023,
        cat: "jazz",
        subcat: "steel drums",
        video: '<iframe width="560" height="315" src="https://www.youtube.com/embed/3S0DxOIJGFM?si=l9bTNMZujM8EW8Bk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'
    },
    {
        title: "Flow State",
        instr: "Big Band",
        year: 2026,
        cat: "jazz",
        subcat: "jazz"
    },
    {
        title: "For the Beauty of the Earth",
        instr: "TTBB Choir, divisi",
        year: 2025,
        cat: "choral",
        subcat: "ttbb",
        video: '<iframe width="560" height="315" src="https://www.youtube.com/embed/bfz72TKPpC0?si=AK41WPffoZDAO7BF" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        desc: "“For the Beauty of the Earth” is a TTBB choral piece, based on a Christian hymn of the same name. With my choir, Ragazzi Boys Chorus, I’ve sung two diﬀerent settings of “For the Beauty of the Earth” by other composers, and I was drawn to the lyrics. The structure of the poem has multiple stanzas that all finish with “Lord of all….” Using this structure, I created a build-up throughout the piece, where each verse is diﬀerent or bigger than the previous verse, starting with just one part singing the words, and culminating with every part singing in counterpoint."
    },
    {
        title: "For the Beauty of the Earth",
        instr: "SSAA Choir, divisi",
        year: 2025,
        cat: "choral",
        subcat: "ssaa",
        id: "for-the-beauty-of-the-earth-2"
    },
    {
        title: "The Lonely Bird",
        instr: "SATB Choir",
        year: 2025,
        cat: "choral",
        subcat: "satb"
    },
    {
        title: "Ave Maria",
        instr: "SATB Choir, divisi",
        year: 2026,
        cat: "choral",
        subcat: "satb"
    },
    {
        title: "Rain Music",
        instr: "SATB Choir, divisi",
        year: 2024,
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
