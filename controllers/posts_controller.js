const Post = require('../models/post')
const Comment = require('../models/comment');
const Like = require('../models/like');

const fs = require("fs");
const path = require("path");

module.exports.create = async function (req, res) {

    try {
        Post.uploadedMultimediaPost(req, res, async (err) => {

            let image, video;

            //If the Files are uploaded successfully
            if (req.files) {
                if (req.files.image) {
                    image = Post.multimediaPostPath + "/" + req.files.image[0].filename;
                } else {
                    image = "";
                }
                if (req.files.video) {
                    video = Post.multimediaPostPath + "/" + req.files.video[0].filename;
                } else {
                    video = "";
                }
            }

            //Set the Post Content
            const content = req.body.content;
            let user = req.user._id;

            //Create the Post
            let post = await Post.create({
                content: content,
                user: user,
                image: image,
                video: video,
            });

            if (req.xhr) {
                try {
                    return res.status(200).json({
                        data: {
                            post: post,
                            user: req.user,
                            message: "Post Created!",
                        },
                        message: "Post Created!",
                    });
                }
                catch (err) {
                    const error = "Server Error in Creating Post!";
                    console.log("Error: ", err);
                    return res.status(500).json({
                        error: error,
                        message: error,
                    });
                }
            }
            req.flash("success", "Post Published!");
            return res.redirect("back");
        });
    }
    catch (err) {
        req.flash('error', err);
        console.log(err);
        return res.redirect('back');
    }

}

module.exports.destroy = async function (req, res) {
    try {
        let post = await Post.findById(req.params.id);
        //.id means converting the object id into string
        if (post.user == req.user.id) {

            if (post.image) {
                //If Post Image already exists in the "/uploads/users/posts" Directory
                if (fs.existsSync(path.join(__dirname, "..", post.image))) {
                    //Delete that Post Image from the Directory
                    fs.unlinkSync(path.join(__dirname, "..", post.image));
                }
            }

            //If Post Video already exists in the Database
            if (post.video) {
                //If Post Video already exists in the "/uploads/users/posts" Directory
                if (fs.existsSync(path.join(__dirname, "..", post.video))) {
                    //Delete that Post Video from the Directory
                    fs.unlinkSync(path.join(__dirname, "..", post.video));
                }
            }

            await Like.deleteMany({ likeable: post, onModel: 'Post' });
            await Like.deleteMany({ _id: { $in: post.comments } });

            post.remove();

            await Comment.deleteMany({ post: req.params.id });

            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }

            req.flash('success', 'Post and its comment deleted!!');
            return res.redirect('back');
        } else {
            req.flash('error', 'Post cannot be deleted!!');
            return res.redirect('back');
        }
    }
    catch (err) {
        req.flash('error', err);
        return res.redirect('back');;
    }
}