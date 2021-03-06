const express = require('express');
const router = express.Router();
const authorController= require("../controller/authorController")
const blogController= require("../controller/blogController")
const mid= require("../middleware/allMiddleware")


router.post("/authors",authorController.Author)
router.post("/blogs",mid.authentication, blogController.blog)
router.get("/blogs",mid.authentication,blogController.getblog)
router.put("/blogs/:blogId",mid.authentication,mid.authorisation, blogController.updateblog)
router.delete("/blogs/:blogId",mid.authentication, mid.authorisation, blogController.deleted)
router.delete("/blogs", mid.authentication,mid.authorisation, blogController.deletequery)
router.post("/login", authorController.loginAuthor)













module.exports = router;