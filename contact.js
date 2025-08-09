document.getElementById("message").onkeydown = e => {
    if (e.code == "Enter") {
        if (document.getElementById("message").offsetHeight <= document.getElementById("message").value.split("\n").length * 25) {
            document.getElementById("message").style.height = document.getElementById("message").offsetHeight + 25 + "px"
        }
    }
}