const authorModel = require("../model/authorModel")
const blogModel = require("../model/blogModel")
const moment = require("moment")


let blog = async function (req, res) {
    try {
        let data = req.body;
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
        if(modelid==null)return res.status(400).send("No blog  exist with this author id")
        let id = modelid._id;
        if (!(id == authorid)) return res.status(400).send("Please enter a avlid autherId")
        data.publishedAt = Date.now()
        let saved = await blogModel.create(data);
        res.status(201).send({ data: saved });
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
        res.status(200).send({ data: filter })
    }
    catch (err) {
        res.status(500).send(err.message)
    }
};
let updateblog = async function (req, res) {
    try {
        let blogid = req.params.blogId;
        let data = req.query;
        let publishedAt = req.body.date;
        if (!blogid) return res.status(400).send("Please enter your id");
        if (!publishedAt) publishedAt = Date.now();
        let blog = await blogModel.findById(blogid);
        if (!blog) return res.status(400).send("No Such blog exist");
        let update=await blogModel.findByIdAndUpdate({_id:blogid},{$set:{data,publishedAt:publishedAt}},{new:true});
        res.status(200).send({data:update})



    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

let deleted = async function (req, res) {
    let blogid = req.params.blogId;
    if (!blogid) return res.status(400).send("Please enter Blog id")
    let modelid = await blogModel.findById({ _id: blogid })
    if (!modelid) return res.status(404).send("id Not found")
    let del = modelid.isDeleted;
    let len = del.length
    if (len == 0) return res.status(400).send("Blog not found")
    if (del == true) return res.status(400).send("Blog is already deleted")
    let modified = await blogModel.findByIdAndUpdate({ _id: blogid }, { isDeleted: true }, { new: true })
    res.status(201).send({ data: modified })
}
let deletequery = async function (req, res) {
    try {
        let data = req.query;
        if (data.length != 0) return res.status(400).send("Please enter data")
        let deletedata = await blogModel.find(data)
        if (!deletedata) return res.status(404).send("Such Blog not found")
        let del = deletedata.isDeleted;
        if (!del) return res.status(400).send("Blog is Allready deleted")
        let update=await blogModel.find(data,{isDeleted:true},{new:true})
        res.status(201).send(update)
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}
module.exports.updateblog=updateblog;
//module.exports.Author = Author;
module.exports.blog = blog;
module.exports.getblog = getblog;
module.exports.deleted = deleted;
module.exports.deletequery = deletequery;