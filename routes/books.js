const express = require('express')
const router = express.Router()
const Book = require('../models/book.js')
const Author = require('../models/author.js')
//const multer = require('multer')
// const path = require('path')
// const fs = require('fs')
//const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
// const upload = multer({
//     dest: uploadPath,
//     fileFilter: (req, file, callback) => {
//         callback(null, imageMimeTypes.includes(file.mimetype))
//     }
// })

//All books route
router.get('/', async (req,res) => 
{
    let query = Book.find({})
    if(req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    try{
        const books = await query.exec()
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        })
    }catch{
        res.redirect('/')
    }
    
})

//New books route
router.get('/new', async (req,res) => 
{
    renderNewPage(res, new Book())
})

//Create Book Route
router.post('/', async (req,res) => 
{
    //const fileName = req.file != null ? req.file.filename : null
    const book = new Book(
    {
        title: req.body.title,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        //coverImageName: fileName,
        author: req.body.author,
        description: req.body.description
    })
    saveCover(book, req.body.coverImage)
    try
    {
        const newBook = await book.save()
        //res.redirect(`books/${newBook.id}`)
        res.redirect(`/books`)
    }
    catch(err)
    {
         console.log(err)
        // if(book.coverImageName != null) {
        //     removeBookCover(book.coverImageName)
        // }
        
        renderNewPage(res, book, true)
    }
})

router.get('/:id', async (req,res) => {
    try
    {
        const book = await Book.findById(req.params.id)
        const author = await Author.findById(book.author)
        res.render('books/show', 
        {
            book: book,
            author: author
        })
    }
    catch(e)
    {
        console.log(e)
        res.redirect('/books')
    }
})

router.get('/:id/edit', async (req,res) => {
    try
    {
        const book = await Book.findById(req.params.id)
        const authors = await Author.find({})
        res.render('books/edit.ejs', 
        {
            book: book,
            authors: authors
        })
    }
    catch(e)
    {
        console.log(e)
        res.redirect('/books')
    }
})

router.put('/:id', async (req,res) => {
        try
        {
            const book = await Book.findById(req.params.id)
            book.title = req.body.title
            book.publishDate = new Date(req.body.publishDate)
            book.pageCount = req.body.pageCount
            author = req.body.author
            description = req.body.description
            saveCover(book, req.body.coverImage)
            await book.save()
            res.redirect(`/books/${book.id}`)
        }
        catch(err)
        {
             console.log(err)
            // if(book.coverImageName != null) {
            //     removeBookCover(book.coverImageName)
            // }
            
            renderNewPage(res, book, true)
        }
})

router.delete('/:id', async (req,res) => {
    try
    {
        const book = await Book.findById(req.params.id)
        await book.remove()
        res.redirect('/books')
    }
    catch(e)
    {
        console.log(e)
        res.redirect('/books')
    }
})


function saveCover(book, coverEncoded) {
    if(coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if(cover != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
}

// function removeBookCover(fileName) {
//     fs.unlink(path.join(uploadPath, fileName), err => {
//         if (err) console.error(err)
//     })
// }

async function renderNewPage(res, book, hasError = false) {
    try
    {
        const authors = await Author.find({})
        const book = new Book()
        const params = {
            book: book,
            authors: authors,
        }
        if(hasError) params.errorMessage = 'Error Creating Book'
        res.render('books/new', params)
    }
    catch
    {
        res.redirect('/books')
    }
}

module.exports = router
