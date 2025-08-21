function id(el) {
  return document.getElementById(el)
}


let pageInfo = {
  home: {
    text: "Home",
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
  }

  a.href = "/" + v.url

  a.onmouseenter = a.onfocus = () => {
    let rect = a.getBoundingClientRect()
    let currentRect = pageInfo[currentTab].link.getBoundingClientRect()
    let navRect = document.querySelector("nav").getBoundingClientRect()
    navCopy.style.clipPath = `
            inset(0 ${navRect.right - Math.max(rect.right, currentRect.right)}px 0 ${Math.min(rect.left, currentRect.left) - navRect.left}px round var(--nav-radius))
        `
  }

  a.onmouseleave = a.onblur = () => {
    let currentRect = pageInfo[currentTab].link.getBoundingClientRect()
    let navRect = document.querySelector("nav").getBoundingClientRect()
    navCopy.style.clipPath = `
            inset(0 ${navRect.right - currentRect.right}px 0 ${currentRect.left - navRect.left}px round var(--nav-radius))
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
  if (location.host != "finnreese.com" && currentTab == "music") return "landscapes"

  let path = parent.location.pathname || location.pathname
  if (path.startsWith("/piece/")) return path.slice(7)
  return null
}

function moveToTab(tab, onClick = false) {
  id("piece").style.display = "none"

  for (let i of document.querySelectorAll("nav > a")) {
    i.tabIndex = ""
  }
  currentTab = tab
  let a = pageInfo[tab].link
  a.tabIndex = -1
  let rect = a.getBoundingClientRect()
  let navRect = document.querySelector("nav").getBoundingClientRect()
  navCopy.style.clipPath = `
    inset(0 ${navRect.right - rect.right}px 0 ${rect.left - navRect.left}px round var(--nav-radius))
  `

  for (let i of pageElemList) {
    i.style.display = "none"
  }
  pageInfo[tab].elem.style.display = ""

  if (!getPieceId() || onClick) {
    id("piece").style.display = "none"
    parent.pushState("/" + pageInfo[tab].url)
  }
  
  if (getPieceId()) {
    let data = musicData[getPieceId()]
    if (!data) {
      location.href = "/404.html"
      return
    }

    id("piece").style.display = ""

    id("piece").innerHTML = `
      <h2>${data.title}</h2>
    `

    if (data.video) {
      id("piece").innerHTML += `<div class="video-wrapper">${data.video}</div>`
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
