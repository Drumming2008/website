let videos = [
    '<iframe width="560" height="315" src="https://www.youtube.com/embed/idPwxVcJAH0?si=iBP-mQoSlu7DNMye" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'
]

for (let i of videos) {
    id("recordings").innerHTML += i
}
