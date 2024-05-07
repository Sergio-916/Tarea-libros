const Service = require("../service/service");

class Controller {
  async searchBooks(req, res) {
    const { title, author, genre } = req.query;
    if (title || author || genre) {
      const books = await Service.searchBooks(title, author, genre);
      res.render("./page/search-result", { books: books, title: title });
    } else {
      res.render("./page/search-result", { books: null, title: "" });
    }
  }
  async selectBooks(req, res) {
    try {
      const { id } = req.params;
      const book = await Service.selectBooks(id);
      res.render("./page/book-detail", { book: book });
    } catch (error) {
      console.error("Error fetching book:", error);
      res.status(500).send("Error fetching book details");
    }
  }

  async addFavorites(req, res) {
    try {
      const {
        id,
        title,
        author,
        description,
        image_url,
        page_count,
        main_category,
        language,
        publish_year,
        categories,
      } = req.body;
      const book = await Service.addFavorites(
        id,
        title,
        author,
        description,
        image_url,
        page_count,
        main_category,
        language,
        publish_year,
        categories
      );
      if (book.success === true) {
        res.redirect("/books/favorites/" + id);
      } else {
        res.send(book.message);
      }
    } catch (error) {
      console.error("Error adding favorite book:", error);
    }
  }

  async showFavorites(req, res) {
    const favoriteBooks = await Service.showFavorites();
    res.render("./page/favorites", { favoriteBooks: favoriteBooks });
  }
  async showFavoriteBook(req, res) {
    const { id } = req.params;
    const favoriteBook = await Service.showFavoriteBook(id);
    const booksCount = await Service.showRecommendedBooks(id);
    res.render("./page/favorites-book-detail", {
      favoriteBook: favoriteBook,
      booksCount: booksCount,
    });
  }

  async removeFavorites(req, res) {
    const { id } = req.params;
    const book = await Service.removeFavorites(id);
    if (book.success === true) {
      res.redirect("/books/favorites");
    } else {
      res.send(book.message);
    }
  }

  async getTopBooks(req, res) {
    const books = await Service.getTopBooks();
    res.render("./page/top-books", { books: books });
  }

  async booksRecomendations(req, res) {
    const books = await Service.booksRecomendations();
    res.render("./page/index.ejs", {
      books: books,
      category: books ? books.category : undefined,
    });
  }

  async recommendBook(req, res) {
    const { id } = req.params;
    const book = await Service.recommendBook(id);

    if (book.success === true) {
      res.redirect("/books/favorites/" + id);
    } else {
      res.send(book.message);
    }
  }
}

module.exports = new Controller();
