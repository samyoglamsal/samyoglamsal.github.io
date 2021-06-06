var api_key = "9803eb11";

// Display the details of the selected movie as soon as the page loads.
window.onload = display_details;

/* This function requests data from the OMDB API website and gathers the
   JSON data for the selected movie. It then returns that JSON data in the
   form of a promise.
*/
function get_movie_data(title) {
    var formatted_movie_title = title.replace(" ", "+");
    var api_url = `http://www.omdbapi.com/` +
        `?t=${formatted_movie_title}&type=movie&plot=full&apikey=${api_key}`;

    var json_data = fetch(api_url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            return data;
        })
        .catch(function(err) {
            console.log(err);
        });
    
    return json_data;
}

/* This function takes the JSON data returned by get_movie_data() and uses it
 * to create a webpage displaying important pieces of information.
 */
async function display_details() {
    var movie_name = sessionStorage.getItem("movie_title");
    var movie_information = await get_movie_data(movie_name);

    console.log(movie_information);

    document.title = movie_information.Title;
    document.getElementById("movie_title").innerHTML = movie_information.Title;
    document.getElementById("poster").src = movie_information.Poster;
    document.getElementById("plot").innerHTML = movie_information.Plot;
    document.getElementById("release_date").innerHTML = movie_information.Released;
    document.getElementById("runtime").innerHTML = movie_information.Runtime;
    document.getElementById("genre").innerHTML = movie_information.Genre;
    document.getElementById("director").innerHTML = movie_information.Director;
}

