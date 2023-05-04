/* eslint-disable no-useless-catch */
const express = require("express");
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const { createUser, getUser, getUserByUsername, getUserById, getAllUsers } = require('../db')

const {
    UserTakenError,
    PasswordTooShortError,
} = require("../errors");

// POST /api/users/register
usersRouter.post('/register', async (req, res, next) => {
    const {username, password} = req.body;
    //password must be longer than 7 characters, at least 8.
    try {
        const _user = await getUserByUsername(username);

        if(_user) {
            next({
                message: UserTakenError(username),
                error: "User already exists!",
                name: username
            });
        };

        if(password.length < 8) {
            next({
                error: "Password Too Short!",
                message: PasswordTooShortError(),
                name: "string"
            })
        };

        const user = await createUser({username, password});

        const token = jwt.sign({id: user.id, username}, 
            process.env.JWT_SECRET, { expiresIn: '2w' });

        res.send({
            message: "User has been registered",
            token: token,
            user: {username,
            id: user.id}

        });

    } catch(error) {
        next(error)
    }
});
// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = usersRouter;
