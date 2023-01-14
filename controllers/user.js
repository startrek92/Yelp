const User = require('../models/user');
const passport = require('passport');

module.exports.registerForm = (req, res) => {
    res.render('./user/register');
}

module.exports.addUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body.user;
        const user = new User({ email, username });
        const newUser = await User.register(user, password);
        req.login(newUser, err => {
            if (err) {
                next(err);
            } else {
                req.flash('success', `Welcome to Yelp ${username}`);
                res.redirect('/camps');
            }
        })
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
}

module.exports.loginForm = (req, res) => {
    console.log(req.session);
    res.render('./user/login');
}

module.exports.loginUser = async (req, res) => {
    console.log(req.session);
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    console.log(redirectUrl);
    req.flash('success', `Welcome back ${req.body.username}`);
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(new CustomError('Error', 500));
        }
        req.flash('success', 'Logged Out');
        res.redirect('/camps');
    });
}