id("close-banner").onclick = () => {
  id("banner").remove()
}

function id(el) {
  return document.getElementById(el)
}

function footer(el) {
  let footer = document.createElement("footer")
  footer.innerHTML = `
    <div class="links">
      <a href="https://youtube.com/@finn-reese" class="youtube-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M234.33,69.52a24,24,0,0,0-14.49-16.4C185.56,39.88,131,40,128,40s-57.56-.12-91.84,13.12a24,24,0,0,0-14.49,16.4C19.08,79.5,16,97.74,16,128s3.08,48.5,5.67,58.48a24,24,0,0,0,14.49,16.41C69,215.56,120.4,216,127.34,216h1.32c6.94,0,58.37-.44,91.18-13.11a24,24,0,0,0,14.49-16.41c2.59-10,5.67-28.22,5.67-58.48S236.92,79.5,234.33,69.52Zm-73.74,65-40,28A8,8,0,0,1,108,156V100a8,8,0,0,1,12.59-6.55l40,28a8,8,0,0,1,0,13.1Z"></path></svg> Youtube
      </a>
      <a href="mailto:finn.reese@gmail.com" class="email-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-96,85.15L52.57,64H203.43ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.18V181.82Z"></path></svg> Email
      </a>
    </div>
  `
  el.append(footer)
}

window.addEventListener("popstate", () => {
  location.reload()
})

window.addEventListener("pageshow", e => {
  if (e.persisted) {
    location.reload()
  }
})

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

console.log(pageElemList)

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
  currentTab = tab
  let a = pageInfo[tab].link
  a.tabIndex = -1
  a.classList.add("selected")
  
  setNavSelector(a)

  for (let i of pageElemList) {
    i.style.display = "none"
  }
  pageInfo[tab].elem.style.display = ""

  if (!getPieceId() || onClick) {
    id("piece").classList.add("hidden")
    setTimeout(() => {
      id("piece").style.display = "none"
    }, 200)
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

footer(id("home"))
footer(id("contact"))
