const express = require("express");
const ejs = require("ejs");
const PORT = process.env.PORT || 5000;

const app = express();
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("pages/index", {
    title: "Choropleth Timelines",
  });
});

app.get("/covid", (req, res) => {
  res.render("pages/covid", { title: "Covid-19 Timeline" });
});

app.get("/monkeypox", (req, res) => {
  res.render("pages/monkeypox", {
    title: "Monkeypox Timeline",
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
