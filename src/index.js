const express = require("express");
const app = express();
const port = 3000;

// 設定 view engine
app.set("view engine", "ejs");
const Controller = require("./controllers/hello");

app.get("/hello", Controller.hello);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
