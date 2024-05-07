
function buildQueryURL(title, author, genre, API_KEY) {
    let query = 'https://www.googleapis.com/books/v1/volumes?q=';

    // Добавляем к запросу непустые параметры
    const queryParams = [];
    if (title) queryParams.push(`intitle:${encodeURIComponent(title)}`);
    if (author) queryParams.push(`inauthor:${encodeURIComponent(author)}`);
    if (genre) queryParams.push(`subject:${encodeURIComponent(genre)}`);

    
    query += queryParams.join('+');

  
    query += '&maxResults=30&key=' + API_KEY;

    return query;

}
module.exports = buildQueryURL;