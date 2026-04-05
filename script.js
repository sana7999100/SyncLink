function searchFunction() {
    var query = document.getElementById("myInput").value;
    var grid = document.getElementById("bookGrid");
    var title = document.getElementById("titleUpdate");

    if (query === "") {
        alert("Please enter a name!");
        return;
    }

    title.innerText = "Results for: " + query;
    grid.innerHTML = "<p>Loading books...</p>";

    // FIXED API URL
    var url = "https://openlibrary.org" + query + "&limit=10";

    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            grid.innerHTML = ""; 
            
            var books = data.docs;

            if (!books || books.length === 0) {
                grid.innerHTML = "<p>No books found. Try another name!</p>";
                return;
            }

            for (var i = 0; i < books.length; i++) {
                var currentBook = books[i];
                var coverId = currentBook.cover_i;
                
                // FIXED IMAGE URL
                var imgUrl = "https://placeholder.com";
                
                if (coverId) {
                    imgUrl = "https://openlibrary.org" + coverId + "-M.jpg";
                }

                var cardHtml = 
                '<div class="book-card">' +
                    '<img src="' + imgUrl + '">' +
                    '<h4>' + currentBook.title + '</h4>' +
                    '<button onclick="alert(\'Bookmarked!\')" style="cursor:pointer; background:#38bdf8; border:none; padding:5px; border-radius:3px;">Save</button>' +
                '</div>';
                
                grid.innerHTML += cardHtml;
            }
        })
        .catch(function(error) {
            grid.innerHTML = "<p>Error loading books. Check your internet!</p>";
            console.log("Error: " + error);
        });
}

// Automatically load a default search so the page isn't empty when it opens
window.onload = function() {
    document.getElementById("myInput").value = "Solo Leveling";
    searchFunction();
};