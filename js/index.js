(async () => {
  "use strict";
  /* ************ Get movies from my db **************** */
  let movies = await getMovies();
  /* *** bool for loading screen **** */
  let isRunning = false;
  /* *** date for loading screen **** */
  let date = new Date().toLocaleDateString();
  $("#vhs-date").html(date);
  /* *** caroseule container *** */
  let mc = document.getElementById("movieContainer");

  /* ************ Auto-populates missing information with placeholders **************** */
  function placeHolder(movie) {
    if (movie.description === undefined || movie.description === "") {
      movie.description = "No description given";
    }
    if (movie.genre === undefined || movie.genre === "") {
      movie.genre = "No genre given";
    }
    if (movie.year === undefined || movie.year === "") {
      movie.year = "No year given";
    }
    if (movie.runtime === undefined || movie.runtime === "") {
      movie.runtime = "Unknown";
    }
    if (movie.director === undefined || movie.director === "") {
      movie.director = "No director given";
    }
    if (movie.actors === undefined || movie.actors === "") {
      movie.actors = "No actors given";
    }
    if (movie.rating === undefined || movie.rating === "") {
      movie.rating = "No rating given";
    }
    return movie;
  }

  /* ************ Reload and redisplay movies when called **************** */
  async function reloadMovies(reload = true) {
    if (reload) {
      movies = await getMovies();
    }

    let html = "";
    movies.forEach(function (movie) {
      movie = placeHolder(movie);
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
            </div>`;
    });
    $("#movieList").html(html);
  }

  /* ************ Delete Button for text Movie Cards **************** */
  $(document).on("click", ".delete-btn", function () {
    let movieID = $(this).parents("[data-movieId]").attr("data-movieId");
    deleteMovie(movieID).then(() => reloadMovies().then(() => init()));
  });

  /* ************ Button that takes user input from form and adds it to db **************** */
  document.getElementById("addBtn").addEventListener("click", (e) => {
    e.preventDefault();
    let title = document.getElementById("title").value,
      genre = document.getElementById("genre").value,
      year = document.getElementById("year").value,
      runtime = document.getElementById("runtime").value,
      director = document.getElementById("director").value,
      actors = document.getElementById("actors").value,
      rating = document.getElementById("rating").value,
      description = document.getElementById("description").value,
      movieOBJ = {};

    getAPIData(title).then((data) => {
      description === "" && (description = data.overview);
      rating === "" && (rating = data.vote_average);
      year === "" && (year = data.release_date);
      title = data.original_title;

      movieOBJ = {
        title,
        genre,
        year,
        runtime,
        director,
        actors,
        rating,
        description,
      };
      addMovie(movieOBJ).then(() => reloadMovies().then(() => init()));
    });
    clearAddMovieInputs();
  });

  /* ************ clear input fields **************** */
  function clearAddMovieInputs() {
    document.getElementById("title").value = "";
    document.getElementById("genre").value = "";
    document.getElementById("year").value = "";
    document.getElementById("runtime").value = "";
    document.getElementById("director").value = "";
    document.getElementById("actors").value = "";
    document.getElementById("rating").value = "";
    document.getElementById("description").value = "";
  }
  await reloadMovies();

  /* ************ Edit button for text cards **************** */
  $(document).on("click", ".edit-btn", function () {
    let movieID = $(this).parents("[data-movieId]").attr("data-movieId"),
      movie = movies.find((movie) => movie.id == movieID),
      html = `
        <form>
            <input type="text" id="e-title" value="${movie.title}">
            <input type="text" id="e-genre" value="${movie.genre}">
            <input type="text" id="e-year" value="${movie.year}">
            <input type="text" id="e-runtime" value="${movie.runtime}">
            <input type="text" id="e-director" value="${movie.director}">
            <input type="text" id="e-actors" value="${movie.actors}">
            <input type="text" id="e-rating" value="${movie.rating}">
            <button id="saveBtn">Update Movie</button>
        </form>
        `;
    $(this).parents("[data-movieId]").html(html);
  });
  /* ************ Save Button for text Movie Cards **************** */
  $(document).on("click", "#saveBtn", function (e) {
    e.preventDefault();
    let movieID = $(this).parents("[data-movieId]").attr("data-movieId"),
      title = document.getElementById("e-title").value,
      genre = document.getElementById("e-genre").value,
      year = document.getElementById("e-year").value,
      runtime = document.getElementById("e-runtime").value,
      director = document.getElementById("e-director").value,
      actors = document.getElementById("e-actors").value,
      rating = document.getElementById("e-rating").value;
    updateMovie({
      id: movieID,
      title,
      genre,
      year,
      runtime,
      director,
      actors,
      rating,
    }).then(() => reloadMovies().then(() => init()));
  });

  /* ************ Search Button **************** */
  document.getElementById("searchBtn").addEventListener("click", (e) => {
    e.preventDefault();
    let search = document.getElementById("search").value;
    let movie = movies.find(
      (movie) => movie.title.toLowerCase() === search.toLowerCase()
    );
    if (movie) {
      let index = movies.indexOf(movie);
      movies.splice(index, 1);
      movies.unshift(movie);
      reloadMovies(false).then(() => init());
    }
  });

  /* ************ Sort Function -- sorts movies a-z or z-a **************** */

  function sortAZ() {
    movies.sort((a, b) => a.title.localeCompare(b.title));
    reloadMovies(false).then(() => init());
  }

  function sortZA() {
    movies.sort((a, b) => b.title.localeCompare(a.title));
    reloadMovies(false).then(() => init());
  }

  document.getElementById("azBtn").addEventListener("click", (e) => {
    e.preventDefault();
    sortAZ();
  });
  document.getElementById("zaBtn").addEventListener("click", (e) => {
    e.preventDefault();
    sortZA();
  });

  /* ************** Carouseslelle ***************** */

  async function init() {
    mc.innerHTML = '<div class="spotlight"></div>';
    Promise.all(
      movies.map(({ title }, index) => {
        return setAPIData(title, index);
      })
    ).then(() => {
      mc.innerHTML += `<div class ="btnContainer">
            <button id="leftBtn">
                <
                <
            </button>
            <button id="rightBtn">>></button>
        </div>`;
    });
  }
  /* *************** Event Listeners for carousell buttons (dynamic buttons) *************** */
  document.addEventListener("click", (e) => {
    const target = e.target.closest("#leftBtn");

    if (target) {
      let currentImg = document.getElementsByClassName("selected")[0];
      let idNum = parseInt(currentImg.id.slice(1));

      if (idNum < movies.length - 1) {
        let nextImg = document.getElementById(`m${idNum + 1}`);
        currentImg.classList.toggle("selected");
        currentImg.classList.toggle("left");
        nextImg.classList.toggle("selected");
      }
      manageZ(idNum);
    }
  });
  /* *************** Event Listeners for dynamic buttons *************** */
  document.addEventListener("click", (e) => {
    const target = e.target.closest("#rightBtn");

    if (target) {
      let currentImg = document.getElementsByClassName("selected")[0];
      let idNum = parseInt(currentImg.id.slice(1));
      if (idNum > 0) {
        let nextImg = document.getElementById(`m${idNum - 1}`);
        console.log(nextImg);
        currentImg.classList.toggle("selected");
        nextImg.classList.toggle("left");
        nextImg.classList.toggle("selected");
      }
      manageZ(idNum);
    }
  });

  /* *************** Loading Screen *************** */

  function loadingScreen() {
    if (!isRunning) {
      isRunning = true;
      $("#blur, #vhs").toggleClass("hidden");
      setTimeout(function () {
        $("#blur, #vhs").toggleClass("hidden");
        isRunning = false;
      }, 2000);
    }
  }

  /* *************** Dynamically manage z-index of movie box art *************** */

  function manageZ(id) {
    let movieCards = mc.getElementsByTagName("img");
    for (let movieCard of movieCards) {
      let curId = parseInt(movieCard.id.slice(1));
      if (curId > id) {
        movieCard.style.zIndex = movieCards.length - curId;
      } else if (curId == id) {
        movieCard.style.zIndex = curId + movieCards.length + 1;
      } else {
        movieCard.style.zIndex = curId + movieCards.length;
      }
    }
  }

  /* *************** generate box art after getting data *************** */
  async function setAPIData(title, index) {
    return new Promise((resolve, reject) => {
      try {
        getAPIData(title).then((resp) => {
          let source = `http://image.tmdb.org/t/p/w500/${resp.poster_path}`;
          if (index == 0) {
            mc.innerHTML += `<img id='m${index}' class='movieArt selected' src='${source}'/>`;
          } else if (index === 1) {
            mc.innerHTML += `<img id='m${index}' class='movieArt' style="z-index: ${
              movies.length + 1
            }" src='${source}'/>`;
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

  /* *************** get data from TMDB *************** */

  async function getAPIData(film) {
    return new Promise((resolve, reject) => {
      try {
        if (film == "") {
          console.log("no film");
        } else {
          loadingScreen();
          fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${keys.tmdb}&query=` +
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
              if (data != "Nothing found." || data.results.length > 0) {
                resolve(data.results[0]);
              } else {
                console.log("NOOOOOO");
                throw "BAD TITLE";
              }
            });
        }
      } catch (err) {
        console.log("oops", err);
        reject("Somethings Wrong...");
      }
    });
  }
  init();
})();
