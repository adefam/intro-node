const { promisify } = require('util');
const passport = require('passport');
/* eslint-disable no-shadow */
const User = require('../models/user');
const product = require('../models/product');
const { hash } = require('../util/helpers');
const { send } = require('../util/mail');
// const popup = require('node-popup');
// const popup2 = require('node-popup/dist/cjs.js');
// const User = require('../models/user');

exports.homePage = (req, res) => {
  res.render('register.ejs');
};

exports.register = async (req, res, next) => {
  const [firstName, lastName] = req.body.name.split(' ');
  const { password, password2, email, phone } = req.body;

  const checkUser = await User.findOne({ where: { email: email } }); // To check if the user exist
  if (checkUser) {
    req.flash('error', 'User is already registered');
    return res.render('register.ejs');
  }

  if (password !== password2) {
    req.flash('error', 'Password do not match');
    return res.render('register.ejs');
  }
  if (password.length < 8) {
    // Check password length
    req.flash('error', 'Password should be at least 8 characters');
    return res.render('register.ejs');
  }

  User.register(
    {
      firstName,
      lastName,
      email,
      phone,
      username: email,
    },
    password,
    (err, user) => {
      if (err) {
        console.log('Error Message:', err);
        req.flash('error', `${err.message}`);
        res.redirect('/register');
      }
      if (user) {
        passport.authenticate('local', function(err, user, info) {
          if (err) {
            return next(err);
          }
          if (!user) {
            req.flash('error', `${info.message}`);
            return res.redirect('/login');
          }
          req.logIn(user, function(err) {
            if (err) {
              return next(err);
            }
            req.flash('success', `User registered successfully`);
            req.flash('success', `User logged in successfully`);
            return res.render('dashboard', {
              firstName: user.dataValues.firstName,
              // ...res.locals.user.dataValues,
              productDetail: res.locals.products,
            });
          });
        })(req, res, next);
      }
    }
  );
};

exports.dashboard = (req, res) => {
  const { user } = res.locals;
  res.render('dashboard', { firstName: user.firstName });
};
