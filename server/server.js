var express = require('express');
var bobyParser = require('body-parser');

var { mongoose } = require('../db/mongoose');
var { User } = require('../models/user');
var { Todo } = require('../models/todo');

var port = process.env.PORT || 3000;
var app = express();

app.use(bobyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text,
    });
    todo.save().then((result) => {
        res.send(result);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos });
    }, (err) => {
        res.status(400).send(err);
    });
});

app.listen(port, () => {
    console.log(`server up on ${port}`);
});
module.exports = { app }