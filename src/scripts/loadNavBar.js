function loadNewNavBar(activePage){
    let filename = {"Kaart": "mapPage.html", "Game": "gamePage.html", "Algoritme": "algorithm.html"}

    let start = `<nav class="navbar navbar-expand-lg navbar-dark p-3 sticky-top"">
        <div class="container-fluid">
        <a  class="navbar-brand" href="index.html"><p id="logo">Barhopper</p></a>
            <button class="navbar-toggler custom-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
        <div class="collapse navbar-collapse main_list" id="navbarNavDropdown">
            <ul class="navbar-nav ms-auto">`;

    for(let page of ["Kaart", "Game", "Algoritme"]){
        let state = `nav-item${page === activePage? " active": ""}`
        start += `<li class="${state}">
            <a class="nav-link" href="${filename[page]}"><p class="hoofdletters">${page}</p></a>
        </li>`;
    }

    start += `            </ul>
                    </div>
    </nav>`

    document.body.getElementsByTagName("header")[0].innerHTML += start;
}
