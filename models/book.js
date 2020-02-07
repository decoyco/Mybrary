const mongoose = require('mongoose')
// const coverImageBasePath = 'uploads/bookCovers'
// const path = require('path')

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

    coverImage:{
        type: Buffer,
        required: true
    },

    coverImageType: {
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
    if(this.coverImage != null && this.coverImageType != null) {
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})

module.exports = mongoose.model('Book', bookSchema)
//module.exports.coverImageBasePath = coverImageBasePath