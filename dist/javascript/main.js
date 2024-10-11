"use strict";
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
class GetLevel {
    constructor(name, letters, time) {
        this.wordsArrs = [];
        this.randomWordsArr = 0;
        this.randomWordsInArr = 0;
        this.wordsArr = [];
        this.name = name;
        this.letters = letters;
        this.time = time;
    }
    getLevelWordsArrs(wordsCount) {
        for (let i = 0; i < this.letters.length; i++) {
            getWords(this.letters[i])
                .then((resolveValue) => {
                this.wordsArrs.push(resolveValue);
                if (i === this.letters.length - 1) {
                    for (let i = 0; i < wordsCount; i++) {
                        this.randomWordsArr = Math.floor(Math.random() * this.wordsArrs.length);
                        this.randomWordsInArr = Math.floor(Math.random() * this.wordsArrs[this.randomWordsArr].length);
                        this.wordsArr.push(this.wordsArrs[this.randomWordsArr][this.randomWordsInArr]);
                    }
                }
            })
                .catch((err) => {
                console.log(`Error: ${err}`);
            });
        }
    }
}
let easy = new GetLevel("Easy", [3, 4], 8);
let medium = new GetLevel("Medium", [4, 5], 6);
let hard = new GetLevel("Hard", [6], 4);
let insane = new GetLevel("لفل الوحش", [6], 2);
let levels = [easy, medium, hard, insane];
let currentLevel = easy;
const changeLvlBtn = document.getElementById("change-level");
const closeLvlBtn = document.querySelector(".close-level-sec");
const changeLvlSec = document.querySelector(".change-level-sec");
for (let i = 0; i < levels.length; i++) {
    let levelToAdd = document.createElement("h2");
    levelToAdd.textContent = levels[i].name;
    changeLvlSec.appendChild(levelToAdd);
}
changeLvlBtn.addEventListener("click", function () {
    changeLvlSec.classList.toggle("active");
});
closeLvlBtn.addEventListener("click", function () {
    changeLvlSec.classList.toggle("active");
});
