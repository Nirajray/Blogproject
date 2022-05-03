const authorModel = require("../model/authorModel")
const blogModel = require("../model/blogModel")
const mongoose = require("mongoose")


//1================================================================
let blog = async function (req, res) {
  try {
    let getData = req.body;
    if (Object.keys(getData).length != 0) {
      let title = req.body.title;
      let body = req.body.body;
      let authorid = req.body.author_id;
      let tags = req.body.tags;
      let category = req.body.category;
      let subcategory = req.body.subcategory;
      if (!title) return res.status(400).send({status:false,msg:"Please Enter title"});
      if (!body) return res.status(400).send({status:false,msg:"Please Details about your Blog"});
      if (!tags) return res.status(400).send({status:false, msg:"Please Enter Your Tags"});
      if (!category) return res.status(400).send({status:false, msg:"Please Enter Your Blog category"});
      if (!subcategory) return res.status(400).send({status:false,msg:"Please Enter Your Blog's subcategory"});
      if (!authorid) return res.status(400).send({status:false, msg:"Please Enter Author id"});
     
      let author = await authorModel.findOne({ _id: authorid });
      if (!author) return res.status(400).send({status:false,msg:"author is not present"})
      if (getData.isPublished == true) {
        getData.publishedAt = Date.now()
        let saved = await blogModel.create(getData);
        return res.status(201).send({ status:true, data: saved });

      }
      else {
        let saved = await blogModel.create(getData);
        return res.status(201).send({status:true, data: saved });
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
    if (!value) return res.status(400).send({status:false, msg:"Please Enter data"})
    let filter = await blogModel.find({ $and: [value, { isDeleted: false, isPublished: true }] })
    if (filter.length == 0) return res.status(404).send({status:false, msg:"Record Not found" })
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
      let blog = await blogModel.findOne({ _id: blogid, isDeleted: false });
      if (!blog) return res.status(404).send({status:false,msg:"No Such blog exist"});
  let a=req.body.title
  let b= req.body.category
  let c= req.body.body
  let d=true
  let e= Date.now()
  let f=req.body.subcategory
  let g=req.body.tags
  if(blog.isPublished==true){
    let updated= await blogModel.findOneAndUpdate({_id:blogid},{title:a,category:b,body:c,$push:{subcategory:f,tags:g}},{new:true})
    res.status(200).send({status:true, data:updated})
  }
else{
let update= await blogModel.findOneAndUpdate({_id:blogid},{title:a,category:b,body:c,isPublished:d,publishedAt:e,$push:{subcategory:f,tags:g}},{new:true})
res.status(200).send({status:true, data:update})
}

  }

  catch (err) {
    res.status(500).send(err.message)
  }
}

//4===========================================================================
let deleted = async function (req, res) {
  let blogid = req.params.blogId;
  if (!blogid) return res.status(400).send({status:false, msg:"Please enter Blog id"})
 
  let model = await blogModel.findById(blogid)
  if (!model) return res.status(404).send({status:false,msg:"blog Not found"})
  let del = model.isDeleted;
  let len = del.length
  if (len == 0) return res.status(404).send({status:false, msg:"Not found"})
  if (del == true) return res.status(400).send({status:false, msg:"Blog is already deleted"})
  let modified = await blogModel.findOneAndUpdate({ _id: blogid }, { isDeleted: true, deletedAt: Date.now() }, { new: true })
  res.status(200).send({ status:true, data: modified })
}

//5=============================================================================
const deletequery = async function (req, res) {

  try {
    let requestQuery = req.query
    d = { isDeleted: true, deletedAt: Date.now()}
    let filterQuery = { isDeleted:false }
    const{ author_id, subcategory, tags, category, isPublished } = requestQuery
    if ("author_id" in requestQuery) {
      filterQuery["author_id"] = author_id
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
    let blog = await blogModel.findOne( filterQuery ) 
    if (!blog) return res.status(404).send({status:false,msg:"blog Not found"})
    console.log(blog)
    let updated = await blogModel.updateMany(filterQuery,d, {new: true })
    console.log(updated)
    if (!updated) return res.status(404).send({ status: false, msg: "Not found and data is allready deleted" })
    return res.status(200).send({ status: true, data: updated })

  }
  catch (error) {
    res.status(500).send({ msg: "Error", error: error.message })
  }
}
module.exports.updateblog = updateblog;
module.exports.blog = blog;
module.exports.getblog = getblog;
module.exports.deleted = deleted;
module.exports.deletequery = deletequery;