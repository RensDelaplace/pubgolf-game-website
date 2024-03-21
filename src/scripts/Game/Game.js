import { Player } from './Player.js';
import { Bar } from './Bar.js';

export class Game{
    constructor(playerStorage, bars, activeBar) {
        //initialiseren
        this.activeBar = 0;
        if(activeBar!==null){this.activeBar = activeBar;}
        this.players = [];
        this.bars = [];
        this.barSec = document.getElementById("bars-section");

        let nextBtn = document.getElementById("next");
        nextBtn.addEventListener('click', this.nextbar.bind(this));
        this.setPlayers(playerStorage);
        this.addStandardPenalties();
        this.updateRanking();

        //bars instellen
        for(let bar of bars){
            let barObj = new Bar(bar);
            this.bars.push(barObj);
        }

        for (let i = 0; i < this.activeBar; i++){
            this.bars[i].hide();
        }
        this.bars[this.activeBar].setActive();
        if(this.activeBar + 1 >= this.bars.length){
            this.gameDone();
        }
    }

    setPlayers(playerStorage){
        for(let player of playerStorage){
            this.players.push(new Player(player.name, player.score));
        }
    }
//gaat nr volgende bar
    nextbar(){
        this.updateRanking();
        this.bars[this.activeBar].hide();
        this.activeBar += 1;
        sessionStorage.setItem('activeBar', this.activeBar);
        if(this.activeBar + 1 >= this.bars.length){
            this.gameDone();
        }else{
            this.bars[this.activeBar].setActive();
        }
    }

    //standaard penalties toevoegen
    async addStandardPenalties(){
        const response = await fetch("penalties.json");
        const data = await response.json();
        const standardPenalties = data.penalties.filter(penalty => penalty.Type === 'Standaard');
        let penalty_list = document.getElementById("standardPenalties");

        // Create standard penalties list and append to container
        const standardList = document.createElement('ul');
        const standardTitle = document.createElement('p');
        standardTitle.classList.add('title');
        standardTitle.textContent = 'Standaard penalties:';
        penalty_list.appendChild(standardTitle);
        penalty_list.appendChild(standardList);

        standardPenalties.forEach(penalty => {
            const listItem = document.createElement('li');
            const listItemText = document.createElement('p')
            listItemText.innerHTML = `<strong>${penalty.naam}</strong>: ${penalty.beschrijving}`;
            listItem.appendChild(listItemText);
            standardList.appendChild(listItem);
        });
    }

    //eindigt het spel
    gameDone(){
        this.barSec.style.display = "none";
        document.getElementById("spelregels").hidden = true;
        for (let speler of this.players){
            speler.removeButton();
        }
        let restartKnop = document.createElement('button');
        restartKnop.textContent = "Restart"
        restartKnop.classList.add('btn')
        restartKnop.addEventListener('click', this.restart);
        let container = document.getElementById('inGame');
        container.appendChild(restartKnop);
    }
    //spel herstarten
    restart(){
        sessionStorage.setItem('gameStarted', false);
        sessionStorage.setItem('activeBar', 0);
        sessionStorage.setItem('players', null);
        location.reload();
    }



    updateRanking(){
        this.players.sort((a, b) => a.score - b.score);
        let ranking = document.getElementById('ranking');
        ranking.innerHTML = ''
        this.players.forEach((player, index) => {
            player.addToScorebord(index + 1);
        });
    }
}









