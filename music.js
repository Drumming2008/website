let musicPage = document.getElementById("music")

let categories = {
    "SATB": {

    },
    "TTBB": {
        
    }
}

for (let [k, v] of Object.entries(categories)) {
    let h2 = document.createElement("h2")
    h2.innerText = k
    musicPage.append(h2)
}
