const express = require('express');
const router = express.Router();
const authorController= require("../controller/authorController")
const blogController= require("../controller/blogController")


router.post("/author",authorController.Author)
router.post("/blogs", blogController.blog)
router.get("/blogs", blogController.getblog)
router.put("/blogs/:blogId", blogController.updateblog)
router.delete("/blogs/:blogId", blogController.deleted)
router.delete("/blogs",blogController.deletequery)














module.exports = router;