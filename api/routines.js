const express = require('express');
const { getAllPublicRoutines, getRoutineActivitiesByRoutine, addActivityToRoutine, createRoutine, updateRoutine, getRoutineById, destroyRoutine} = require('../db');
const routinesRouter = express.Router();
const { requireUser } = require('./utils');
const { DuplicateRoutineActivityError, UnauthorizedUpdateError, UnauthorizedDeleteError } = require('../errors')
// GET /api/routines
routinesRouter.get('/', async (req, res, next) => {
    try {
        const routines = await getAllPublicRoutines();
        res.send(routines);
    } catch (error) {
        next(error);
    }
})
// POST /api/routines
routinesRouter.post('/', requireUser, async (req, res, next) => {
    const { isPublic, name, goal } = req.body;

    try {
        if(req.user) {
        const routine = await createRoutine({ creatorId: req.user.id, isPublic, name, goal })
        res.send(routine)
        }
    } catch (error) {
        next(error);
    }
})
// PATCH /api/routines/:routineId
routinesRouter.patch('/:routineId', requireUser, async (req, res, next) => {
    const { routineId } = req.params;
    const { isPublic, name, goal } = req.body;
    let routine = await getRoutineById(routineId)
    try {
        if(req.user.id === routine.creatorId) {
            const routine = await updateRoutine({ id: routineId, goal, name, isPublic })
            res.send(routine);
        } else {
            res.status(403)
            next({
                message: UnauthorizedUpdateError(req.user.username, routine.name),
                name: 'UnauthorizedUpdateError',
                error: 'blah'
            });
        }

    } catch (error) {
        next(error)
    }
})
// DELETE /api/routines/:routineId
routinesRouter.delete('/:routineId', requireUser, async (req, res, next) => {
    const { routineId } = req.params;
    
    try {
        const routine = await getRoutineById(routineId);
        if(req.user.id === routine.creatorId) {
            const routine = await destroyRoutine(routineId);
            res.send(routine);
        } else {
            res.status(403)
            next({
                message: UnauthorizedDeleteError(req.user.username, routine.name),
                name: 'UnauthorizedDeleteError',
                error: 'blah'
            });
        };
    } catch (error) {
        next(error)
    }
})
// POST /api/routines/:routineId/activities
routinesRouter.post('/:routineId/activities', async (req, res, next) => {
    const { routineId } =req.params;
    const { activityId, count, duration } = req.body;

    try {
        const routine_activities = await getRoutineActivitiesByRoutine({id: routineId });
        let double = false;
        for (let i = 0; i < routine_activities.length; i++) {
            const activityRow = routine_activities[i];
            if (activityRow.activityId === activityId) {
              double = true;
              next({
                name: "Activity already exists in routine",
                error: "DuplicateRoutineActivityError",
                status: 403,
                message: DuplicateRoutineActivityError(routineId, activityId)});
            }
        };
        if(!double) {
            const activity = await addActivityToRoutine({
                routineId,
                activityId,
                count,
                duration,
            });
            res.send(activity);
        }
    } catch (error) {
        next(error);
    }
});
module.exports = routinesRouter;
