date="2022/10/11(二)";
loginStatus="(未登入)";
navbarItem= ["首頁","一樓","二樓","三樓","四樓","五樓","登入註冊"];
statusTableColumn=["時間/教室","103","105","107"];
classroomStatus = [
  ["已借出", "狀態:未歸還","資料庫系統"],
  ["已借出", "狀態:未歸還","資料庫系統"],
  ["借用", "已借出","資料庫系統"]
];
ntouLogoSrc="img/ntouLogo.jpg";
const Controller = {
  hello: (req, res) => {
    res.render("hello", {
      ntouLogoSrc,date,loginStatus,navbarItem,statusTableColumn,classroomStatus
    });
  },
};

module.exports = Controller;
