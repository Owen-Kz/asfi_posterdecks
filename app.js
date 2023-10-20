const express = require("express");
const pool = require("./routes/db.config");
const pdfJsPath = require.resolve('pdfjs-dist/build/pdf.js');
// console.log(pdfJsPath);

const { Client } = require('pg');
const connectionString = process.env.DATABASE_URL;
const dotenv = require("dotenv").config();


const app =  express();
const cookie = require("cookie-parser");
const PORT = process.env.PORT || 2020;
const server = require("http").Server(app)
const session = require("express-session"); 

const bodyParser = require("body-parser");
const { CreateTableForPosterDecks } = require("./routes/queries");

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(express.urlencoded({ extended: true }));
app.use(cookie());
app.use(express.json());


app.set("view engine", "ejs");
app.set("views", ["./views"]);

app.use("/css", express.static(__dirname + "/public/css", { type: 'text/css' }))
app.use("/js", express.static(__dirname + "/public/js", { type: 'text/javascript' }))
app.use("/js", express.static(__dirname + "/public/js", { type: 'text/javascript' }))

app.use("/files/images", express.static(__dirname + "/public/images", { type: 'file/images' }))
app.use("/uploads/profileimage", express.static(__dirname + "/public/useruploads/images", { type: 'file/images' }))
app.use("/uploads/posters", express.static(__dirname + "/public/useruploads", { type: 'file/pdf' }))
app.use("/pdfjs", express.static(__dirname + "/node_modules/pdfjs-dist/build/", { type: 'file/pdf' }))


// CreateTableForPosterDecks();


app.use("/", require("./routes/pages"));
// server.listen(PORT);
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// client.end();  // Close the client when you're done with your queries