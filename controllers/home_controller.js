const Post = require('../models/post')
const User = require('../models/user');

module.exports.home = function (req, res) {
    // return res.end('<h1>Express is up!!</h1>')

    // Post.find({}, function (err, posts) {
    //     return res.render('home', {
    //         title: "Home",
    //         posts: posts
    //     })
    // })

    //populate the user of each post(it will show all the detail of the user)
    Post.find({})
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        })
        .exec(function (err, posts) {
            User.find({}, function (err, users) {
                return res.render('home', {
                    title: "Home",
                    posts: posts,
                    all_users: users
                });
            });
        })
}


//module.exports.actionName = function(req, res){}