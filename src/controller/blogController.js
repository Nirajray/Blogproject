const blogModel = require("../models/blogModel")

const createBlog = async function (req, res){
    let details= req.body
    if(authorId){
    saved= await blogModel.create(details)
    res.send({data:saved})
    }
    else{
        res.send({msg:"enter a valid authorId"})
    }

}

const getBlogs= async function (req, res){
try {

            let id = req.query.author_Id
            let category = req.query.category
            let tag = req.query.tags
            let sub = req.query.subCategory
            let blogList = await blogModel.find({ isDeleted: false, isPublished: true })
            if (!blogList.length) 
            { res.status(404).send({ status: false, msg: "blogs Missing!" }) 
        
            }    
            else {
                let allList = await blogModel.find({ $or: [{ author_Id: id }, { category: category }, { tags: tag }, { subCategory: sub }] })
                if (!allList.length) {
                    res.status(404).send({ status: false, msg: "blogs Missing" })
                }
        
                else { res.status(200).send({ status: true, data: allList }) }
            }
        }
        
            catch(error){
                res.status(500).send({msg: "Error", error: error.message})
              }
}
        
        const updateDetails= async function (req, res){
            let tags = req.body.tag
            let bodi= req.body.body
            
        


module.exports.createBlog= createBlog
module.exports.getBlogs= getBlogs


changing the its title, body, adding tags, adding a subcategory. (Assuming tag and subcategory received in body is need to be added)