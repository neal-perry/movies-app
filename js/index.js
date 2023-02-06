(async () => {
  // This is the entry point for your application. Write all of your code here.
  // Before you can use the database, you need to configure the "db" object
  // with your team name in the "js/movies-api.js" file.
  console.log("test");
  let movies = await getMovies();
  console.log(movies);

  let mc = document.getElementById("movieContainer");
  function sortAZ() {
    movies.sort((a, b) => a.title.localeCompare(b.title));
    //reload movies
  }
  function sortZA() {
    movies.sort((a, b) => b.title.localeCompare(a.title));
    //reload movies
  }

  document.getElementById("azBtn").addEventListener("click", () => sortAZ());
  document.getElementById("zaBtn").addEventListener("click", () => sortZA());

  async function init() {
    mc.innerHTML = "";
    Promise.all(
      movies.map(({ title }, index) => {
        return addImage(title, index);
      })
    ).then(() => {
      mc.innerHTML += `<div class="btnContainer">
        <button id="leftBtn"><<</button>
        <button id="rightBtn">>></button>
      </div>`;
      //   addEvents();
    });
  }

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

  init();
  function manageZ(id) {
    let movieCards = mc.getElementsByTagName("img");
    console.log(movieCards);
    for (let movieCard of movieCards) {
      let curId = parseInt(movieCard.id.slice(1));
      //   console.log(curId);
      if (curId > id) {
        movieCard.style.zIndex = movieCards.length - curId;
      } else if (curId == id) {
        movieCard.style.zIndex = curId + movieCards.length + 1;
      } else {
        movieCard.style.zIndex = curId + movieCards.length;
      }
    }
  }
  function addEvents() {
    document.getElementById("leftBtn").addEventListener("click", () => {});
    document.getElementById("rightBtn").addEventListener("click", () => {});
  }

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
              //   console.log(data);
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
