const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const htmlRoute = require("./routes/html-routes");
const userApiRoute = require("./routes/api-routes");
const db = require("./models");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(logger("dev"));
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Store all HTML files in view folder.

app.use(htmlRoute);

app.use(userApiRoute);

var MONGODB_URI = process.env.MONGODB_URL || "mongodb://localhost/budget";
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  family: 4 // Use IPv4, skip trying IPv6
};
mongoose.connect(MONGODB_URI, options);

// Start the server
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
