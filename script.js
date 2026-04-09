id("close-banner").onclick = () => {
  id("banner").remove()
}

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

onresize = () => {
  setNavSelector(pageInfo[currentTab].link)
}

id("hamburger-button").onclick = () => {
  document.querySelector("nav").classList.toggle("closed")
}

function moveToTab(tab, onClick = false) {
  for (let i of document.querySelectorAll("nav > a")) {
    i.tabIndex = ""
    i.classList.remove("selected")
  }

  for (let i of pageElemList) {
    console.log("pageinfo", pageInfo, currentTab, pageInfo[currentTab])
    if (currentTab && i == pageInfo[currentTab].elem) {
      i.classList.add("low-z")
      setTimeout(() => {
        i.style.display = "none"
        i.classList.add("hidden")
        i.classList.remove("low-z")
      }, 500)
    } else {
      i.style.display = "none"
      i.classList.add("hidden")
    }
  }
  
  pageInfo[tab].elem.style.display = ""
  setTimeout(() => {
    pageInfo[tab].elem.classList.remove("hidden")
  })
  currentTab = tab
  
  let a = pageInfo[tab].link
  a.tabIndex = -1
  a.classList.add("selected")
  
  setNavSelector(a)

  if (!getPieceId() || onClick) {
    id("piece").classList.add("hidden")
    setTimeout(() => {
      id("piece").style.display = "none"
    }, 500)
    parent.pushState("/" + pageInfo[tab].url)
  }
  
  if (getPieceId()) {
    let data = musicData[getPieceId()]
    if (!data) {
      location.href = "/404.html"
      return
    }

    id("piece").style.display = ""
    setTimeout(() => { id("piece").classList.remove("hidden") }, 0)
    setTimeout(() => {
      id("music").style.display = "none"
    }, 200)

    id("piece").innerHTML = `
      <h2 class="piece-title">
        <button class="icon-button back-to-pieces">  
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path></svg>
        </button>
        ${data.title}
      </h2>
    `

    if (data.video) {
      id("piece").innerHTML += `<div class="video-wrapper">${data.video}</div>`
    }

    if (data.desc) {
      id("piece").innerHTML += `<p class="piece-desc">${data.desc}</p>`
    }

    // keep at end
    id("piece").querySelector(".back-to-pieces").onclick = () => {
      id("tab-music").click()
    }
  }
}

let params

onload = () => {
  params = new URLSearchParams(location.search)
  if (params.has("p")) {
    moveToTab(params.get("p"))
  } else {
    moveToTab("home")
  }
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
