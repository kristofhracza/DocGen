"use-strict"

const hamburger = () => {
    const hamburger = document.querySelector(".hamburger");
    const sidebar = document.querySelector(".sidebar")
    const iframe = document.querySelector(".iframe-container");
    const icon = document.querySelector("i")

    // Looks weird, but --> DRY
    const OFF = () =>{
        iframe.style.filter = "brightness(100%)";
        sidebar.style.display = "none";
        icon.className = "fa fa-bars"
    }
    const ON = () => {
        iframe.style.filter = "brightness(50%)";
        sidebar.style.display = "block";
        icon.className = "fa fa-times"
    }

    hamburger.onclick = () => {
        if (icon.className == "fa fa-times") {
            OFF();
            document.querySelectorAll(".header").forEach(header => {
                header.onclick = () => {
                    OFF();
                    document.querySelector("#page-render").src = header.dataset.ref;
                }
            });
        }
        else if (icon.className == "fa fa-bars") {
            ON();
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