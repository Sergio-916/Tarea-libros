
# BookFavs: A Book Management Application

## Overview

BookFavs is a web application that enables users to search, select, and manage their favorite books. It integrates with a public API to fetch book data and provides a user-friendly interface for interacting with this data. Users can search for books by title, author, or genre, view detailed information about each book, and add books to their personal favorites list. Additionally, the application offers features to view the top books and get personalized book recommendations.

## Features

- **Search Books**: Search for books by title, author, or genre.
- **Book Details**: View detailed information about books, including author, description, and cover image.
- **Manage Favorites**: Add books to favorites, view your favorite books list, and delete books from favorites.
- **Top Books**: View a list of top books based on relevance.
- **Personalized Recommendations**: Get book recommendations based on your favorites and other criteria.

## Getting Started

To get the application running locally:

1. Install Node.js and npm.
2. Clone the repository to your local machine.
3. Navigate to the project directory and install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3030`.

## Technologies

- **Node.js**: Server-side JavaScript runtime.
- **Express**: Web application framework for Node.js.
- **EJS**: Templating language to generate HTML markup with plain JavaScript.
- **MySQL**: Database to store favorite books and recommendations.
