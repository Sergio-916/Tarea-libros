const express = require("express");
const router = express.Router();
const Controller = require("../controller/controller");

router.get("/books/search", Controller.searchBooks);

router.get("/books/select/:id", Controller.selectBooks);

router.post("/books/favorites/add", Controller.addFavorites);

router.get("/books/favorites", Controller.showFavorites);

router.post("/books/favorites/delete/:id", Controller.removeFavorites);

router.get("/books/favorites/:id", Controller.showFavoriteBook);

router.get("/books/top", Controller.getTopBooks);

router.get("/", Controller.booksRecomendations);

router.post("/books/favorites/recommend/:id", Controller.recommendBook);


module.exports = router;
