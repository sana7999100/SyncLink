// Load saved data from localStorage
let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];
let reviews = JSON.parse(localStorage.getItem("reviews")) || {};
let loggedInUser = localStorage.getItem("loggedInUser") || null;

function searchFunction() {
    var query = document.getElementById("search").value;
    var grid = document.getElementById("bookList");

    if (query === "") {
        alert("Please enter a name!");
        return;
    }

    grid.innerHTML = "<p>Loading books...</p>";

    // Save search history
    history.push(query);
    localStorage.setItem("history", JSON.stringify(history));
    updateHistory();

    var url = "https://openlibrary.org/search.json?q=" + encodeURIComponent(query) + "&limit=10";

    fetch(url)
        .then(response => response.json())
        .then(data => {
            grid.innerHTML = ""; 
            var books = data.docs;

            if (!books || books.length === 0) {
                grid.innerHTML = "<p>No books found. Try another name!</p>";
                return;
            }

            books.forEach(book => {
                var coverId = book.cover_i;
                var imgUrl = coverId 
                    ? "https://covers.openlibrary.org/b/id/" + coverId + "-M.jpg"
                    : "https://via.placeholder.com/150";

                var cardHtml = `
                    <div class="book">
                        <img src="${imgUrl}">
                        <h4>${book.title}</h4>
                        <button onclick="addBookmark('${book.title}')">Bookmark</button>
                        <button onclick="addReview('${book.title}')">Review</button>
                    </div>`;
                
                grid.innerHTML += cardHtml;
            });
        })
        .catch(error => {
            grid.innerHTML = "<p>Error loading books. Check your internet!</p>";
            console.error("Error: ", error);
        });
}

// Bookmark system
function addBookmark(title) {
    if (!loggedInUser) {
        alert("Please login to save bookmarks!");
        return;
    }
    if (!bookmarks.includes(title)) {
        bookmarks.push(title);
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
        updateBookmarks();
    }
}

function updateBookmarks() {
    let list = document.getElementById("bookmarkList");
    list.innerHTML = "";
    bookmarks.forEach(book => {
        list.innerHTML += `<li>${book}</li>`;
    });
}

// Search history
function updateHistory() {
    let list = document.getElementById("historyList");
    list.innerHTML = "";
    history.forEach(item => {
        list.innerHTML += `<li>${item}</li>`;
    });
}

// Reviews
function addReview(title) {
    if (!loggedInUser) {
        alert("Please login to add reviews!");
        return;
    }
    let reviewText = prompt("Write your review for " + title + ":");
    if (reviewText) {
        if (!reviews[title]) reviews[title] = [];
        reviews[title].push(loggedInUser + ": " + reviewText);
        localStorage.setItem("reviews", JSON.stringify(reviews));
        updateReviews();
    }
}

function updateReviews() {
    let section = document.getElementById("reviewSection");
    section.innerHTML = "";
    for (let book in reviews) {
        section.innerHTML += `<h4>${book}</h4>`;
        reviews[book].forEach(r => {
            section.innerHTML += `<p>- ${r}</p>`;
        });
    }
}

// Login system
function login() {
    document.getElementById("loginModal").style.display = "block";
}

function closeLogin() {
    document.getElementById("loginModal").style.display = "none";
}

function submitLogin() {
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    if (user === "" || pass === "") {
        alert("Please enter both username and password!");
        return;
    }

    loggedInUser = user;
    localStorage.setItem("loggedInUser", user);

    alert("Welcome, " + user + "! You are now logged in.");
    closeLogin();
}

// Default search + load saved data
window.onload = function() {
    document.getElementById("search").value = "Solo Leveling";
    searchFunction();
    updateBookmarks();
    updateHistory();
    updateReviews();
};
