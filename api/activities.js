const express = require('express');
const router = express.Router();
const {getAllActivities, getActivitiesByName} = require('');

// GET /api/activities/:activityId/routines

// return all activities
// create new activities 
// responds with error when activity w/ same name already exists 
// SPELL ACTIVITIES CORRECTLY!!!!!!!!!!!!!!!!

// GET /api/activities
// do I need this use before get?
activitiesRouters.use((req, res, next) => {

next();
});

activitiesRouter.get('/', async (req, res) => {
    const activity = await getAllActivities();
    res.send({ 
    activity
});
});


// POST /api/activities


activitiesRouter.get('/:activity/routines', async (req, res, next) => {
    const { activity } = req.params;
    
    try {
        const activity = await getActivitiesByName(activity);
    
    if(activity) {
    console.log(`here are routines with activites: ${activity}:`, routines[1].activity);
        res.send({
            activity
         });

    // not sure about above section
    //console log again to check

    } else {
        next({
        name: "Error creating activity",
        message: "Not able to create new activity"
  })
}
    } catch (error) {
        next(error);
    }
  });


// PATCH /api/activities/:activityId

module.exports = router;
