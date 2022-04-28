const authorModel = require("../model/authorModel")

let Author = async function (req, res) {
    try {
        let data = req.body
        let fname = req.body.fname;
        let lname = req.body.lname;
        let title = req.body.title;
        let mail = req.body.email;
        let pass = req.body.password;
        let regx = /^([a-zA-Z0-9\._]+)@([a-zA-Z0-9]+.)([a-z]+)(.[a-z])?$/
        // if (data.length != 0) return res.status(400).send("Please Enter Data")
        if (!fname) return res.status(400).send("Please Enter your First Name");
        if (!lname) return res.status(400).send("Please Enter your Last Name");
        if (!title) return res.status(400).send("Please Enter your title");
        if (!mail) return res.status(400).send("Please Enter your Email");
        if (!regx.test(mail)) return res.status(400).send("Please Enter a valid EmailId");
        if (!pass) return res.status(400).send("Please Enter your Password");
        // let passcheck = pass.length;
        // if (!(passcheck >= 8 && passcheck <= 20)) return res.status(400).send("Please Enter a valid Password");
        let saved = await authorModel.create(data);
        res.status(201).send({ data: saved })
    }
    catch (err) {
        res.status(500).send({ Error: err.message })
    }
};

module.exports.Author = Author;