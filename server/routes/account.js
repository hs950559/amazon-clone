const express = require('express');
const router = require('express-promise-router')();

const AccountController = require('../controllers/account');

router.route('/signup')
  .post(AccountController.signUp);

router.route('/signin')
  .post(AccountController.signIn);

router.route('/')
  .get(AccountController.index);

module.exports = router;