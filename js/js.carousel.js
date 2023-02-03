(async () => {
    // This is the entry point for your application. Write all of your code here.
    // Before you can use the database, you need to configure the "db" object
    // with your team name in the "js/movies-api.js" file.
    console.log("test");
    let movies = await getMovies();
    console.log(movies);

    let mc = document.getElementById("movieContainer");
    //   const imgs = [
    //     "./images/batman.jpeg",
    //     "./images/spong.jpeg",
    //     "./images/monty.jpeg",
    //     "./images/simp.jpeg",
    //   ];
    let movieTitles = ["shrek", "jaws", "space balls", "space jam", "star wars"];
    async function init() {
        Promise.all(
            movies.map(({ title }, index) => {
                return addImage(title, index);
            })
        ).then(() => console.log("done"));
    }
    init();

    document.getElementById("leftBtn").addEventListener("click", () => {
        let currentImg = document.getElementsByClassName("selected")[0];
        let idNum = parseInt(currentImg.id.slice(1));
        if (idNum < movies.length - 1) {
            let nextImg = document.getElementById(`m${idNum + 1}`);
            currentImg.classList.toggle("selected");
            currentImg.classList.toggle("left");
            nextImg.classList.toggle("selected");
        }
    });
    document.getElementById("rightBtn").addEventListener("click", () => {
        let currentImg = document.getElementsByClassName("selected")[0];
        let idNum = parseInt(currentImg.id.slice(1));
        if (idNum > 0) {
            let nextImg = document.getElementById(`m${idNum - 1}`);
            console.log(nextImg);
            currentImg.classList.toggle("selected");
            nextImg.classList.toggle("left");
            nextImg.classList.toggle("selected");
        }
    });

    async function addImage(img, index) {
        return new Promise((resolve, reject) => {
            try {
                getPoster(img).then((resp) => {
                    if (index == 0) {
                        mc.innerHTML += `<img id='m${index}' class='movieArt selected' src='${resp}'/>`;
                    } else {
                        mc.innerHTML += `<img id='m${index}' class='movieArt' src='${resp}'/>`;
                    }
                });
                resolve("done");
            } catch (err) {
                console.log("oops", err);
                reject("Somethings Wrong...");
            }
        });
    }

    ////////////////////////////

    async function getPoster(film) {
        return new Promise((resolve, reject) => {
            try {
                if (film == "") {
                    console.log("no film");
                } else {
                    console.log("loading");
                    fetch(
                        "https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=" +
                        film +
                        "",
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Accept: "application/json",
                            },
                        }
                    )
                        .then((resp) => resp.json())
                        .then((data) => {
                            console.log(data);
                            if (data != "Nothing found.") {
                                resolve(
                                    `http://image.tmdb.org/t/p/w500/${data.results[0].poster_path}`
                                );
                            }
                        });
                }
            } catch (err) {
                console.log("oops", err);
                reject("Somethings Wrong...");
            }
        });
    }
})();