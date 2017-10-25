"use strict";

const express = require('express');
const bobyParser = require('body-parser');
const { objectID } = require('mongodb');
const _ = require('lodash');
const fs = require('fs');

var { mongoose } = require('../db/mongoose');
var { User } = require('../models/user');
var { Todo } = require('../models/todo');
var { authenticate } = require('../middleware/authenticate');

var port = process.env.PORT || 3000;
var app = express();

app.use(bobyParser.json());

app.use((req, res, next) => {
    var now = new Date().toDateString();
    var log = `${now}:${req.method}${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('unable to write');
        }
    });
    next();
});
app.get('/', function (req, res) {
    res.send(JSON.stringify('BaseUrl', undefined, 2));
});

app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });
    todo.save().then((result) => {
        res.send({ result: result, success: true, msg: 'Todos Created' });
    }, (err) => {
        res.status(400).send({ msg: 'Something went wrong', error: err });
    });
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({ todos: todos, success: true });
    }, (err) => {
        res.status(400).send({ msg: 'Something went wrong', error: err });
    });
});

app.get('/todos/:id',authenticate, (req, res) => {
    var id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send({ success: false, msg: 'Todos not found' });
    }
    Todo.findOne({
        _id:id,
        _creator:req.user._id
        }).then((todo) => {
        if (!todo) {
            return res.status(404).send({ success: false, msg: 'Todos not found' });
        }
        res.send({ todo, success: true, msg: 'Todos found' });
    }).catch((err) => {
        res.status(400).send({ success: false, msg: 'Bad Request', error: err });
    })
});
app.delete('/todos/:id',authenticate, (req, res) => {
    var id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send({ success: false, msg: 'Todos not found' });
    }
    Todo.findOneAndRemove({
        _id:id,
        _creator:req.user._id
    }).then((todos) => {
        if (!todos) {
            return res.status(404).send({ success: false, msg: 'Todos not found' });
        }
        res.send({ todos, msg: 'Delete sucessfully' });
    }).catch((err) => {
        res.status(400).send({ success: false, msg: 'Bad Request', error: err });
    });
});
app.patch('/todos/:id',authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send({ success: false, msg: 'Todos not found' });
    }
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findOneAndUpdate({_id:id,_creator:req.user._id}, { $set: body }, { new: true }).then((todo) => {
        if (!todo) {
            res.status(404).send({ success: false, msg: 'Todos not found' });
        }
        res.send({ todo: todo, success: true, msg: 'update sucessfully' });
    }).catch((err) => {
        res.status(400).send({ success: false, msg: 'Bad request', error: err });
    });
});
app.post('/user', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send({ user, success: true, msg: 'user Created' })
    }).catch((e) => {
        res.status(400).send({ success: false, msg: 'Something went wrong', error: e })
    })
});

app.post('/user/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send({ user, msg: 'login Sucessfully', success: true })
        });
    }, (err) => {
        res.status(400).send({ success: false, msg: 'Invalid credentails', error: err })
    });
});

app.delete('/user/logout', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send({ msg: 'logout Sucessfully', success: true });
    }, (err) => {
        res.status(400).send({ msg: 'something went wrong', success: false, error: err });
    });
});

app.listen(port, () => {
    console.log(`server up on ${port}`);
});
module.exports = { app }