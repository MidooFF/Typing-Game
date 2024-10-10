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
            request.open("GET", "")

        request.onreadystatechange = function() {
            if (request.status === 200)
                resolve(JSON.parse(request.responseText));

            else 
                reject("could not fetch data");
        }
        request.send();
    })
}
