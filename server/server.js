"use strict";

var express = require('express');
var bobyParser = require('body-parser');
var{objectID}=require('mongodb');

var { mongoose } = require('../db/mongoose');
var { User } = require('../models/user');
var { Todo } = require('../models/todo');

var port = process.env.PORT || 3000;
var app = express();

app.use(bobyParser.json());

app.get('/', function (req, res) {
    res.send(JSON.stringify('BaseUrl',undefined,2));
  });

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

app.get('/todos/:id',(req,res)=>{
    var id=req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send(); 
    }
    Todo.findById(id).then((todo)=>{
       if(!todo){
           return res.status(404).send();
       } 
       res.send({todo});
    }).catch((err)=>{
        res.status(400).send();
    })
});
app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((todos) => {
        if (!todos) {
            return res.status(404).send();
        }
        res.send({ todos });
    }).catch((err) => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`server up on ${port}`);
});
module.exports = { app }