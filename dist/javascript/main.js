"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function getWords(letters) {
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
        request.onreadystatechange = function () {
            if (request.status === 200)
                resolve(JSON.parse(request.responseText));
            else
                reject("could not fetch data");
        };
        request.send();
    });
}
/*

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
*/
class GetLevel {
    constructor(name, letters, time, lives) {
        this.wordsArrs = [];
        this.randomWordsArr = 0;
        this.randomWordsInArr = 0;
        this.wordsArr = [];
        this.dataCheck = false;
        this.name = name;
        this.letters = letters;
        this.time = time;
        this.lives = lives;
    }
    getLevelWordsArrs(wordsCount) {
        return __awaiter(this, void 0, void 0, function* () {
            this.dataCheck = false;
            this.wordsArr = [];
            try {
                for (let letter of this.letters) {
                    let words = yield getWords(letter);
                    this.wordsArrs.push(words);
                }
                for (let i = 0; i < wordsCount; i++) {
                    this.randomWordsArr = Math.floor(Math.random() * this.wordsArrs.length);
                    this.randomWordsInArr = Math.floor(Math.random() * this.wordsArrs[this.randomWordsArr].length);
                    this.wordsArr.push(this.wordsArrs[this.randomWordsArr][this.randomWordsInArr]);
                }
                this.dataCheck = true;
            }
            catch (err) {
                console.error(`Error: ${err}`);
            }
        });
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
const changeLvlBtn = document.getElementById("change-level");
const closeLvlBtn = document.querySelector(".close-level-sec");
const changeLvlSec = document.querySelector(".change-level-sec");
const lvlName = document.querySelector(".lvl-name");
for (let i = 0; i < levels.length; i++) {
    let levelToAdd = document.createElement("h2");
    levelToAdd.setAttribute("data-index", i.toString());
    levelToAdd.textContent = levels[i].name;
    changeLvlSec.appendChild(levelToAdd);
}
changeLvlBtn.addEventListener("click", function () {
    changeLvlSec.classList.toggle("active");
});
closeLvlBtn.addEventListener("click", function () {
    changeLvlSec.classList.toggle("active");
});
for (let i = 1; i < changeLvlSec.children.length; i++) {
    changeLvlSec.children[i].addEventListener("click", function () {
        currentLevel = levels[Number(changeLvlSec.children[i].getAttribute("data-index"))];
        localStorage.setItem("lvlIndex", (i - 1).toString());
        changeLvlSec.classList.toggle("active");
        lvlName.textContent = currentLevel.name;
        timeleft.textContent = currentLevel.time.toString();
        attemps.textContent = currentLevel.lives.toString();
        endGame();
    });
}
lvlName.textContent = levels[Number(localStorage.getItem("lvlIndex"))].name;
const startGameBtn = document.querySelector(".start-game");
const gameDiv = document.querySelector(".main-game .letters");
startGameBtn.addEventListener("click", function () {
    startGame();
});
let wordOne = document.querySelector(".words .wordOne");
let wordTwo = document.querySelector(".words .wordTwo");
let timeleft = document.querySelector(".timeleft h2:last-child");
let attemps = document.querySelector(".attemps h2:last-child");
timeleft.textContent = currentLevel.time.toString();
attemps.textContent = currentLevel.lives.toString();
let highScore = document.querySelector(".high-score h2");
if (localStorage.getItem("wpm"))
    highScore.textContent = Number(localStorage.getItem("wpm")).toFixed(2);
else {
    highScore.textContent = "No Score Yet";
}
function getWord(wordIndex, wordsLost, gameTime, lives) {
    var _a;
    let currentWord = currentLevel.wordsArr[wordIndex];
    let wordAfter = currentLevel.wordsArr[wordIndex + 1];
    wordOne.textContent = currentWord;
    wordTwo.textContent = wordAfter;
    let livesVar = lives;
    let wordCheck = true;
    let wordsLostVar = wordsLost;
    let wordTime = true;
    let currentSecond = currentLevel.time;
    let wordInterval = setInterval(() => {
        if (currentSecond > 0) {
            timeleft.textContent = (Number(timeleft.textContent) - 1).toString();
        }
        if (currentSecond === 0) {
            timeleft.textContent = currentLevel.time.toString();
            wordTime = false;
            endGame();
            clearInterval(wordInterval);
        }
        currentSecond--;
    }, 1000);
    let gameTimeVar = gameTime;
    let gameInterval = setInterval(() => {
        gameTimeVar++;
    }, 100);
    for (let i = gameDiv.children.length - 1; i >= 0; i--) {
        gameDiv.children[i].remove();
    }
    for (let i = 0; i < currentLevel.wordsArr[wordIndex].length; i++) {
        let letter = document.createElement("input");
        letter.setAttribute("data-val", currentLevel.wordsArr[wordIndex][i]);
        letter.setAttribute("placeholder", currentLevel.wordsArr[wordIndex][i].toLowerCase());
        gameDiv.appendChild(letter);
        let letterAfter = currentLevel.wordsArr[wordIndex][i + 1];
        if (i == 0) {
            (_a = document.querySelector(`input[data-val=${letter.getAttribute("data-val")}]`)) === null || _a === void 0 ? void 0 : _a.focus();
            letter.classList.add("focused");
        }
        letter.addEventListener("input", function () {
            var _a;
            if (!(letter.value === ((_a = letter.getAttribute("data-val")) === null || _a === void 0 ? void 0 : _a.toLowerCase()))) {
                wordCheck = false;
                attemps.textContent = (Number(attemps.textContent) - 1).toString();
                livesVar++;
            }
            letter.setAttribute("data-val", "");
            if (!wordTime || livesVar > currentLevel.lives) {
                clearInterval(wordInterval);
                clearInterval(gameInterval);
                endGame();
                return undefined;
            }
            if (letter === gameDiv.lastElementChild) {
                timeleft.textContent = currentLevel.time.toString();
                if (!wordCheck)
                    wordsLostVar++;
                for (let i = 0; i < gameDiv.children.length; i++) {
                    gameDiv.children[i].remove();
                }
                if (wordIndex === currentLevel.wordsArr.length - 1) {
                    clearInterval(gameInterval);
                    let wpm = (60 / (gameTimeVar / 10)) * (currentLevel.wordsArr.length - wordsLostVar);
                    localStorage.setItem("wpm", `${wpm}`);
                    timeleft.textContent = currentLevel.time.toString();
                    highScore.textContent = Number(localStorage.getItem("wpm")).toFixed(2);
                    endGame();
                    return undefined;
                }
                clearInterval(wordInterval);
                return getWord(wordIndex + 1, wordsLostVar, gameTimeVar, livesVar);
            }
            letter.classList.remove("focused");
            let inputAfter = document.querySelector(`input[data-val=${letterAfter}]`);
            inputAfter === null || inputAfter === void 0 ? void 0 : inputAfter.focus();
            inputAfter === null || inputAfter === void 0 ? void 0 : inputAfter.classList.add("focused");
            letter.setAttribute("disabled", "true");
        });
    }
}
function startGame(wordIndex = 0) {
    startGameBtn.classList.toggle("active");
    currentLevel.getLevelWordsArrs(10);
    let dataInterval = setInterval(() => {
        if (currentLevel.dataCheck)
            clearInterval(dataInterval);
        getWord(wordIndex, 0, 0, 0);
    }, 1000);
}
function endGame() {
    startGameBtn.classList.add("active");
    attemps.textContent = currentLevel.lives.toString();
    for (let i = gameDiv.children.length - 1; i >= 0; i--) {
        gameDiv.children[i].remove();
    }
    timeleft.textContent = currentLevel.time.toString();
    wordOne.textContent = "";
    wordTwo.textContent = "";
}
