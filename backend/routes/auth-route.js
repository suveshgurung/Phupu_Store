const router = require('express').Router({
  caseSensitive: true,
  strict: true,
});

const { login, signup, logout } = require('../controllers/auth-controller');

router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', logout);

module.exports = router;
