var express = require('express');
const User = require('../models/user.js');
const { route } = require('./index.js');

var router = express.Router();

let makeField = (name, label, type) =>
  `
    <div class="mb-3 row">
      <label for="${name}" class="col-3 col-form-label"> ${label} </label>
      <div class="col">
        <input type="${type}" class="form-control" id="${name}" name="${name}" placeholder="${label}" required>
      </div>
    </div>
`;

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/', async (req, res) => {
  try {
    // TODO: verify infos like if user exist, if email is valid, etc
    const user = new User({
      username: req.body.username,
      // TODO: hash password agiain
      password: req.body.password,
      email: req.body.email,
      admin: false,
      id: req.body.id,
      phone: req.body.phone,
      confirmed: false
  });
    await user.save();
    res.send(user);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.get('/new', function (req, res, next) {
  res.render('user/entry', { title: 'Register', form: 'registerForm', makeField: makeField });
});


module.exports = router;
