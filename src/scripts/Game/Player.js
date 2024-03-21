export class Player{
    static teller = 0;
    constructor(name, score) {
        this.id = Player.teller++;
        this._name = name;
        this._score = score;
    }

    get name(){
        return this._name;
    }
    set name(newName) {
        this._name = newName;
    }
    get score(){
        return this._score;
    }
    set score(score) {
        this._score = score;
    }
    //geeft een 'slag'
    addPoint(){
        this._score +=1;
        let players = JSON.parse(sessionStorage.getItem('players')) || [];
        const playerIndex = players.findIndex(player => player.name === this._name);
        players[playerIndex].score += 1;
        sessionStorage.setItem('players', JSON.stringify(players));
        document.getElementById("td_scoretext_"+this.id).textContent = this.score;
    }
//html
    addToScorebord(position){
        let naam = document.createElement('td');
        let scoreText = document.createElement('td');
        scoreText.id =  "td_scoretext_"+this.id;
        let pos = document.createElement('td');
        let buttonPos = document.createElement('td');
        buttonPos.id = "td_btnPos_"+this.id;
        let button = document.createElement('button');
        button.addEventListener('click', () => this.addPoint());
        button.classList.add('btn', 'addPoint');
        button.setAttribute('id', `${this._name}_button`);
        button.textContent = '+';
        naam.textContent = this._name;
        scoreText.textContent = this.score;
        pos.textContent = position;
        let rij = document.createElement('tr');
        document.getElementById('ranking').appendChild(rij);
        rij.appendChild(pos);
        rij.appendChild(naam);
        rij.appendChild(scoreText);
        rij.appendChild(buttonPos);
        buttonPos.appendChild(button)
    }
    //doe plusknop weg na game
    removeButton(){
        document.getElementById("td_btnPos_"+this.id).style.display = "none"
    }
}