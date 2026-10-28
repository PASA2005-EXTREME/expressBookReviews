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

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const response = await new Promise((resolve, reject) => {
      resolve(books);
    });
    return res.status(200).json(response);
  } catch(err) {
    return res.status(500).json({message: err.message});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
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
  axios.get('http://localhost:3000/books')
    .then(response => res.status(200).json(response.data))
    .catch(() => res.status(200).json(books));
});

// Get book details based on ISBN using Axios
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`http://localhost:3000/books/${isbn}`)
    .then(response => res.status(200).json(response.data))
    .catch(() => res.status(200).json(books[isbn]));
});

// Get book details based on author using Axios
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  axios.get(`http://localhost:3000/books/author/${author}`)
    .then(response => res.status(200).json(response.data))
    .catch(() => {
      const booksByAuthor = Object.values(books).filter(book => book.author === author);
      res.status(200).json(booksByAuthor);
    });
});

// Get all books based on title using Axios
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  axios.get(`http://localhost:3000/books/title/${title}`)
    .then(response => res.status(200).json(response.data))
    .catch(() => {
      const booksByTitle = Object.values(books).filter(book => book.title === title);
      res.status(200).json(booksByTitle);
    });
});

// Get book review
public_users.get('/review/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await new Promise((resolve, reject) => {
      const book = books[isbn];
      if(book) resolve(book.reviews);
      else reject("Book not found");
    });
    return res.status(200).json(response);
  } catch(err) {
    return res.status(404).json({message: err});
  }
});

module.exports.general = public_users;
