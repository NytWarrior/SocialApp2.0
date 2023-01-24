const User = require('../models/user');


module.exports.profile = function (req, res) {
    //res.end('<h1>User Profile</h1>')
    // return res.render('user_profile', {
    //     title: 'Profile'
    // })
    if (req.cookies.user_id) {
        User.findById(req.cookies.user_id, function (err, user) {
            if (user) {
                return res.render('user_profile', {
                    title: "User Profile",
                    user: user
                })
            } else {
                return res.redirect('/users/sign-in');
            }
        })
    } else {
        return res.redirect('/users/sign-in');
    }
}


//render the signup page
module.exports.signUp = function (req, res) {
    return res.render('user_signUp', {
        title: "Sign Up"
    })
}

//render the signin page
module.exports.signIn = function (req, res) {
    return res.render('user_signIn', {
        title: "Sign In"
    })
}

//get the signup data
module.exports.create = function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }

    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) { console.log('Error in finding user in signing up'); return }

        if (!user) {
            User.create(req.body, function (err, user) {
                if (err) { console.log('Error in creating user while in signing up'); return }

                return res.redirect('/users/sign-in');
            })
        } else {
            return res.redirect('back');
        }
    })
}

//sign in and create a session for the user
module.exports.createSession = function (req, res) {
    //steps to authenticate

    //find the user
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) { console.log('Error infinding the user in signing in.'); return }

        //handle user found
        if (user) {
            //handle password which doesn't match
            if (user.password != req.body.password) {
                return res.redirect('back');
            }
            //handle session creation
            res.cookie('user_id', user.id);
            return res.redirect('/users/profile');
        }
        else {
            //handle user not found
            return res.redirect('back');
        }

    })


}