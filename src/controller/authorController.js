const authorModel = require("../model/authorModel")
const jwt = require("jsonwebtoken")
let Author = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(getData).length != 0) return res.status(400).send({status:false, msg:"Please Enter Data"})
        let fname = req.body.fname;
        let lname = req.body.lname;
        let title = req.body.title;
        let mail = req.body.email;
        let pass = req.body.password;
        let regx = /^([a-zA-Z0-9\._]+)@([a-zA-Z0-9]+.)([a-z]+)(.[a-z])?$/
        if (!fname) return res.status(400).send({status:false,msg:"Please Enter your First Name"});
        if (!lname) return res.status(400).send({status:false,msg:"Please Enter your Last Name"});
        if (!title) return res.status(400).send({status:false,msg:"Please Enter your title"});
        if (!mail) return res.status(400).send({status:false,msg:"Please Enter your Email"});
        if (!regx.test(mail)) return res.status(400).send({status:false,msg:"Please Enter a valid EmailId"});
        let uniqueEmail= await authorModel.findOne({email:mail})
        if(uniqueEmail) return res.status(400).send({status:false, msg:"emailid already exist"})
        if (!pass) return res.status(400).send({status:false, msg:"Please Enter your Password"});
        let saved = await authorModel.create(data);
        res.status(201).send({status:true, data: saved })
    }
    catch (err) {
        res.status(500).send({ Error: err.message })
    }
};

const loginAuthor = async function (req,res) {
    let authorName= req.body.email;
    let password =  req.body.password;

    let author= await authorModel.findOne({ email: authorName, password: password });
    console.log(author)
    
    if (!author)
    return res.status(401).send({ status : false, msg : "emailId and the password is not correct"})


let token = jwt.sign(
    {
      authorId: author._id.toString(), 
      batch: "radium",
      organisation: "FunctionUp",
    },
    "functionup-thorium"
  );
 console.log(token)
res.setHeader("x-api-key",token);
res.status(200).send({status:true, msg: "login succesfully", data:token});
}

module.exports.Author = Author
module.exports.loginAuthor=loginAuthor