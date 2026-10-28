const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

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

// Get the book list available in the shop using Axios
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    if(books) resolve(books);
    else reject({status: 404, message: "No books found"});
  })
  .then(response => res.status(200).json(response))
  .catch(err => res.status(err.status || 500).json({message: err.message || "Error retrieving books"}));
});

// Get book details based on ISBN using Axios
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    const book = books[isbn];
    if(book) resolve(book);
    else reject({status: 404, message: "Book not found"});
  })
  .then(response => res.status(200).json(response))
  .catch(err => res.status(err.status || 500).json({message: err.message || "Error retrieving book"}));
});

// Get book details based on author using Axios
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  new Promise((resolve, reject) => {
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
    if(booksByAuthor.length > 0) resolve(booksByAuthor);
    else reject({status: 404, message: "No books found for this author"});
  })
  .then(response => res.status(200).json(response))
  .catch(err => res.status(err.status || 500).json({message: err.message || "Error retrieving books by author"}));
});

// Get all books based on title using Axios
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    const booksByTitle = Object.values(books).filter(book => book.title === title);
    if(booksByTitle.length > 0) resolve(booksByTitle);
    else reject({status: 404, message: "No books found for this title"});
  })
  .then(response => res.status(200).json(response))
  .catch(err => res.status(err.status || 500).json({message: err.message || "Error retrieving books by title"}));
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

module.exports.general = public_users;
