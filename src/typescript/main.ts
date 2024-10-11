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
    constructor(name: string, letters: number[], time: number) {
        this.name = name;
        this.letters = letters;
        this.time = time;
    }

    protected wordsArrs: (string[])[] = [];
    protected randomWordsArr: number = 0;
    protected randomWordsInArr: number = 0;
    public wordsArr: string[] = [];
    getLevelWordsArrs(wordsCount: number): void {
        for (let i = 0; i < this.letters.length; i++) {
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
            })
            .catch((err) => {
                console.log(`Error: ${err}`);
            })
        }
    }
}

let easy = new GetLevel("Easy", [3, 4], 8);
let medium = new GetLevel("Medium", [4, 5], 6);
let hard = new GetLevel("Hard", [6], 4)

