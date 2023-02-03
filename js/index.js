(async () => {

    //TODO: FUNCTION THAT GETS MOVIES FROM THE DATABASE AND DYNAMICALLY PLACES HTML ON THE PAGE

    function placeHolder(movie){
        if(movie.description === undefined || movie.description === ''){
            movie.description = "no description given";
        }
        if(movie.genre === undefined || movie.genre === ''){
            movie.genre = "no genre given";
        }
        if(movie.year === undefined || movie.year === ''){
            movie.year = "no year given";
        }
        if(movie.runtime === undefined || movie.runtime === ''){
            movie.runtime = "unknown";
        }
        if(movie.director === undefined || movie.director === ''){
            movie.director = "no director given";
        }
        if(movie.actors === undefined || movie.actors === ''){
            movie.actors = "no actors given";
        }
        if(movie.rating === undefined || movie.rating === ''){
            movie.rating = "no rating given";
        }
        return movie;
    }

    let movies = await getMovies();
    async function reloadMovies(){
         movies = await getMovies();

      let html = ""
      movies.forEach(function(movie){
        movie = placeHolder(movie)
         html += `
            <div class="movie-card" data-movieId=${movie.id}>
             <p class="movie-title">${movie.title}</p>
                <p class="description">${movie.description}</p>
                <p>Genre: ${movie.genre}</p>
                <p>Date of Release: ${movie.year}</p>
                <p>Runtime: ${movie.runtime} minutes</p>
                <p>Director: ${movie.director}</p>
                <p>Cast: ${movie.actors}</p>
                <p>Rating: ${movie.rating}</p>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>`

      })
      $("#movieList").html(html);
  }


    //TODO: FUNCTION THAT DELETES A MOVIE FROM THE DATABASE AND RELOADS THE MOVIES LIST

    $(document).on('click', '.delete-btn', function(){
        let movieID = $(this).parents('[data-movieId]').attr('data-movieId');
        console.log(movieID);
        deleteMovie(movieID).then(() => reloadMovies().then(()=>init())
        );


    });


    //TODO: FUNCTION THAT ADDS A MOVIE TO THE DATABASE AND RELOADS THE MOVIES LIST
    document.getElementById("addBtn").addEventListener("click", (e) => {
        e.preventDefault();

        let title = document.getElementById("title").value;
        let genre = document.getElementById("genre").value;
        let year = document.getElementById("year").value;
        let runtime = document.getElementById("runtime").value;
        let director = document.getElementById("director").value;
        let actors = document.getElementById("actors").value;
        let rating = document.getElementById("rating").value;
        let description = document.getElementById("description").value;

        let fillData = true
        let movieOBJ = {}
        if(fillData){
            getAPIData(title).then(data=>{
                if(description === ''){
                    description = data.overview
                }
                if(rating === ''){
                    rating = data.vote_average
                }
                if(year === ''){
                    year = data.release_date
                }

                    title = data.original_title

                movieOBJ = {
                    title,
                    genre,
                    year,
                    runtime,
                    director,
                    actors,
                    rating,
                    description
                }
                console.log(movieOBJ);
                addMovie(movieOBJ).then(() => reloadMovies().then(()=>init())
                );
            })

        } else {
            movieOBJ = {
                title,
                genre,
                year,
                runtime,
                director,
                actors,
                rating,
                description
            }
            console.log(movieOBJ);
            addMovie(movieOBJ).then(() => reloadMovies().then(()=>init())
            );
        }

         document.getElementById("title").value = "";
         document.getElementById("genre").value = "";
         document.getElementById("year").value = "";
         document.getElementById("runtime").value = "";
         document.getElementById("director").value = "";
         document.getElementById("actors").value =  "";
         document.getElementById("rating").value = "";
        document.getElementById("description").value = "";


    });
   await reloadMovies();

//   TODO: FUNCTION THAT UPDATES A MOVIE IN THE DATABASE AND RELOADS THE MOVIES LIST BY DYNAMICALLY CREATING AN HTML FORM TO INPUT CHANGES AND OVERRIDES THE PREVIOUS MOVIE INFORMATION WHEN THE SAVE BUTTON IS CLICKED
    $(document).on('click', '.edit-btn', function(){
        let movieID = $(this).parents('[data-movieId]').attr('data-movieId');
        let movie = movies.find(movie => movie.id == movieID);
        let html = `
        <form>
            <input type="text" id="etac-title" value="${movie.title}">
            <input type="text" id="etac-genre" value="${movie.genre}">
            <input type="text" id="etac-year" value="${movie.year}">
            <input type="text" id="etac-runtime" value="${movie.runtime}">
            <input type="text" id="etac-director" value="${movie.director}">
            <input type="text" id="etac-actors" value="${movie.actors}">
            <input type="text" id="etac-rating" value="${movie.rating}">
            <button id="saveBtn">Update Movie</button>
        </form>
        `
        $(this).parents('[data-movieId]').html(html);

    });
    $(document).on('click', '#saveBtn', function(e){
        e.preventDefault();
        let movieID = $(this).parents('[data-movieId]').attr('data-movieId');
        let title = document.getElementById("etac-title").value;
        let genre = document.getElementById("etac-genre").value;
        let year = document.getElementById("etac-year").value;
        let runtime = document.getElementById("etac-runtime").value;
        let director = document.getElementById("etac-director").value;
        let actors = document.getElementById("etac-actors").value;
        let rating = document.getElementById("etac-rating").value;
        updateMovie( {
            id: movieID,
            title,
            genre,
            year,
            runtime,
            director,
            actors,
            rating
        }).then(() => reloadMovies().then(()=>init())
        );
    });


//TODO: CAROUSEL JAVASCRIPT START-------------------------//

    let mc = document.getElementById("movieContainer");

    let movieTitles = ["shrek", "jaws", "space balls", "space jam", "star wars"];
    async function init() {
        // document.getElementById("m1").style.zIndex = movies.length+1
        mc.innerHTML = ''
        Promise.all(
            movies.map(({ title }, index) => {
                return setAPIData(title, index);
            })
        );
    }
    init();

    function manageZ(id) {
        let movieCards = mc.getElementsByTagName("img");
        for (let movieCard of movieCards) {
            let curId = parseInt(movieCard.id.slice(1));
            if (curId > id) {
                // movieCard.style.zIndex = movieCards.length + 10 - curId;
                //right
                movieCard.style.zIndex = movieCards.length - curId;
            } else if (curId == id) {
                movieCard.style.zIndex = curId + movieCards.length + 1;
            } else {
                movieCard.style.zIndex = curId + movieCards.length;
            }
        }
    }

    document.getElementById("leftBtn").addEventListener("click", () => {
        let currentImg = document.getElementsByClassName("selected")[0];
        let idNum = parseInt(currentImg.id.slice(1));
        if (idNum < movies.length - 1) {
            let nextImg = document.getElementById(`m${idNum + 1}`);
            currentImg.classList.toggle("selected");
            currentImg.classList.toggle("left");
            nextImg.classList.toggle("selected");
        }
        manageZ(idNum)
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
        manageZ(idNum)
    });

    async function setAPIData(title, index) {
        return new Promise((resolve, reject) => {
            try {
                getAPIData(title).then((resp) => {
                    let source = `http://image.tmdb.org/t/p/w500/${resp.poster_path}`;
                    if (index == 0) {
                        mc.innerHTML += `<img id='m${index}' class='movieArt selected' src='${source}'/>`;
                    } else if(index === 1){
                        // document.getElementById("m1").style.zIndex = movies.length+1
                        mc.innerHTML += `<img id='m${index}' class='movieArt' style="z-index: ${movies.length + 1}" src='${source}'/>`;

                    } else {
                        mc.innerHTML += `<img id='m${index}' class='movieArt' src='${source}'/>`;
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

    async function getAPIData(film) {
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
                            if (data != "Nothing found." || data.results.length > 0) {
                                resolve(
                                    data.results[0]
                                );
                            } else {
                                console.log("NOOOOOO")
                                throw "BAD TITLE"
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
