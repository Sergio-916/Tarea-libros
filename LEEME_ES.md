
# BookFavs: Una Aplicación de Gestión de Libros

## Descripción general

BookFavs es una aplicación web que permite a los usuarios buscar, seleccionar y gestionar sus libros favoritos. Se integra con una API pública para obtener datos de libros y ofrece una interfaz amigable para interactuar con estos datos. Los usuarios pueden buscar libros por título, autor o género, ver información detallada sobre cada libro y agregar libros a su lista de favoritos personal. Además, la aplicación ofrece características para ver los libros más populares y obtener recomendaciones personalizadas de libros.

## Características

- **Buscar Libros**: Busca libros por título, autor o género.
- **Detalles del Libro**: Consulta información detallada sobre los libros, incluyendo autor, descripción e imagen de portada.
- **Gestionar Favoritos**: Agrega libros a favoritos, visualiza tu lista de libros favoritos y elimina libros de los favoritos.
- **Libros Más Populares**: Visualiza una lista de los libros más populares basada en la relevancia.
- **Recomendaciones Personalizadas**: Obtén recomendaciones de libros basadas en tus favoritos y otros criterios.

## Primeros pasos

Para ejecutar la aplicación localmente:

1. Instala Node.js y npm.
2. Clona el repositorio en tu máquina local.
3. Navega al directorio del proyecto e instala las dependencias:
   ```bash
   npm install
   ```
4. Inicia el servidor:
   ```bash
   npm start
   ```

La aplicación estará disponible en `http://localhost:3030`.

## Tecnologías

- **Node.js**: Entorno de ejecución de JavaScript del lado del servidor.
- **Express**: Marco de aplicación web para Node.js.
- **EJS**: Lenguaje de plantillas para generar marcado HTML con JavaScript puro.
- **MySQL**: Base de datos para almacenar libros favoritos y recomendaciones.
