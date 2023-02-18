const mongoose = require('mongoose');

const multer = require('multer');
const path = require('path');
const MULTIMEDIA_POST_PATH = path.join("/uploads/users/posts");

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    image: {
        type: String
    },
    video: {
        type: String
    },
    // include the array of ids of all comments in this post schema itself
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ]
}, {
    timestamps: true
});

const multimediaTypeFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/gif"
    ) {
        if (file.size > 1024 * 1024 * 3) {
            cb(new Error("File is too large. Max size is 3MB"), false);
        } else {
            cb(null, true);
        }
    } else if (
        file.mimetype === "video/mp4" ||
        file.mimetype === "video/ogg" ||
        file.mimetype === "video/mkv" ||
        file.mimetype === "video/webm"
    ) {
        if (file.size > 1024 * 1024 * 3) {
            cb(new Error("File is too large. Max size is 3MB"), false);
        } else {
            cb(null, true);
        }
    } else {
        cb(null, false);
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "..", MULTIMEDIA_POST_PATH));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix);
    },
});

postSchema.statics.uploadedMultimediaPost = multer({
    storage: storage,
    fileFilter: multimediaTypeFilter,
}).fields([
    {
        name: "image",
        maxCount: 1,
    },
    {
        name: "video",
        maxCount: 1,
    },
]);


postSchema.statics.multimediaPostPath = MULTIMEDIA_POST_PATH;

const Post = mongoose.model('Post', postSchema);
module.exports = Post;