var apiKey = "9803eb11";
var pageNumber = 1;
var navigationButtons = false;

const test = process.env.REACT_APP_API_KEY;
console.log(test);

window.onload = setup;

/* This function allows for the "enter" button to be used to search for
 * a movie when a text box is selected. */
function setup() {
    document.getElementById("titleBox").onkeypress = function(e) {
        if (e.keyCode == 13) {
            document.getElementById("searchButton").click();
        }
    }

    document.getElementById("yearBox").onkeypress = function(e) {
        if (e.keyCode == 13) {
            document.getElementById("searchButton").click();
        }
    }
}

/* This function removes data that is added programatically. For instance, this
 * would remove the search results when the search button is pressed, the
 * page number, the navigation buttons, etc.
 */
function clearResults(resetPageCount) {
    document.querySelectorAll('.movieResult').forEach(e => e.remove());
    document.querySelectorAll('.navigationButton').forEach(e => e.remove());
    document.querySelectorAll('#resultsHeader').forEach(e => e.remove());
    document.querySelectorAll('#errorMessage').forEach(e => e.remove());
    
    document.getElementById("pageNumber").innerHTML = "";

    navigationButtons = false;

    if (resetPageCount) {
        pageNumber = 1;
    }
}

/* This function will look at the data entered into the "movieTitle" and "year"
 * search boxes and use that information to gather search results from the
 * omdbAPI. It will then pass relevant data to updatePage(), which will update
 * the current page with the relevant search results.
 */
function search(resetPageCount) {
    var movieTitle = document.getElementById("titleBox").value;
    var year = document.getElementById("yearBox").value;

    clearResults(resetPageCount);
    
    if (movieTitle == "") {
        showError("Please enter a movie title.");
    } else if (year != "" && isNaN(year)) {
        showError("Invalid year.");
    } else {
        fetchResults(movieTitle, year);
    }
}

function fetchResults(movieTitle, year) {
    var encodedTitle = encodeURI(movieTitle); 
    var apiURL = `https://www.omdbapi.com/` +
        `?s=${encodedTitle}` +
        `&type=movie` +
        `&page=${pageNumber}` +
        `&y=${year}` +
        `&apikey=${apiKey}`;

    fetch(apiURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if ('Error' in data) {
                if (data.Error == "Movie not found!") {
                    showError("The title and/or year you searched for returned no results.");
                } else if (data.Error == "Too many results.") {
                    showError("The title you entered was too general. Please specify your search further.");
                }
            } else {
                updatePage(data);
            }
        })
        .catch(function(err) {
            console.log(err);
        });
}

/* This function takes in the JSON object obtained from getMovieData() and
 * updates the page with the search results contained within that JSON object.
 */
function updatePage(data) {
    var resultsList = document.getElementById("searchResults");
    var listElement; 
    var anchorElement;
    var resultsTitle;

    resultsTitle = document.createElement("h2");
    resultsTitle.id = "resultsHeader";
    resultsTitle.innerHTML = "Results";

    var totalPages = Math.floor(data.totalResults / 10) + 1;
    if (data.totalResults % 10 == 0) {
        totalPages--;
    }

    document.getElementById("pageNumber").innerHTML = `Page ${pageNumber} of ${totalPages}` +
    ` (${data.totalResults} results total)`;


    if (data.totalResults > 10 && !navigationButtons) {
        addNavigationButtons(data.totalResults);
    }

    for (let key in data.Search) {
        listElement = document.createElement("li");
        listElement.className = "movieResult";

        anchorElement = document.createElement("a");
        anchorElement.onclick = function() {
            redirect(data.Search[key].Title);
        };
        anchorElement.href = "#";
        anchorElement.innerHTML = `${data.Search[key].Title} (${data.Search[key].Year})`;

        // Add the created elements to the page
        listElement.appendChild(anchorElement);
        resultsList.appendChild(listElement);
    }

    document.getElementById("searchResults").prepend(resultsTitle);
}

/* This function is used to tell the user that they entered some bad data on
 * the search page. The error is displayed where the search results would
 * normally be.
 */
function showError(message) {
    var errorMessage = document.createElement("p");

    errorMessage.id = "errorMessage";
    errorMessage.innerHTML = message;

    document.getElementById("searchResults").append(errorMessage);
}

/* This function changes the page number in the search results. */
function changePage(value, totalResults) {
    if (value == 0 && pageNumber > 1) {
        pageNumber--;
        search(false);
    } else if (value == 1 && pageNumber < (totalResults) / 10) {
        pageNumber++;
        search(false);
    }
}

/* This function adds navigation buttons to the bottom of the search results
 * page. This allows the user to sift through search results when more than 10
 * are available. */
function addNavigationButtons(totalResults) {
    var navigationDiv = document.getElementById("navigation");
    var prevButton = document.createElement("button");
    var nextButton = document.createElement("button");

    prevButton.onclick = function() {
        changePage(0, totalResults);
    }
    prevButton.innerHTML = "Prev";
    prevButton.className = "navigationButton";

    nextButton.onclick = function() {
        changePage(1, totalResults);
    }
    nextButton.innerHTML = "Next";
    nextButton.className = "navigationButton";

    navigationDiv.appendChild(prevButton);
    navigationDiv.appendChild(nextButton);

    navigationButtons = true;
}

/* This function redirects the user to the information page of the specific
 * movie title that they selected. */
function redirect(movieTitle) {
    sessionStorage.setItem("movieTitle", movieTitle);
    window.location.href = "movie_details.html";
}
