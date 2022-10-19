login = "Welcome, user";

const Controller2 = {
  login: (req, res) => {
    res.render("login", {
      login,
    });
  },
};

module.exports = Controller2;