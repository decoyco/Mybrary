const mongoose = require('mongoose')
const coverImageBasePath = 'uploads/bookCovers'
const path = require('path')

const bookSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },

    publishDate:{
        type: Date,
        required: true
    },

    pageCount:{
        type: Number,
        required: true
    },

    createdAt:{
        type: Date,
        requred: true,
        default: Date.now
    },

    coverImageName:{
        type: String,
        required: true
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    },

    description: {
        type: String,
        required: false
    }
})

bookSchema.virtual('coverImagePath').get(function() {
    if(this.coverImageName != null) {
        return path.join('/', coverImageBasePath, this.coverImageName)
    }
})

module.exports = mongoose.model('Book', bookSchema)
module.exports.coverImageBasePath = coverImageBasePath