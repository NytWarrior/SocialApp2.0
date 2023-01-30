const Post = require('../models/post')
const User = require('../models/user');

module.exports.home = async function (req, res) {

    try {
        //populate the user of each post(it will show all the detail of the user)
        let posts = await Post.find({})
            .populate('user')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user'
                }
            });

        let users = await User.find({});

        return res.render('home', {
            title: "Home",
            posts: posts,
            all_users: users
        });
    }
    catch (err) {
        console.log('Error', err);
    }
}


//module.exports.actionName = function(req, res){}