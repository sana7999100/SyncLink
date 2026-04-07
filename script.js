function searchFunction() {
    var query = document.getElementById("search").value;
    var grid = document.getElementById("bookList");

    if (query === "") {
        alert("Please enter a name!");
        return;
    }

    grid.innerHTML = "<p>Loading books...</p>";

    var url = "https://openlibrary.org/search.json?q=" + query + "&limit=10";

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
                        <button onclick="alert('Bookmarked!')">Save</button>
                    </div>`;
                
                grid.innerHTML += cardHtml;
            });
        })
        .catch(error => {
            grid.innerHTML = "<p>Error loading books. Check your internet!</p>";
            console.log("Error: " + error);
        });
}
