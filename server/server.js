"use strict";

const express = require('express');
const bobyParser = require('body-parser');
const { objectID } = require('mongodb');
const _ = require('lodash');
const fs = require('fs');
const multer = require('multer');

var { mongoose } = require('../db/mongoose');
var { User } = require('../models/user');
var { Todo } = require('../models/todo');
var { authenticate } = require('../middleware/authenticate');
const config = require('./config/config');

var port = config.PORT;
var app = express();

app.use(bobyParser.json());

//file upload using multer
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        if (!file.originalname.match(/\.(jpg|png|JPEG)$/)) {
            var err = new Error();
            err.code = 'filetype';
            return callback(err);
        } else {
            callback(null, Date.now() + file.originalname);
        }

    }
});
var upload = multer({ storage: storage, limits: { fileSize: 1000000 } }).single('userImage');

app.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.send({ success: false, msg: 'limit file size 1MB ' })
            } else if (err.code === 'filetype') {
                return res.send({ success: false, msg: 'Must be valid file extension only jpg or png' })
            } else {
                return res.send({ success: false, msg: 'something went wrong' })
            }
        } else {
            if (!req.file) {
                res.send({ success: false, msg: 'No file selected' })
            } else {
                var response = req.file;
                var getFileName = response.filename;
                res.send({ success: true, msg: 'image uploaded', getFileName });
            }

        }

    });
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
    }).catch((err) => {
        res.status(400).send({ msg: 'Something went wrong', error: err });
    });
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({_creator: req.user._id}).then((todos) => {
        res.send({ todos: todos, success: true });
    }).catch((err) => {
        res.status(400).send({ msg: 'Something went wrong', error: err });
    });
});

app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send({ success: false, msg: 'Todos not found' });
    }
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send({ success: false, msg: 'Todos not found' });
        }
        res.send({ todo, success: true, msg: 'Todos found' });
    }).catch((err) => {
        res.status(400).send({ success: false, msg: 'Bad Request', error: err });
    })
});
app.delete('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send({ success: false, msg: 'Todos not found' });
    }
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todos) => {
        if (!todos) {
            return res.status(404).send({ success: false, msg: 'Todos not found' });
        }
        res.send({ todos, msg: 'Delete sucessfully' });
    }).catch((err) => {
        res.status(400).send({ success: false, msg: 'Bad Request', error: err });
    });
});
app.patch('/todos/:id', authenticate, (req, res) => {
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
    Todo.findOneAndUpdate({ _id: id, _creator: req.user._id }, { $set: body }, { new: true }).then((todo) => {
        if (!todo) {
            res.status(404).send({ success: false, msg: 'Todos not found' });
        }
        res.send({ todo: todo, success: true, msg: 'update sucessfully' });
    }).catch((err) => {
        res.status(400).send({ success: false, msg: 'Bad request', error: err });
    });
});
app.post('/user', (req, res) => {
    var body = _.pick(req.body, ['name', 'mobile', 'email', 'password']);
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
    }).catch((err) => {
        res.status(400).send({ success: false, msg: 'Invalid credentails', error: err })
    });
});

app.get('/profile', authenticate, (req, res) => {
    User.findOne({
        _id: req.user._id
    }).then((user) => {
        res.send({ user: user, success: true });
    }).catch((err) => {
        res.status(400).send({ msg: 'Something went wrong', error: err });
    });

});
app.patch('/updateProfile', authenticate, (req, res) => {
    upload(req, res, function (err) {
        var body = _.pick(req.body, ['name', 'email', 'mobile','imageUrl']);
        
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.send({ success: false, msg: 'limit file size 1MB ' })
            } else if (err.code === 'filetype') {
                return res.send({ success: false, msg: 'Must be valid file extension only jpg or png' })
            } else {
                return res.send({ success: false, msg: 'something went wrong' })
            }
        }
        else{
            console.log(body)
            body.imageUrl=req.file.filename;
            console.log('---',body)
            User.findOneAndUpdate({ _id: req.user._id }, { $set: body }, { new: true }).then((user) => {
                if (!req.file) {
                   return res.send({ success: false, msg: 'No file selected' })
                }
                if (!user) {
                    res.status(404).send({ success: false, msg: 'user not found' })
                }else{
                    
                   // console.log(body);
                    res.send({ sucess: true, msg: 'update sucessfully', user })
                }
            }).catch((err) => {
                res.send({ success: false, msg: 'something wrong', error: err });
            });
        }

    });
});
app.delete('/user/logout', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send({ msg: 'logout Sucessfully', success: true });
    }).catch((err) => {
        res.status(400).send({ msg: 'something went wrong', success: false, error: err });
    });
});

app.listen(port, () => {
    console.log(app.get('env'));
    console.log(`server up on ${port}`);
});
module.exports = { app }