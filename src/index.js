const express = require("express");
var app = express();
const port = 3000;

// 設定 view engine
app.set("view engine", "ejs");
const Controller1 = require("./controllers/hello");
const Controller2 = require("./controllers/login");

app.get("/hello", Controller1.hello);
app.get("/login", Controller2.login);

//app.get('/login',function(req, res){
//  res.render('login');
//});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
