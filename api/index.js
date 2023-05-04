const express = require('express');
const router = express.Router();

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
