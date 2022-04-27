const authorModel = require("../models/authorModel")

const createAuthor= async function (req, res){
let details=req.body
saved= await authorModel.create(details)
res.status(201).send({data:saved, status:true})
}


module.exports.createAuthor=createAuthor
asgbshksahfkhdnfckh