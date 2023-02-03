const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = function (req, res) {
    //res.end('<h1>User Profile</h1>')
    User.findById(req.params.id, function (err, user) {
        return res.render('user_profile', {
            title: 'Profile',
            profile_user: user
        })
    })

}

module.exports.update = async function (req, res) {
    if (req.user.id == req.params.id) {
        // User.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
        //     return res.redirect('back');
        // });
        try {
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function (err) {
                if (err) { console.log('Multer Error', err) }

                user.name = req.body.name;
                user.email = req.body.email;

                if (req.file) {
                    // TODO: it will delete the previous avatar and update with new one
                    // but if there is no avatar before then it will give error
                    // if(user.avatar){
                    //     fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    // }

                    //this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });

        } catch (err) {
            req.flash('error', err);
            return res.redirect('back');
        }
    } else {
        return res.status(401).send('Unauthorized');
    }
}


//render the signup page
module.exports.signUp = function (req, res) {

    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('user_signUp', {
        title: "Sign Up"
    })
}

//render the signin page
module.exports.signIn = function (req, res) {

    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
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
//sign in and create a session
module.exports.createSession = function (req, res) {
    req.flash('success', 'Logged in Successfully!!');
    return res.redirect('/');
}

module.exports.destroySession = function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged Out!!');
        res.redirect('/');
    });
}