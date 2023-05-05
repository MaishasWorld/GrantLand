/* eslint-disable no-useless-catch */
const express = require("express");
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const { createUser, getUser, getUserByUsername, getAllRoutinesByUser, getPublicRoutinesByUser } = require('../db')
const { requireUser } = require('./utils');
const {
    UserTakenError,
    PasswordTooShortError,
} = require("../errors");

// POST /api/users/register
usersRouter.post('/register', async (req, res, next) => {
    try {
    const {username, password} = req.body;
     
    if(password.length < 8) {
    next({
    error: "Password Too Short!",
    message: PasswordTooShortError(),
    name: "string"
})
     }
    //password must be longer than 7 characters, at least 8.
        const _user = await getUserByUsername(username);
        console.log(_user);
        if(_user) {
            console.log("hello");
            // res.status(401)
            next({
                message: UserTakenError (username),
                error: "User already exists!",
                name: username
        });
        } else {

        const user = await createUser({username, password});

        const token = jwt.sign({id: user.id, username}, 
            process.env.JWT_SECRET, { expiresIn: '2w' });

        res.send({
            message: "User has been registered",
            token: token,
            user: {username: user.username,
            id: user.id}

        });
    }
    } catch(error) {
        next (error)

    }
});


// POST /api/users/login
usersRouter.post('/login', async (req, res, next) => {
    const {  username, password } = req.body;
    
    if (!username || !password){
        next ({
            name: "CredentialsAreMissing",
            message: "Both username and password are needed."
        })
    }
   try {
        const user = await getUser({username, password});
        const token = jwt.sign(user, JWT_SECRET, { expiresIn: '2w' });
        
        res.send({ message: "you're logged in!", token: token, user: user});
                        
      } catch(error){

        next(error);
      }
    });


// GET /api/users/me
usersRouter.get('/me', requireUser, async (req, res, next) => {
    try {
        res.send(req.user);
    } catch (error) {
        next(error);
    }
});



// GET /api/users/:username/routines
usersRouter.get('/:username/routines', requireUser, async (req, res, next) => {
    const { username } = req.params;
    try {
        if(req.user && req.user.username === username) {
            const allRoutines = await getAllRoutinesByUser({ username })
            res.send(allRoutines);
        }

        const publicRoutines = await getPublicRoutinesByUser({ username });
        res.send(publicRoutines);
    } catch (error) {
        next(error);
    }
})
module.exports = usersRouter;
