
export class Bar{
    constructor(bar) {
        this.naam = bar.name;
        this.loc = "Coördinaten: " + bar.lat + ", " + bar.lon;
        this.card = document.createElement('div');
        this.add();
    }
    hide(){
        this.card.style.display = "none";
    }
    async add(){
//html maken
        const bars_list = document.getElementById('bars');
        this.card.classList.add('card');
        let header = document.createElement('div');
        header.classList.add('card-header');
        this.titel = document.createElement('p');
        this.titel.textContent = this.naam;
        this.titel.classList.add('title', 'hoofdletters')
        let body = document.createElement('div');
        body.classList.add('card-body');
        let footer = document.createElement('div');
        footer.classList.add('card-footer');
        let penalty_list = document.createElement('ul');
        penalty_list.classList.add('penalties');
        let locatie = document.createElement('p');
        locatie.textContent = this.loc;
        bars_list.appendChild(this.card);
        this.card.appendChild(header);
        this.card.appendChild(body);
        this.card.appendChild(footer);
        header.appendChild(this.titel);
        body.appendChild(penalty_list);
        footer.appendChild(locatie);
//haal penalties
        const response = await fetch("penalties.json");
        const data = await response.json();
        const negativePenalties = data.penalties.filter(penalty => penalty.Type === 'Negatief');

//maak lijst voor unieke penalties
        const negativeList = document.createElement('ul');
        const negativeTitle = document.createElement('p');
        negativeTitle.classList.add('title');
        negativeTitle.textContent = 'Barspecifieke penalties:';
        penalty_list.appendChild(negativeTitle);
        penalty_list.appendChild(negativeList);

// Neem 5 random penalties
        const negativePenaltiesSubset = negativePenalties.sort(() => 0.5 - Math.random()).slice(0, 5);
        negativePenaltiesSubset.forEach(penalty => {
            const listItem = document.createElement('li');
            const listItemText = document.createElement('p')
            listItemText.innerHTML = `<strong>${penalty.naam}</strong>: ${penalty.beschrijving}`;
            listItem.appendChild(listItemText);
            negativeList.appendChild(listItem);
        });
    }

    setActive(){
        this.card.classList.add('card-active');
        this.titel.textContent += " (huidige bar)"
    }

}