(async () => {
    // This is the entry point for your application. Write all of your code here.
    // Before you can use the database, you need to configure the "db" object 
    // with your team name in the "js/movies-api.js" file.
  async function reloadMovies(){
      let movies = await getMovies();
      // console.log(movies[0].id);
      let html = ""
    movies.forEach(function(movie){
         html += `
    <div data-movieId=${movie.id}>
     <p>${movie.title}</p>
        <p>${movie.genre}</p>
        <p>${movie.year}</p>
        <p>${movie.runtime}</p>
        <p>${movie.director}</p>
        <p>${movie.actors}</p>
        <p>${movie.rating}</p>
        <button id="edit-btn">Edit</button>
        <button id="delete-btn">Delete</button>
</div>
       
        `
        $("#movieList").html(html);

        $("#delete-btn").click(function(){
            console.log(`${movie.id}`);

            // deleteMovie(`${movie.id}`);
        })
    })

  }



    document.getElementById("addBtn").addEventListener("click", (e) => {
        e.preventDefault();
        let title = document.getElementById("title").value;
        let genre = document.getElementById("genre").value;
        let year = document.getElementById("year").value;
        let runtime = document.getElementById("runtime").value;
        let director = document.getElementById("director").value;
        let actors = document.getElementById("actors").value;
        let rating = document.getElementById("rating").value;
        addMovie({
            title,
            genre,
            year,
            runtime,
            director,
            actors,
            rating
        }).then(() => reloadMovies());
         document.getElementById("title").value = "";
         document.getElementById("genre").value = "";
         document.getElementById("year").value = "";
         document.getElementById("runtime").value = "";
         document.getElementById("director").value = "";
         document.getElementById("actors").value =  "";
         document.getElementById("rating").value = "";

    });
   await reloadMovies();

   function getId (){

   }




})();
