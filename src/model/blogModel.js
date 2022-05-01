const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const blogSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim:true
    },
    body: {
        type: String,
        required: true,
        trim:true
    },
    author_id: {
        type: ObjectId,
        required: true,
        ref: 'Authorpro'
    },
    tags: [String],
    category: {
        type: String,
        required: true,
        trim:true
    },

    //examples: [technology, entertainment, life style, food, fashion], 
    subcategory: [String],
    //examples[technology-[web development, mobile development, AI, ML etc]] },


    deletedAt: {
        type: Date,
        default: null,
    },
    isDeleted: {
        type: Boolean, default: false
    },
    publishedAt: {
        type: Date,
        default: null,

    },
    isPublished: {
        type: Boolean, default: false
    }
}
    , { timestamps: true })

module.exports = mongoose.model('BlogPro', blogSchema)