const express = require("express");

const app = express();
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
