const authorModel = require("../model/authorModel")
const blogModel = require("../model/blogModel")
const jwt = require("jsonwebtoken")
const moment = require("moment")
const mongoose = require("mongoose")
//const ObjectId = mongoose.Schema.Types.ObjectId
const isValidObjectId = (ObjectId) => {
  return mongoose.Schema.Types.ObjectId
}
//1================================================================
let blog = async function (req, res) {
  try {
    let getData = req.body;
    if (Object.keys(getData).length != 0) {
      let title = req.body.title;
      let body = req.body.body;
      let authorid = req.body.authorId;
      let tags = req.body.tags;
      let category = req.body.category;
      let subcategory = req.body.subcategory;
      // if (data.length != 0) return res.status(400).send("Please Enter Data");
      if (!title) return res.status(400).send("Please Enter title");
      if (!body) return res.status(400).send("Please Details about your Blog");
      if (!tags) return res.status(400).send("Please Enter Your Tags");
      if (!category) return res.status(400).send("Please Enter Your Blog category");
      if (!subcategory) return res.status(400).send("Please Enter Your Blog's subcategory");
      if (!authorid) return res.status(400).send("Please Enter Author id");
      let author = await authorModel.findById({ _id: authorid });
      if (!author) return res.status(400).send("author is not present")
      // let token = jwt.sign(
      //   {
      //     authorId: author._id.toString(), 
      //     batch: "radium",
      //     organisation: "Functionup",
      //   },
      //   "functionup-thorium"
      // );
      if (getData.isPublished == true) {
        getData.publishedAt = Date.now()
        let saved = await blogModel.create(getData);
        // res.setHeader("x-api-key", token);
        return res.status(201).send({ data: saved });

      }
      else {
        let saved = await blogModel.create(getData);
        //res.setHeader("x-api-key", token);
        return res.status(201).send({ data: saved });
      }
    }

    else {
      res.status(400).send({ status: false, msg: "invalid request" })
    }
  }
  catch (err) {
    res.status(500).send({ Error: err.message })
  }
};

//2=============================================================================
let getblog = async function (req, res) {
  try {
    let value = req.query;
    if (!value) return res.status(400).send("Please Enter data")
    let filter = await blogModel.findOne({ $and: [value, { isDeleted: false, isPublished: true }] })
    if (filter.length == 0) return res.status(404).send({ Error: "Record Not found" })
    // let token = req.headers["x-api-key"]
    // let decodedToken = jwt.verify(token, "functionup-thorium");
    // if (!decodedToken)
     // return res.status(401).send({ status: false, msg: "token is invalid" });

    res.status(200).send({ status: true, data: filter })
  }
  catch (err) {
    res.status(500).send(err.message)
  }
}
//3===========================================================================
let updateblog = async function (req, res) {
  try {
    let blogid = req.params.blogId;
    let requestBody = req.body
    if (!blogid) return res.status(400).send("Please enter your id");
    if (!isValidObjectId(blogid))
      return res.status(400).send({ status: false, msg: "please provide a valid object id" })
    const { title, tags, subcategory, category, body, isPublished } = requestBody
    let blog = await blogModel.findOne({ _id: blogid, isDeleted: false });
    if (!blog) return res.status(400).send("No Such blog exist");
    let updateBlogData = {}
    if ("title" in requestBody) {
      if (!"$set" in updateBlogData) {
        updateBlogData["$set"] = {}
      }
      updateBlogData["title"] = title
    }
    if ("subcategory" in requestBody) {
      if (!"$set" in updateBlogData) {
        updateBlogData["$set"] = {}
      }
      // let subcat=subcategory.map(x=>x.trim())
      updateBlogData["subcategory"] = subcategory

    }
    if ("tags" in requestBody) {
      updateBlogData["tags"] = tags
    }
    if ("category" in requestBody) {
      updateBlogData["category"] = category
    }
    if ("isPublished" in requestBody) {
      let publishedBlog = await blogModel.findOne({ _id: blogid, isDeleted: false, isPublished: false })
      if (!publishedBlog) {
        return res.status(400).send({ status: false, msg: "blog already published" })
      }
      updateBlogData["isPublished"] = isPublished
      updateBlogData["publishedAt"] = Date.now()
    
    }
    let update = await blogModel.findOneAndUpdate({ _id: blogid }, updateBlogData, { new: true });
    return res.status(200).send({ status: true, data: update })
    
  }
  catch (err) {
    res.status(500).send(err.message)
  }
}

//4===========================================================================
let deleted = async function (req, res) {
  let blogid = req.params.blogId;
  if (!blogid) return res.status(400).send("Please enter Blog id")
  let model = await blogModel.findById(blogid)
  if (!model) return res.status(404).send("blog Not found")
   let del = model.isDeleted;
  let len = del.length
  if (len == 0) return res.status(400).send("Not found")
  if (del == true) return res.status(400).send("Blog is already deleted")
  let modified = await blogModel.findByIdAndUpdate({ _id: blogid }, { isDeleted: true, deletedAt: Date.now() }, { new: true })
  res.status(200).send({ data: modified })
}

//5=============================================================================
const deletequery = async function (req, res) {

  try {
    let requestQuery = req.query
    d = { isDeleted: true, deletedAt: Date.now() }
    let filterQuery = { isDeleted: false }
    const{ authorId, subcategory, tags, category, isPublished } = requestQuery
    if ("authorId" in requestQuery) {
      filterQuery["authorId"] = authorId
    }
    if ("subcategory" in requestQuery) {
      filterQuery["subcategory"] = subcategory
    }
    if ("tags" in requestQuery) {
      filterQuery["tags"] = tags
    }
    if ("category" in requestQuery) {
      filterQuery["category"] = category
    }

    if ("isPublished" in requestQuery) {
      filterQuery["isPublished"] = isPublished
    }
    let blog = await blogModel.findOne({ filterQuery })
    if (!blog) return res.status(404).send("blog Not found")
    // let token = req.headers["x-api-key"]
    // let decodedToken = jwt.verify(token, "functionup-thorium");
    // if (!decodedToken)
    //   return res.status(401).send({ status: false, msg: "token is invalid" });
    // let authorToBeModified = blog.authorId
    // let userLoggedIn = decodedToken.authorId
    // if (authorToBeModified != userLoggedIn) return res.status(403).send({ status: false, msg: 'User logged is not allowed to modify the requested users data' })
    let update = await blogModel.findOneAndUpdate(filterQuery, d, { new: true })
    if (!update) return res.status(404).send({ status: false, msg: "Not found and data is allready deleted" })
    return res.status(200).send({ status: true, data: update })

  }
  catch (error) {
    res.status(500).send({ msg: "Error", error: error.message })
  }
}
module.exports.updateblog = updateblog;
//module.exports.Author = Author;
module.exports.blog = blog;
module.exports.getblog = getblog;
module.exports.deleted = deleted;
module.exports.deletequery = deletequery;