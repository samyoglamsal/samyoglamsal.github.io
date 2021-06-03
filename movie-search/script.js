var api_key = "9803eb11";

function search() {
    var movie_title = document.getElementById("search-bar").value;
    get_movie_data(movie_title);
}

function get_movie_data(movie_title) {
    var formatted_movie_title = movie_title.replace(" ", "+");
    var api_url = `http://www.omdbapi.com/?s=${formatted_movie_title}&type=movie&&apikey=${api_key}`;

	fetch(api_url)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			update_page(data);
		})
		.catch(function(err) {
			console.log(err);
		});
}

/* This function takes in the JSON object obtained from get_movie_data() and
 * updates the page with the search results contained within that JSON object.
 */
function update_page(data) {
	var parent = document.getElementById("search-results");
	var list_element;
	var clickable_element;
	
	for (var key in data.Search) {
		list_element = document.createElement("li");

		clickable_element = document.createElement("a");
		clickable_element.href = `movie_details.html?${data.Search[key].Title.replace(" ", "+")}`
		clickable_element.innerHTML = `${data.Search[key].Title} (${data.Search[key].Year})`

		parent.appendChild(list_element);
		list_element.appendChild(clickable_element);
	}
}
