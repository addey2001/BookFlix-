import express from "express";
import Book from "../models/books.js";
import verifyToken from "../middleware/verifyToken.js";
import { isObjectIdOrHexString } from "mongoose";

//custom errors
import { NotFound, Forbidden } from "../utils/errors.js";

const router = express.Router();

const seriesRecommendations = {
    fantasy: {
        series: "Harry Potter",
        author: 'j.k. rowling',
        books: [
            'title: Harry Potter and the Philosophers Stone  release year: 1997',
            'title: Harry Potter and the Chamber of Secrets  release year: 1998',
            'title: Harry Potter and the Prisoner of Azkaban  release year: 1999',
            'title: Harry Potter and the Goblet of Fire  release year: 2000',
            'title: Harry Potter and the Order of the Phoenix  release year: 2003',
            'title: Harry Potter and the Half-Blood Prince  release year: 2005',
            'title: Harry Potter and the Deathly Hallows  release year: 2007'
        ]
    },
    lordOfTheRings: {
        series: "The Lord of the Rings",
        author: 'j.r.r. tolkien',
        books: [
            'title: The Fellowship of the Ring  release year: 1954',
            'title: The Two Towers  release year: 1954',
            'title: The Return of the King  release year: 1955'
        ]
    },
    gameOfThrones: {
        series: "A Song of Ice and Fire",
        author: 'george r.r. martin',
        books: [
            'title: A Game of Thrones  release year: 1996',
            'title: A Clash of Kings  release year: 1998',
            'title: A Storm of Swords  release year: 2000',
            'title: A Feast for Crows  release year: 2005',
            'title: A Dance with Dragons  release year: 2011'
        ]
    },
    narnia: {
        series: "The Chronicles of Narnia",
        author: 'c.s. lewis',
        books: [
            'title: The Lion, the Witch and the Wardrobe  release year: 1950',
            'title: Prince Caspian  release year: 1951',
            'title: The Voyage of the Dawn Treader  release year: 1952',
            'title: The Silver Chair  release year: 1953',
            'title: The Horse and His Boy  release year: 1954',
            'title: The Magicians Nephew  release year: 1955',
            'title: The Last Battle  release year: 1956'
        ]
    }
}
//controllers
router.get('/recommendations/:recommendationName', verifyToken, (req, res) => {
    const { recommendationName } = req.params;
    console.log(seriesRecommendations[recommendationName]);

    if (seriesRecommendations[recommendationName]) {
        return res.json(seriesRecommendations[recommendationName]);
    } else {
        return res.status(404).json({ message: 'Recommendation not found' });
    }
});

// Create a new book
router.post('', verifyToken, async (req, res, next) => {
    try {
        req.body.user = req.user._id;
        const book = await Book.create(req.body);
        return res.status(201).json(book);
    } catch (error) {
        next(error);
    }
});

//index
router.get('', verifyToken, async (req, res, next) => {
    try {
        const books = await Book.find();
        return res.json(books);
    } catch (error) {
        next(error);
    }
});


//show
router.get('/:bookId', verifyToken, async (req, res, next) => {
    try {

        const { bookId } = req.params;
        const showBook = await Book.findById(bookId);
        if (!showBook) {
            throw new NotFound('Book not found');
        }

        return res.json(showBook);
    } catch (error) {
        next(error);
    }
});


// Update book
router.put('/:bookId', verifyToken, async (req, res, next) => {
    try {
        const { bookId } = req.params;
        const showBook = await Book.findById(bookId);
        if (!showBook) {
            throw new NotFound('Book not found');
        }

        if (!showBook.user.equals(req.user._id))
            throw new Forbidden()
        const updatedBook = await Book.findByIdAndUpdate(
            bookId,
            req.body, {
            returnDocument: 'after',
        }
        );


        return res.json(updatedBook);
    } catch (error) {
        next(error);
    }
}
);
//favorited 
router.post('/:bookId/favorite', verifyToken, async (req, res, next) => {
    try {
        const { bookId } = req.params;
        const showBook = await Book.findById(bookId);
        if (!showBook) {
            throw new NotFound('Book not found');
        }
        if (!showBook.user.equals(req.user._id))
            throw new Forbidden()
        console.log(showBook)
        const updatedBook = await Book.findByIdAndUpdate(
            bookId, 
            { $push: { favoritedBy: req.user._id } },
            { new: true }
        );

        return res.json( updatedBook);
    }catch (error) {
        next(error);
    }
}
)

// Delete book
router.delete('/:bookId', verifyToken, async (req, res, next) => {
    try {
      const { bookId } = req.params;
        const showBook = await Book.findById(bookId);
        if (!showBook) {
            throw new NotFound('Book not found');
        }
      
        if (!showBook.user.equals(req.user._id))
            throw new Forbidden()

        await Book.findByIdAndDelete(bookId);

        return res.sendStatus(204)
    } catch (error) {
        next(error);
    }
});

export default router;