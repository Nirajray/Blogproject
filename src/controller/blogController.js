const authorModel = require("../model/authorModel")
const blogModel = require("../model/blogModel")
const moment = require("moment")
const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId


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
      let modelid = await authorModel.findById({ _id: authorid });
      if (!modelid) return res.status(400).send("No blog  exist with this author id")
      let id = modelid._id;
      if (!(id == authorid)) return res.status(400).send("Please enter a avlid autherId")
      if (getData.isPublished == true) {
        getData.publishedAt = Date.now()
        let saved = await blogModel.create(getData);
        return res.status(201).send({ data: saved });

      }
      else {
        let saved = await blogModel.create(getData);
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
let getblog = async function (req, res) {
  try {
    let data = req.query;
    if (!data) return res.status(400).send("Please Enter data")
    let filter = await blogModel.find({ $and: [data, { isDeleted: false, isPublished: true }] })
    if (filter.length == 0) return res.status(404).send({ Error: "Record Not found" })
    res.status(200).send({ status: true, value: filter })
  }
  catch (err) {
    res.status(500).send(err.message)
  }
}
let updateblog = async function (req, res) {
  try {
    let blogid = req.params.blogId;
    let data = req.body
    if (!blogid) return res.status(400).send("Please enter your id");  
    let blog = await blogModel.findById(blogid);
    if (!blog) return res.status(400).send("No Such blog exist");
    let d = blog.isDeleted
    let b={isPublished:true, publishedAt: Date.now()}
    if (!d) {
      let c = blog.isPublished
      if (!c) {
        let update = await blogModel.findOneAndUpdate({ _id: blogid },{$set:{data, b}},{ new: true });
        res.status(200).send({ status: true, value: update })
      }
      else {
        let updated = await blogModel.findById({ _id: blogid }, { $set: { isPublished: true, publishedAt: Date.now() } }, { new: true })
      }
    }
    else {
      res.send({ status: false, msg: "allready deleted" })
    }


  }
  catch (err) {
    res.status(500).send(err.message)
  }
}

let deleted = async function (req, res) {
  let blogid = req.params.blogId;
  if (!blogid) return res.status(400).send("Please enter Blog id")
  let model = await blogModel.findById({ _id: blogid })
  if (!model) return res.status(404).send("blog Not found")
  let del = model.isDeleted;
  let len = del.length
  if (len == 0) return res.status(400).send("Not found")
  if (del == true) return res.status(400).send("Blog is already deleted")
  let modified = await blogModel.findByIdAndUpdate({ _id: blogid }, { isDeleted: true, deletedAt: Date.now() }, { new: true })
  res.status(201).send({ data: modified })
}
const deletequery = async function (req, res) {

  try {
    let requestQuery = req.query
    d = { isDeleted: true, deletedAt: Date.now() }
    let filterQuery = {isDeleted:false}
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

    let update = await blogModel.findOneAndUpdate( filterQuery , d, { new: true })
if(!update) return res.send({status:false,msg:"data is allready deleted"})
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