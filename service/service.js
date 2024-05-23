require("dotenv").config();
const buildQueryURL = require("../utils/build.query");
const fetch = require("isomorphic-fetch");
const {
  pool,
  createDBTable,
  createBookTable,
} = require("../config/db.connect");

const API_KEY = process.env.API_KEY;

class Service {
  async searchBooks(title, author, genre) {
    const url = buildQueryURL(title, author, genre, API_KEY); // optimisation of search query
    const response = await fetch(url);
    const books = await response.json();
    if (books && books.items) {
      const filteredBooks = books.items
        .filter(
          (book) =>
            book.volumeInfo && // Ensure volumeInfo exists
            (book.volumeInfo.language === "en" ||
              book.volumeInfo.language === "es") &&
            book.volumeInfo.title && // Ensure there is a title
            book.volumeInfo.authors &&
            book.volumeInfo.authors.length > 0 && // Ensure there are authors
            book.volumeInfo.imageLinks &&
            book.volumeInfo.imageLinks.thumbnail && // Ensure there is a thumbnail image
            book.volumeInfo.publishedDate && // Check for publishedDate existence
            book.volumeInfo.publishedDate.length >= 4 // Ensure the publishedDate is long enough
        )
        .map((book) => ({
          ...book,
          volumeInfo: {
            ...book.volumeInfo,
            publishedDate: book.volumeInfo.authors.join(", "), // Store only the year
          },
        }));
      return { ...books, items: filteredBooks }; // Return modified books object with filtered items
    } else {
      return null;
    }
  }

  async selectBooks(id) {
    const url = `https://www.googleapis.com/books/v1/volumes/${id}?key=${API_KEY}`;
    const response = await fetch(url);
    const book = await response.json();
    const filBook = book.volumeInfo.publishedDate.slice(0, 4);
    return {
      ...book,
      volumeInfo: { ...book.volumeInfo, publishedDate: filBook },
    };
  }

  async addFavorites(
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
  ) {
    const connection = await pool.getConnection();
    try {
      await createDBTable();
      const bookcheck = "SELECT * FROM books WHERE book_id = ?";
      const [res] = await connection.query(bookcheck, [id]);
      if (res.length > 0) {
        return { success: false, message: "Book already exists" };
      } else {
        const data =
          await "INSERT INTO books (book_id, title, author, description, image_url, page_count, main_category, language, publish_year, categories) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const [result] = await connection.query(data, [
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
        ]);
        if (result.affectedRows === 1) {
          return { success: true, message: "Book added to favorites" };
        } else {
          return { success: false, message: "Failed to add book to favorites" };
        }
      }
    } finally {
      if (connection) connection.release();
    }
  }

  async showFavorites(id) {
    const connection = await pool.getConnection();
    try {
      await createDBTable();
      const [rows, fields] = await connection.query(`SHOW TABLES LIKE 'books'`);
      if (rows.length === 0) {
        await createDBTable();
        console.log("Database created successfully");
      }
      const sql =
        "SELECT book_id, title, author, description, image_url, page_count, main_category, language, publish_year FROM books";
      const [result] = await connection.query(sql);
      return result;
    } finally {
      if (connection) connection.release();
    }
  }
  async showFavoriteBook(id) {
    const connection = await pool.getConnection();
    try {
      const sql =
        "SELECT book_id, title, author, description, image_url, page_count, main_category, language, publish_year FROM books WHERE book_id = ?";
      const [result] = await connection.query(sql, [id]);
      return result[0];
    } finally {
      if (connection) connection.release();
    }
  }

  async removeFavorites(id) {
    const connection = await pool.getConnection();
    try {
      const sql = "DELETE FROM books WHERE book_id = ?";
      const [result] = await connection.query(sql, [id]);
      if (result.affectedRows === 1) {
        return { success: true, message: "Book removed from favorites" };
      } else {
        return {
          success: false,
          message: "Failed to remove book from favorites",
        };
      }
    } finally {
      if (connection) connection.release();
    }
  }

  async getTopBooks() {
    const url = `https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=relevance&maxResults=20&key=${API_KEY}`;

    const response = await fetch(url);
    const books = await response.json();
    if (books && books.items) {
      const filteredBooks = books.items.filter(
        (book) =>
          book.volumeInfo && // Ensure volumeInfo exists
          (book.volumeInfo.language === "en" ||
            book.volumeInfo.language === "es") &&
          book.volumeInfo.title && // Ensure there is a title
          book.volumeInfo.authors &&
          book.volumeInfo.authors.length > 0 && // Ensure there are authors
          book.volumeInfo.imageLinks &&
          book.volumeInfo.imageLinks.thumbnail &&
          book.volumeInfo.publishedDate &&
          book.volumeInfo.publishedDate.slice(0, 4)
      );
      return { ...books, items: filteredBooks }; // Return modified books object with filtered items
    } else {
      return null;
    }
  }

  async booksRecomendations() {
    const connection = await pool.getConnection();
    try {
      await createDBTable();
      const sql = `SELECT second_category, COUNT(*) AS category_count 
      FROM (
        SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(categories, ' / ', 2), ' / ', -1) AS second_category 
        FROM books 
      ) AS subquery
      GROUP BY second_category
      ORDER BY category_count DESC
      LIMIT 1`;
      const [categoriesResult] = await connection.query(sql);
      if (categoriesResult.length === 0) {
        console.log("No category in the database.");
      }
      const category = categoriesResult[0];

      const [bookIDs] = await connection.query(`SELECT book_id FROM books`);
      const bookIdList = bookIDs.map((book) => book.book_id);

      const url = `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(
        category
      )}&orderBy=relevance&maxResults=25&key=${API_KEY}`;
      const response = await fetch(url);
      const books = await response.json();

      if (books && books.items) {
        const filteredBooks = books.items.filter(
          // filter consistent data to avoid mising information
          (book) =>
            book.volumeInfo &&
            (book.volumeInfo.language === "en" ||
              book.volumeInfo.language === "es") &&
            book.volumeInfo.title &&
            book.volumeInfo.authors &&
            book.volumeInfo.authors.length > 0 &&
            book.volumeInfo.imageLinks &&
            book.volumeInfo.imageLinks.thumbnail &&
            book.volumeInfo.publishedDate &&
            book.volumeInfo.pageCount &&
            !bookIdList.includes(book.id) // filter that books won't show up if it's already in the list
        );
        return {
          ...books,
          items: filteredBooks,
          category: category, // Add category property
        };
      } else {
        return null;
      }
    } finally {
      connection.release();
    }
  }

  async recommendBook(id) {
    const connection = await pool.getConnection();
    try {
      await createBookTable();
      const sql = `INSERT INTO recommended_books (book_id) VALUES (?)`;
      const [result] = await connection.query(sql, [id]);
      if (result.affectedRows === 1) {
        return { success: true, message: "Book added to recommmended" };
      } else {
        return {
          success: false,
          message: "Failed to add book to recommended",
        };
      }
    } catch (err) {
      console.error("Failed to create table:", err);
    }
  }
  async showRecommendedBooks(id) {
    const connection = await pool.getConnection();
    try {
      await createBookTable();
      const sql = `SELECT book_id, COUNT(book_id) AS count
      FROM recommended_books
      WHERE book_id = ?
      GROUP BY book_id;`;
      const [booksCount] = await connection.query(sql, [id]);
      if (booksCount.length === 0) {
        console.log("No book in the database.");
        return null;
      } else {
        return booksCount[0].count;
      }
    } catch (err) {
      console.error("Failed to create table:", err);
    }
  }
}

module.exports = new Service();
