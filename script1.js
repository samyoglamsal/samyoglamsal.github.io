var apiKey = "9803eb11";
var pageNumber = 1;
var year = -1;
var totalResults;

async function search() {
    var movieTitle = document.getElementById("search_box").value;

    document.querySelectorAll('.movie_result').forEach(e => e.remove());

    var searchResults = await fetchResults(movieTitle);

    updatePage(searchResults);
}

function fetchResults(movieTitle) {
    var encodedMovieTitle = encodeURI(movieTitle);
    var apiURL = `https://www.omdapi.com/` +
                 `?t=${encodedMovieTitle}` +
                 `&type=movie` +
                 `&plot=full` +
                 `&apikey=${apiKey}`;

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

function updatePage(data) {
    var resultsList = document.getElementById("search_results");

    document.getElementById("page_number").innerHTML = `Page ${pageNumber}`;
    document.getElementById("results_header").style.visibility = "visible";
    
    if (data.totalResults > 10) {
        var prevButton = document.createElement("button");
        prevButton.onclick = changePage('0');
        prevButton.innerHTML = "prev";

        var nextButton = document.createElement("button");
        nextButton.onclick = changePage('1');
        next.innerHTML = "next";

        var navDiv = document.getElementById("navigation");
        navDiv.appendChild(prevButton);
        navDiv.appendChild(nextButton);
    }

    var listElement;
    var anchorElement;
    for (var key in data.Search) {
        anchorElement = document.createElement("a");
        anchorElement.href = "#";
        anchorElement.innerHTML = `${data.Search[key].Title}` +
                                  `(${data.Search[key].Year})`;
        anchorElement.onclick = `redirect(\'${data}, ${key}\')`;

        listElement = document.createElement("li");
        listElement.className = "movie_result";
        listElement.innerHTML = anchorElement;

        resultsList.appendChild(listElement);
    }
}

function changePage(value) {
    if (value == 0 && pageNumber > 1) {
        pageNumber--;
        search();
    } else if (value == 1 && pageNumber < (totalResults / 10)) {
        pageNumber++;
        search();
    }
}

function redirect(data, key) {
    console.log(data);
    console.log(key);
}
