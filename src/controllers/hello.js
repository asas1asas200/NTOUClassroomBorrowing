hello = "Hello world";
const Controller = {
  hello: (req, res) => {
    res.render("hello", {
      hello,
    });
  },
};

module.exports = Controller;
