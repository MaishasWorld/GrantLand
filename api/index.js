const express = require('express');
const router = express.Router();
const { UnauthorizedError } = require("../errors");
const { getUserById } = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// GET /api/health
router.get('/health', async (req, res, next) => {
    try {
        const uptime = process.uptime();
    
        const {
          rows: [dbConnection],
        } = await client.query(`
        SELECT NOW();
        `);
    
        const currentTime = new Date();
    
        const lastRestart = new Intl.DateTimeFormat('en', {
          timestyle: 'long',
          dateStyle: 'long',
          timeZone: 'America/New_York',
        }).format(currentTime - uptime * 1000);
    
        res.send({
          message: 'The api is healthy',
          uptime,
          dbConnection,
          currentTime,
          lastRestart,
        });
      } catch (error) {
        next(error);
      }
});

//Auth Middleware
router.use(async (req, res, next) => {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');

    if (!auth) {
        next();
    } else if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length);
    
      try {
         const { id } = jwt.verify(token, JWT_SECRET);

         if (id) {
            const user = await getUserById(id);
            if(user){
              req.user = user
            }
            
            next();
          }
      } catch (error) {
            next(error);
      }
    } else {
        next({
            name: 'AuthorizationHeaderError',
            message: `Authorization token must start with ${ prefix }`
          });
    }
})

// ROUTER: /api/users
const usersRouter = require('./users');
router.use('/users', usersRouter);

// ROUTER: /api/activities
const activitiesRouter = require('./activities');
router.use('/activities', activitiesRouter);

// ROUTER: /api/routines
const routinesRouter = require('./routines');
router.use('/routines', routinesRouter);

// ROUTER: /api/routine_activities
const routineActivitiesRouter = require('./routineActivities');
router.use('/routine_activities', routineActivitiesRouter);

module.exports = router;
