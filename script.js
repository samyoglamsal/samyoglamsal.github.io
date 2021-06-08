var api_key = "9803eb11";
var page_number = 1;
var navigation_buttons = false;
var year = -1;
var total_results;

function search() {
    var movie_title = document.getElementById("search_box").value;

    document.querySelectorAll('.movie_result').forEach(e => e.remove());

    fetch_results(movie_title);
}

function fetch_results(movie_title) {
    var formatted_movie_title = movie_title.replace(" ", "+");
    var api_url = `https://www.omdbapi.com/?s=${formatted_movie_title}&type=movie&page=${page_number}&apikey=${api_key}`;
    
    if (year != -1) {
        api_url = `https://www.omdbapi.com/?s=${formatted_movie_title}&type=movie&page=${page_number}&y=${year}&apikey=${api_key}`;

    }

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
        console.log(data);
	var parent = document.getElementById("search_results");
	var list_element;
        var anchor;

	total_results = data.totalResults;

        document.getElementById("page_number").innerHTML = `Page ${page_number}`;
	document.getElementById("results_header").style.visibility = "visible";
        
        if (data.totalResults > 10 && !navigation_buttons) {
            document.getElementById("prev_button").style.visibility = "visible";
            document.getElementById("next_button").style.visibility = "visible";

            navigation_buttons = true;
        }
	
	for (var key in data.Search) {
		list_element = document.createElement("li");
                list_element.className = "movie_result";
                anchor = `<a href="#" onclick="redirect(\'${data.Search[key].Title}\')"> ${data.Search[key].Title} (${data.Search[key].Year}) </a>`;

		parent.appendChild(list_element);
		list_element.insertAdjacentHTML("beforeend", anchor);
	}
}

function change_page(direction) {
    if (direction == 0 && page_number > 1) {
        page_number--;
	search();
    } else if (direction == 1 && page_number < (total_results) / 10) {
        page_number++;
	search();
    }
}

function redirect(title) {
     sessionStorage.setItem("movie_title", title);
     window.location.href = "movie_details.html";
}

function apply() {
    year = document.getElementById("year_box").value;
    search();
}
