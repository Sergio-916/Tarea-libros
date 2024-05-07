const express = require("express");
const app = express();
const router = require("./router/router");


const PORT = 3030;

app.set("view engine", "ejs");

app.use(express.json());
app.use("/public", express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
