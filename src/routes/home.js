var express = require("express");
var router = express.Router();

let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0');
let yyyy = today.getFullYear();
let weekdayindex = today.getDay();
let weekdayChinese = ["一", "二", "三", "四", "五", "六", "七"];
let weekday = weekdayChinese[weekdayindex];
today = yyyy + '/' + mm + '/' + dd + '(' + weekday + ')';

loginStatus = "(未登入)";
navbarItem = ["首頁", "一樓", "二樓", "三樓", "四樓", "五樓", "登入註冊"];
statusTableColumn = ["時間/教室", "103", "105", "107"];
classroomStatus = [
	["已借出", "狀態:未歸還", "資料庫系統"],
	["已借出", "狀態:未歸還", "資料庫系統"],
	["借用", "已借出", "資料庫系統"]
];
ntouLogoSrc = "img/ntouLogo.jpg";

router.get("/", function (req, res) {
	res.render("home", {
		ntouLogoSrc, today, loginStatus, navbarItem, statusTableColumn, classroomStatus
	});
});

module.exports = router;

