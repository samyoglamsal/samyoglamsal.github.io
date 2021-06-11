var apiKey = "9803eb11";

/* Display the details of the selected movie as soon as the page loads.
 */
window.onload = displayDetails;
window.onunload = function() {
    sessionStorage.clear();
}

/* This function requests data from the OMDB API website and gathers the
 * JSON data for the selected movie. It then returns that JSON data in the
 * form of a promise.
 */
function getMovieData(title) {
    var encodedTitle = encodeURI(title);
    var apiURL = `https://www.omdbapi.com/` +
        `?t=${encodedTitle}` +
        `&type=movie` +
        `&plot=full` +
        `&apikey=${apiKey}`;
    console.log(apiURL);

    var jsonData = fetch(apiURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            return data;
        })
        .catch(function(err) {
            console.log(err);
        });
    
    return jsonData;
}

/* This function takes the JSON data returned by getMovieData() and uses it
 * to create a webpage displaying important pieces of information.
 */
async function displayDetails() {
    var movieTitle = sessionStorage.getItem("movieTitle");
    var movieInformation = await getMovieData(movieTitle);

    console.log(movieInformation);

    document.getElementById("details").innerHTML = 
		`${movieInformation.Released} | 
		 ${movieInformation.Runtime} | 
		 ${movieInformation.Genre}`;
    document.getElementById("director").innerHTML = `Directed by ${movieInformation.Director}`;

    document.title = movieInformation.Title;
    document.getElementById("movieTitle").innerHTML = movieInformation.Title;
    document.getElementById("poster").src = movieInformation.Poster;
    document.getElementById("plot").innerHTML = movieInformation.Plot;
}
