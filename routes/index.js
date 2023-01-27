const express = require('express')

const router = express.Router()
const homeController = require('../controllers/home_Controller');


router.get('/', homeController.home);
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));

//for any further routes, access from here
//router.use('/routerName', reuire('./routerfile))

module.exports = router;