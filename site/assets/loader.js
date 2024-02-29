"use-strict"

// Function to make list entries
const makeEntry = (url, text, isMain) => {
    const newText = document.createElement("li");
    newText.textContent = text;
    newText.dataset.ref = url;
    if (isMain === false) newText.onclick = () => {
        document.querySelector("#page-render").src = url
        document.title = "DocGen " + text;
        localStorage.setItem("lastPage",url)
    }
    if (isMain) newText.className = "main-header";
    else newText.className = "header";
    return newText;
}

// Duties on page load
window.onload = () => {
    let sideBar = document.querySelector(".sidebar");

    // Handle JSON data of existing pages
    const parseJsonLinks = () => {
        fetch("../LINKS.json")
        .then(response => response.json())
        .then(json => {
            // Loop raw JSON data
            for (const tree in json) {
                let link = json[tree];
                let structure = tree.split("/");
                let list = sideBar;
                let subList;

                // Loop current structure
                for (let i = 0; i < structure.length; i++) {
                    let currentText = structure[i];
                    let currentID = structure.slice(0, i + 1).join("-");
                    subList = Array.from(list.querySelectorAll("ul")).find(ul => ul.id === currentID);

                    // Checks and list creation
                    if (currentText === "MAIN") continue;
                    if (!subList) {
                        let isMain = (currentText === currentID && currentText !== "README");
                        subList = document.createElement("ul");
                        subList.id = currentID;
                        subList.appendChild(makeEntry(link, currentText,isMain));
                        list.appendChild(subList);
                    }

                    // Update list
                    list = subList;
                }
            }
        });
    }
    parseJsonLinks();

    // Set page to last visited url
    let lastPage = localStorage.getItem("lastPage");
    if (lastPage){
        document.querySelector("#page-render").src = lastPage;
    }

    // Trigger menu
    const hamburger = document.querySelector(".hamburger");
    const sidebar = document.querySelector(".sidebar")
    const icon = document.querySelector("i")
    hamburger.onclick = () => {
        sidebar.style.display = sidebar.style.display === "block" ? "none" : "block";
        sidebar.style.width = sidebar.style.width == "75%" ? "0" : "75%"
        icon.className = icon.className == "fa fa-bars" ? "fa fa-times" : "fa fa-bars"
    }
}