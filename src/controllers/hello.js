hello = "Hello world";
const Controller1 = {
  hello: (req, res) => {
    res.render("hello", {
      hello,
    });
  },
};

module.exports = Controller1;
