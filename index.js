const express = require("express");
const PORT = process.env.PORT || 5000

const app = express();
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
