function getWords(letters: number) {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();

        if (letters === 3) 
            request.open("GET", "../../data/JSON-files/three-letters-words.json");

        if (letters === 4) 
            request.open("GET", "../../data/JSON-files/four-letters-words.json");

        if (letters === 5) 
            request.open("GET", "../../data/JSON-files/five-letters-words.json");

        if (letters === 6) 
            request.open("GET", "../../data/JSON-files/six-letters-words.json");

        request.onreadystatechange = function() {
            if (request.status === 200)
                resolve(JSON.parse(request.responseText));

            else 
                reject("could not fetch data");
        }
        request.send();
    })
}

class GetLevel {
    public name: string;
    public letters: number[];
    public time: number;
    public lives: number;
    constructor(name: string, letters: number[], time: number, lives: number) {
        this.name = name;
        this.letters = letters;
        this.time = time;
        this.lives = lives;
    }

    protected wordsArrs: (string[])[] = [];
    protected randomWordsArr: number = 0;
    protected randomWordsInArr: number = 0;
    public wordsArr: string[] = [];
    public dataCheck: boolean = false;
    getLevelWordsArrs(wordsCount: number) {
        this.dataCheck = false;
        this.wordsArr = [];
        for (let i = 0; i < this.letters.length; i++) {
            let test = false;
            getWords(this.letters[i])
            .then((resolveValue) => {
                this.wordsArrs.push(resolveValue as string[]);
                if (i === this.letters.length - 1) {
                    for (let i = 0; i < wordsCount; i++) {
                        this.randomWordsArr = Math.floor(Math.random() * this.wordsArrs.length);
                        this.randomWordsInArr = Math.floor(Math.random() * this.wordsArrs[this.randomWordsArr].length);
                        this.wordsArr.push(this.wordsArrs[this.randomWordsArr][this.randomWordsInArr]);
                    }
                }
                this.dataCheck = true;
            })
            .catch((err) => {
                console.log(`Error: ${err}`);
            });
        }
    }
}

let easy = new GetLevel("Easy", [3, 4], 8, 5);
let medium = new GetLevel("Medium", [4, 5], 6, 3);
let hard = new GetLevel("Hard", [6], 4, 1);
let insane = new GetLevel("لفل الوحش", [6], 2, 0);

let levels = [easy, medium, hard, insane];

if (localStorage.getItem("lvlIndex") == null) {
    localStorage.setItem("lvlIndex", "0");
}
let currentLevel = levels[Number(localStorage.getItem("lvlIndex"))];


const changeLvlBtn = document.getElementById("change-level") as HTMLButtonElement;
const closeLvlBtn = document.querySelector(".close-level-sec") as HTMLButtonElement;
const changeLvlSec = document.querySelector(".change-level-sec") as HTMLDivElement;
const lvlName = document.querySelector(".lvl-name") as HTMLSpanElement;

for (let i = 0; i < levels.length; i++) {
    let levelToAdd = document.createElement("h2");
    levelToAdd.setAttribute("data-index", i.toString())
    levelToAdd.textContent = levels[i].name;
    changeLvlSec.appendChild(levelToAdd);
}

changeLvlBtn.addEventListener("click", function() {
    changeLvlSec.classList.toggle("active");
})
closeLvlBtn.addEventListener("click", function() {
    changeLvlSec.classList.toggle("active");
})

for (let i = 1; i < changeLvlSec.children.length; i++) {
    changeLvlSec.children[i].addEventListener("click", function() {
        currentLevel = levels[Number(changeLvlSec.children[i].getAttribute("data-index"))];
        localStorage.setItem("lvlIndex", (i - 1).toString());
        changeLvlSec.classList.toggle("active");
        lvlName.textContent = currentLevel.name;
    })
}

lvlName.textContent = levels[Number(localStorage.getItem("lvlIndex"))].name;

const startGameBtn = document.querySelector(".start-game") as HTMLButtonElement;
const gameDiv = document.querySelector(".main-game") as HTMLDivElement;

function getWord(wordIndex: number, wordsLost: number, gameTime: number, lives: number) {
    let livesVar = lives;

    let wordCheck: boolean = true;
    let wordsLostVar: number = wordsLost;

    let wordTime: boolean = true;
    let currentSecond: number = currentLevel.time;

    let wordInterval = setInterval(() => {
        if (currentSecond === 0) {
            wordTime = false;
            clearInterval(wordInterval);
            endGame();
            return undefined;
        }
        currentSecond--;
    }, 1000)

    let gameTimeVar: number = gameTime;
    let gameInterval = setInterval(() => {
        gameTimeVar++;
    }, 100);

    for (let i = gameDiv.children.length - 1; i >= 0; i--) {
        gameDiv.children[i].remove();
    }
    for (let i = 0; i < currentLevel.wordsArr[wordIndex].length; i++) {
        let letter = document.createElement("input");
        letter.setAttribute("data-val", currentLevel.wordsArr[wordIndex][i]);
        letter.setAttribute("placeholder", currentLevel.wordsArr[wordIndex][i]);
        gameDiv.appendChild(letter);

        let letterAfter = currentLevel.wordsArr[wordIndex][i + 1];
        if (i == 0) 
            document.querySelector<HTMLInputElement>(`input[data-val=${letter.getAttribute("data-val")}]`)?.focus()

        letter.addEventListener("input", function() {

            if (!(letter.value === letter.getAttribute("data-val")?.toLowerCase())) {
                wordCheck = false;
                livesVar++;
            }

            letter.setAttribute("data-val", "");

            if (!wordTime || livesVar > currentLevel.lives) {
                clearInterval(wordInterval);
                clearInterval(gameInterval);
                endGame();
                return undefined;
            }

            else if (letter === gameDiv.lastElementChild) {
                if (!wordCheck)
                    wordsLostVar++;

                for (let i = 0; i < gameDiv.children.length; i++) {
                    gameDiv.children[i].remove();
                }
                
                if (wordIndex === currentLevel.wordsArr.length - 1) {
                    console.log("The End Of The Race");
                    clearInterval(gameInterval);
                    console.log(gameTimeVar / 10);
                    endGame();
                    return undefined;
                }
                clearInterval(wordInterval);
                return getWord(wordIndex + 1, wordsLostVar, gameTimeVar, livesVar);
            }

            let inputAfter = document.querySelector<HTMLInputElement>(`input[data-val=${letterAfter}]`);
            inputAfter?.focus();
            letter.setAttribute("disabled", "true");
        })
    }
}

function startGame(wordIndex: number = 0) {
    startGameBtn.classList.toggle("active");
    currentLevel.getLevelWordsArrs(10);
    let dataInterval = setInterval(() => {
        if (currentLevel.dataCheck) 
            clearInterval(dataInterval);
            getWord(wordIndex, 0, 0, 0);
    }, 1000)
}

function endGame() {
    for (let i = gameDiv.children.length - 1; i >= 0; i--) {
        gameDiv.children[i].remove();
    }
}

console.log(startGame());