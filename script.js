function id(el) {
  return document.getElementById(el)
}

window.addEventListener("popstate", () => {
  location.reload()
})

window.addEventListener("pageshow", e => {
  if (e.persisted) {
    location.reload()
  }
})

id("current-year").innerText = new Date().getFullYear()

let navBreakpoint = 700

let pageInfo = {
  home: {
    text: "About",
    url: "",
    id: "home"
  },
  music: {
    text: "Music",
    url: "music"
  },
  recordings: {
    text: "Recordings",
    url: "recordings"
  },
  contact: {
    text: "Contact",
    url: "contact"
  }
}

function isTouchDevice() {
  return (("ontouchstart" in window) ||
     (navigator.maxTouchPoints > 0) ||
     (navigator.msMaxTouchPoints > 0))
}

for (let i of document.querySelectorAll("section")) {
  if (i == id("piece")) continue
  i.style.animation = "none"
  i.style.display = "none"
}

let pageElemList = []

for (let [k, v] of Object.entries(pageInfo)) {
  let a = document.createElement("a")
  a.innerHTML = `
        <span>${v.text}</span>
    `
  v.link = a

  a.onclick = e => {
    e.preventDefault()
    moveToTab(k, true)
    setTimeout(() => { document.querySelector("nav").classList.add("closed") }, 200)
  }

  a.href = "/" + v.url

  a.id = "tab-" + v.url

  a.onmouseenter = a.onfocus = () => {
    if (isTouchDevice()) return

    let rect = a.getBoundingClientRect()
    let currentRect = pageInfo[currentTab].link.getBoundingClientRect()
    let navRect = document.querySelector("nav").getBoundingClientRect()
    navCopy.style.clipPath = `
            inset(${rect.top - navRect.top + 2.5}px ${navRect.right - rect.right + 2.5}px ${navRect.bottom - rect.bottom + 2.5}px ${rect.left - navRect.left + 2.5}px round var(--nav-radius))
        `
  }

  a.onmouseleave = a.onblur = () => {
    let currentRect = pageInfo[currentTab].link.getBoundingClientRect()
    let navRect = document.querySelector("nav").getBoundingClientRect()
    navCopy.style.clipPath = `
            inset(${currentRect.top - navRect.top + 2.5}px ${navRect.right - currentRect.right + 2.5}px ${navRect.bottom - currentRect.bottom + 2.5}px ${currentRect.left - navRect.left + 2.5}px round var(--nav-radius))
        `
  }

  document.querySelector("nav").append(a)

  v.elem = id(v.id || v.url)

  pageElemList.push(v.elem)
}

let navCopy = document.createElement("div")
navCopy.id = "inverted-nav"
navCopy.innerHTML = document.querySelector("nav").innerHTML
navCopy.ariaHidden = true

for (let i of navCopy.children) {
  i.tabIndex = -1
  i.ariaHidden = true
}

document.querySelector("nav").append(navCopy)

function pushState(url) {
  history.pushState({}, "", url)
}

let currentTab = ""

function getPieceId() {
  // if (location.host != "finnreese.com" && currentTab == "music") return "landscapes"

  let path = parent.location.pathname || location.pathname
  if (path.startsWith("/piece/")) return path.slice(7)
  return null
}

function setNavSelector(a) {
  let currentRect = a.getBoundingClientRect()
  let navRect = document.querySelector("nav").getBoundingClientRect()
  navCopy.style.clipPath = `
            inset(${currentRect.top - navRect.top + 2.5}px ${navRect.right - currentRect.right + 2.5}px ${navRect.bottom - currentRect.bottom + 2.5}px ${currentRect.left - navRect.left + 2.5}px round var(--nav-radius))
        `
}

let navWidth = 0

function resize() {
  let logoRect = id("logo").getBoundingClientRect(),
  pieceHeaderRect = id("piece-header").getBoundingClientRect()
  if ((innerWidth - 100) - navWidth > Math.max(logoRect.width, id("piece-header").dataset.shown == "true" ? pieceHeaderRect.width : 0) + 25) {
    document.body.classList.remove("hamburger")
  } else {
    document.body.classList.add("hamburger")
  }

  setNavSelector(pageInfo[currentTab].link)
}

onresize = () => {
  resize()
}

id("hamburger-button").onclick = () => {
  document.querySelector("nav").classList.toggle("closed")
}

let tabMoveTimeout

function moveToTab(tab, onClick = false, pageLoad = false) {
  if (tabMoveTimeout) {
    clearTimeout(tabMoveTimeout)
    document.querySelector(".low-z")?.classList.remove("low-z")
  }

  if (tab == "music") {
    id("music-controls").style.display = ""
    setTimeout(() => {
      id("music-controls").classList.remove("hidden")
    })
  } else {
    id("music-controls").classList.add("hidden")
    setTimeout(() => {
      id("music-controls").style.display = "none"
    }, 500)
  }

  for (let i of document.querySelectorAll("nav > a")) {
    i.tabIndex = ""
    i.classList.remove("selected")
  }

  let oldCurrentElement

  for (let i of pageElemList) {
    if (currentTab && i == pageInfo[currentTab].elem && !getPieceId()) {
      oldCurrentElement = i
    } else if (!getPieceId()) {
      i.style.display = "none"
      i.classList.add("hidden")
    }
  }
  
  pageInfo[tab].elem.style.display = ""
  setTimeout(() => {
    pageInfo[tab].elem.classList.remove("hidden")
  })
  currentTab = tab

  if (oldCurrentElement) {
    oldCurrentElement.classList.add("low-z")
    oldCurrentElement.classList.add("hidden")
    tabMoveTimeout = setTimeout(() => {
      oldCurrentElement.style.display = "none"
      oldCurrentElement.classList.remove("low-z")
    }, 600)
  }
  
  let a = pageInfo[tab].link
  a.tabIndex = -1
  a.classList.add("selected")
  
  setNavSelector(a)

  if (!getPieceId() || onClick) {
    if (!pageLoad) pageInfo[tab].elem.style.animation = ""
    document.querySelector("footer").style.display = ""
    id("music-controls").style.display = ""
    setTimeout(() => {
      document.querySelector("footer").classList.remove("hidden")
    })
    id("piece").classList.add("hidden")
    setTimeout(() => {
      id("piece").style.display = "none"
    }, 500)
    parent.pushState("/" + pageInfo[tab].url)
  }
  
  id("tab-music").style.pointerEvents = ""
  if (getPieceId()) {
    id("tab-music").style.pointerEvents = "all"
    id("tab-music").tabIndex = ""

    let data = musicData[getPieceId()]
    if (!data) {
      location.href = "/404.html"
      return
    }

    id("piece").style.display = ""
    setTimeout(() => {
      id("piece").classList.remove("hidden")
      document.querySelector("footer").classList.add("hidden")
    }, 0)
    setTimeout(() => {
      id("music").style.display = "none"
      document.querySelector("footer").style.display = "none"
    }, 200)

    id("piece").innerHTML = `
      <h2 class="piece-title">
        <button class="icon-button back-to-pieces">  
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path></svg>
        </button>
        “${data.title}” (${data.year})
      </h2>
      <span class="piece-instr">${data.instr.replace("divisi", "<i>divisi</i>")}</span>
    `

    id("piece").scrollTop = 0

    id("piece-header-text").innerText = `“${data.title}”`

    if (data.video) {
      // let player = new Plyr("")
      console.log("data.videoID", data.videoID)
      id("piece").innerHTML += `
      <div class="video-wrapper">
        <div class="plyr__video-embed" id="video-${data.videoID}">
          ${data.video}
        </div>
      </div>`

    }

    if (data.desc) {
      id("piece").innerHTML += `
        <div class="piece-desc">
          <h3 class="piece-desc-title">Program Note</h3>
          <p>
            ${data.desc}
          </p>
        </div>
      `
    }

    // keep at end

    let player = new Plyr(`#video-${data.videoID}`, {
        // Custom controls layout
        controls: [
          "play", 
          "progress", 
          "duration",
          "current-time", 
          "mute", 
          "volume",
          "fullscreen"
        ],
        keyboard: {
          focused: true,
          global: true
        },
        tooltips: {
          controls: false,
          seek: true
        },
        youtube: { 
          controls: 0,
          showinfo: 0,
          rel: 0
        },
        hideControls: false
      })

      let playerSVGs = {
        pressed: [
          // pause
          '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M216,48V208a16,16,0,0,1-16,16H160a16,16,0,0,1-16-16V48a16,16,0,0,1,16-16h40A16,16,0,0,1,216,48ZM96,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V48A16,16,0,0,0,96,32Z"></path></svg>',
          // muted speaker
          '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M213.92,210.62a8,8,0,1,1-11.84,10.76L160,175.09v48.6a8.29,8.29,0,0,1-3.91,7.18,8,8,0,0,1-9-.56l-65.55-51A4,4,0,0,1,80,176.18V87.09L42.08,45.38A8,8,0,1,1,53.92,34.62Zm-27.21-55.46a8,8,0,0,0,11.29-.7,40,40,0,0,0,0-52.88,8,8,0,1,0-12,10.57,24,24,0,0,1,0,31.72A8,8,0,0,0,186.71,155.16Zm40.92-80.49a8,8,0,1,0-11.92,10.66,64,64,0,0,1,0,85.34,8,8,0,1,0,11.92,10.66,80,80,0,0,0,0-106.66ZM153,119.87a4,4,0,0,0,7-2.7V32.25a8.27,8.27,0,0,0-2.88-6.4,8,8,0,0,0-10-.16L103.83,59.33a4,4,0,0,0-.5,5.85ZM60,80H32A16,16,0,0,0,16,96v64a16,16,0,0,0,16,16H60a4,4,0,0,0,4-4V84A4,4,0,0,0,60,80Z"></path></svg>',
          // small screen
          '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M152,96V48a8,8,0,0,1,16,0V88h40a8,8,0,0,1,0,16H160A8,8,0,0,1,152,96ZM96,152H48a8,8,0,0,0,0,16H88v40a8,8,0,0,0,16,0V160A8,8,0,0,0,96,152Zm112,0H160a8,8,0,0,0-8,8v48a8,8,0,0,0,16,0V168h40a8,8,0,0,0,0-16ZM96,40a8,8,0,0,0-8,8V88H48a8,8,0,0,0,0,16H96a8,8,0,0,0,8-8V48A8,8,0,0,0,96,40Z"></path></svg>'
        ],
        notPressed: [
          // play
          '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z"></path></svg>',
          // unmuted speaker
          '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M160,32.25V223.69a8.29,8.29,0,0,1-3.91,7.18,8,8,0,0,1-9-.56l-65.57-51A4,4,0,0,1,80,176.16V79.84a4,4,0,0,1,1.55-3.15l65.57-51a8,8,0,0,1,10,.16A8.27,8.27,0,0,1,160,32.25ZM60,80H32A16,16,0,0,0,16,96v64a16,16,0,0,0,16,16H60a4,4,0,0,0,4-4V84A4,4,0,0,0,60,80Zm126.77,20.84a8,8,0,0,0-.72,11.3,24,24,0,0,1,0,31.72,8,8,0,1,0,12,10.58,40,40,0,0,0,0-52.88A8,8,0,0,0,186.74,100.84Zm40.89-26.17a8,8,0,1,0-11.92,10.66,64,64,0,0,1,0,85.34,8,8,0,1,0,11.92,10.66,80,80,0,0,0,0-106.66Z"></path></svg>',
          // full screen
          '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M216,48V88a8,8,0,0,1-16,0V56H168a8,8,0,0,1,0-16h40A8,8,0,0,1,216,48ZM88,200H56V168a8,8,0,0,0-16,0v40a8,8,0,0,0,8,8H88a8,8,0,0,0,0-16Zm120-40a8,8,0,0,0-8,8v32H168a8,8,0,0,0,0,16h40a8,8,0,0,0,8-8V168A8,8,0,0,0,208,160ZM88,40H48a8,8,0,0,0-8,8V88a8,8,0,0,0,16,0V56H88a8,8,0,0,0,0-16Z"></path></svg>'
        ]
      }

      player.on("ready", (event) => {
        let buttonList = [...document.querySelectorAll(".plyr__controls button")]
        for (let i = 0; i < buttonList.length; i++) {
          let elem = buttonList[i]
          elem.querySelector(".icon--not-pressed").remove()
          elem.innerHTML += playerSVGs.notPressed[i].replace("fill=\"#000000\"", "fill=\"currentColor\" class=\"icon--not-pressed\"")
          elem.querySelector(".icon--pressed").remove()
          elem.innerHTML += playerSVGs.pressed[i].replace("fill=\"#000000\"", "fill=\"currentColor\" class=\"icon--pressed\"")
        }
      })
    id("piece").querySelector(".back-to-pieces").onclick = () => {
      id("tab-music").click()
    }
  }
}

let params

onload = () => {
  navWidth = document.querySelector("nav").getBoundingClientRect().width
  
  params = new URLSearchParams(location.search)
  if (params.has("p")) {
    moveToTab(params.get("p"), false, true)
  } else {
    moveToTab("home", false, true)
  }

  resize()
}

let form = id("form")

form.onsubmit = async e => {
  if (!form.checkValidity()) return

  e.preventDefault()
  let name = id("name").value, email = id("email").value, message = id("message").value

  let res = await fetch("/api/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, message })
  })

  id("form").style.display = "none"
  id("form-complete").style.display = ""
}


id("piece").onscroll = e => {
  let scrollPos = id("piece").scrollTop
  if (scrollPos >= 100) {
    id("piece-header").classList.add("shown")
    id("piece-header").dataset.shown = true
    id("logo").classList.add("hidden")
  } else {
    id("piece-header").classList.remove("shown")
    id("piece-header").dataset.shown = false
    id("logo").classList.remove("hidden")
  }
  resize()
}

id("back-to-pieces").onclick = () => {
  id("tab-music").click()
  id("piece-header").classList.remove("shown")
  id("piece-header").dataset.shown = false
  id("logo").classList.remove("hidden")
  resize()
}

id("contact").prepend(id("links").cloneNode(true))

id("clear-search").onclick = () => {
  id("search-music").value = ""
  search()
}
