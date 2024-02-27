"use-strict"

const makeEntry = (url, text, isMain) => {
    const newText = document.createElement("li");
    newText.textContent = text;
    newText.dataset.ref = url;
    if (isMain === false) newText.onclick = () => {
        document.getElementById("page-render").src = url;
        document.title = "DocGen " + text;
        localStorage.setItem("lastPage",url)
    }

    return newText;
}

window.onload = () => {
    let sideBar = document.getElementsByClassName("sidebar")[0];

    // Handle JSON data of existing pages
    const parseJsonLinks = () => {
        fetch("../LINKS.json")
        .then(response => response.json())
        .then(json => {
            for (const tree in json) {
                let link = json[tree];
                let structure = tree.split("/");
                let list = sideBar;
                let subList;

                // Loop current structure
                for (let i = 0; i < structure.length; i++) {
                    let currentText = structure[i];
                    let currentID = structure.slice(0, i + 1).join("-");

                    // Check for existence
                    subList = Array.from(list.querySelectorAll("ul")).find(ul => ul.id === currentID);

                    console.log(currentText,(currentText === currentID));

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
        document.getElementById("page-render").src = lastPage;
    }

    // Trigger menu
    const hamburger = document.getElementsByClassName("hamburger")[0];
    const sidebar = document.getElementsByClassName("sidebar")[0];
    const iframe = document.getElementById("page-render");
    const icon = document.getElementsByTagName("i")[0]; // Assuming the first `i` is the icon
    hamburger.onclick = () => {
        sidebar.style.display = sidebar.style.display === "block" ? "none" : "block";
        iframe.style.display = sidebar.style.display === "none" ? "block" : "none";
        icon.className = icon.className == "fa fa-bars" ? "fa fa-times" : "fa fa-bars"
    }
}