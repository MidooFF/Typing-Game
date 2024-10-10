"use strict";
function getWords(lettersCount) {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open("GET", "../../data/JSON-files/four-letters-words.json");
        // if (lettersCount === 3) 
        //     request.open("GET", "https://github.com/getify/dwordly-game/blob/main/three-letter-words.json");
        // if (lettersCount === 4) 
        //     request.open("GET", "../../data/JSON-files/four-letters-words.json");
        // if (lettersCount === 5)
        //     request.open("GET", "https://github.com/getify/dwordly-game/blob/main/five-letter-words.json");
        // if (lettersCount === 6) 
        //     request.open("GET", "https://github.com/getify/dwordly-game/blob/main/six-letter-words.json");
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                resolve = JSON.parse(request.responseText);
            }
            else {
                console.log("could not fetch data");
            }
        };
        request.send();
    });
}
let threeLettersWords = getWords(4);
threeLettersWords.then((resolveData) => {
    console.log(resolveData);
}).catch(() => {
    console.log("could not fetch data");
});
//# sourceMappingURL=main.js.map