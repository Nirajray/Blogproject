const blogModel = require("../model/blogModel");

const jwt = require("jsonwebtoken")

const authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) return res.status(401).send({ status: false, msg: "token must be present" });
        let decodedToken = jwt.verify(token, "functionup-thorium");
        if (!decodedToken)
            return res.status(401).send({ status: false, msg: "token is invalid" });
        next()
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }


}

const authorisation = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        let decodedToken = jwt.verify(token, "functionup-thorium");
        if (!decodedToken)
            return res.status(401).send({ status: false, msg: "token is invalid" });
        if (req.params.blogId) {
            let blog_id = req.params.blogId
            if (!blog_id) return res.status(400).send({ status: false, msg: "please provide id of blog" })
         
            let model = await blogModel.findById(blog_id)
            let authorId = model.author_id
            let authorLoggedIn = decodedToken.authorId
            if (authorId != authorLoggedIn) return res.status(403).send({ status: false, msg: 'author logged is not allowed to modify the requested users data' })
        }
        else {
            let value = req.query
            let b = { isDeleted: false }
            let update = await blogModel.find(value, b);
            if (update.length == 0) {
                return res.status(404).send({ status: false, msg: "blog not found" });
            }
            for (let i = 0; i < update.length; i++) {
                if (update[i].author_id != decodedToken.authorId) {
                    return res.status(403).send({ status: false, msg: 'author logged is not allowed to modify the requested authors data' })

                }
            }
        }
        next()

    }

    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }

}


module.exports.authentication = authentication
module.exports.authorisation = authorisation