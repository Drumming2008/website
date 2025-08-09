function pushState(url) {
    url = "/f/website" + url
    history.pushState({}, "", url)
}
