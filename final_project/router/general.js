const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(!username || !password){
    return res.status(400).json({message: "Username and password are required"});
  }
  if(users.find(u => u.username === username)){
    return res.status(400).json({message: "User already exists"});
  }
  users.push({username, password});
  return res.status(200).json({message: "User successfully registered. Now you can login"});
});

// Get the book list available in the shop using Axios with async/await
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get(`${BASE_URL}/allbooks`);
    return res.status(200).json(response.data);
  } catch(err) {
    if(err.response && err.response.status === 404){
      return res.status(404).json({message: "No books found"});
    }
    return res.status(500).json({message: "Error retrieving books"});
  }
});

// Get book details based on ISBN using Axios with promise callbacks
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`${BASE_URL}/allbooks`)
    .then(response => {
      const book = response.data[isbn];
      if(book){
        return res.status(200).json(book);
      } else {
        return res.status(404).json({message: "Book not found"});
      }
    })
    .catch(err => {
      return res.status(500).json({message: "Error retrieving book by ISBN"});
    });
});

// Get book details based on author using Axios with promise callbacks
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  axios.get(`${BASE_URL}/allbooks`)
    .then(response => {
      const booksByAuthor = Object.values(response.data).filter(book => book.author === author);
      if(booksByAuthor.length > 0){
        return res.status(200).json(booksByAuthor);
      } else {
        return res.status(404).json({message: "No books found for this author"});
      }
    })
    .catch(err => {
      return res.status(500).json({message: "Error retrieving books by author"});
    });
});

// Get all books based on title using Axios with promise callbacks
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  axios.get(`${BASE_URL}/allbooks`)
    .then(response => {
      const booksByTitle = Object.values(response.data).filter(book => book.title === title);
      if(booksByTitle.length > 0){
        return res.status(200).json(booksByTitle);
      } else {
        return res.status(404).json({message: "No books found for this title"});
      }
    })
    .catch(err => {
      return res.status(500).json({message: "Error retrieving books by title"});
    });
});

// Get book review
public_users.get('/review/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if(!book) return res.status(404).json({message: "Book not found"});
    return res.status(200).json(book.reviews);
  } catch(err) {
    return res.status(500).json({message: "Error retrieving review"});
  }
});

// Internal route to get all books
public_users.get('/allbooks', function (req, res) {
  if(books){
    return res.status(200).json(books);
  } else {
    return res.status(404).json({message: "No books found"});
  }
});

module.exports.general = public_users;
