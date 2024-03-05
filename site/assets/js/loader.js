"use-strict"

const hamburger = () => {
    const hamburger = document.querySelector(".hamburger");
    const sidebar = document.querySelector(".sidebar")
    const icon = document.querySelector("i")
    hamburger.onclick = () => {
        sidebar.style.display = sidebar.style.display === "block" ? "none" : "block";
        sidebar.style.width = sidebar.style.width == "75%" ? "0" : "75%"
        icon.className = icon.className == "fa fa-bars" ? "fa fa-times" : "fa fa-bars"

        if (icon.className == "fa fa-times") {
            document.querySelectorAll(".header").forEach(header => {
                header.onclick = () => {
                    document.querySelector("#page-render").src = header.dataset.ref;
                    sidebar.style.display = "none";
                    sidebar.style.width = "0%"
                }
            });
        }
    }
}

window.onload = () => {
    let sideBar = document.querySelector(".sidebar");
    let rootSide = ReactDOM.createRoot(sideBar);

    const parseJsonLinks = () => {
        fetch("../LINKS.json")
        .then(response => response.json())
        .then(json => {
            rootSide.render(renderSummary(json))
        });
    }

    parseJsonLinks();
    hamburger();

    let lastPage = localStorage.getItem("lastPage");
    if (lastPage) document.querySelector("#page-render").src = lastPage;
}