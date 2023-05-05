const client = require("./client");
const { attachActivitiesToRoutines } = require("./activities");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const { rows: [routine] } = await client.query(`
      INSERT INTO routines("creatorId", "isPublic", name, goal)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (name) DO NOTHING
      RETURNING *
      `,[creatorId, isPublic, name, goal])
    
    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutineById(id) {
  try {
    const { rows: [routine] } = await client.query(`
      SELECT * FROM routines
      WHERE id=$1
    `, [id])
    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query(`
      SELECT * from routines;
    `);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(
          `
          SELECT routines.*, users.username AS "creatorName" 
          FROM routines
          JOIN users ON routines."creatorId" = users.id
          `);

          return await attachActivitiesToRoutines(routines);
    }catch (error) {
      throw error;
    }          
}

// Join routine activities

async function getAllPublicRoutines() {
  try {
    let routines = await getAllRoutines();

    routines = routines.filter(routine => {
      return routine.isPublic
    });
    return routines;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    let routines = await getAllRoutines();

    routines = routines.filter(routine => {
      return routine.creatorName === username;
    })
    return routines;
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    let routines = await getAllPublicRoutines();

    routines = routines.filter(routine => {
      return routine.creatorName === username;
    })
    return routines;
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    let routines = await getAllPublicRoutines();

    routines = routines.filter(routine => {
      for(let i=0; i < routine.activities.length; i++){
        const activity = routine.activities[i];

        if(activity.id === Number(id)) {
          return routine;
        }
      }
    });
    return routines;
  } catch (error) {
    throw error;
  }
}

async function updateRoutine({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`).join(', '); 

  if (setString.length === 0){
    return;
  }

  try {
    const { rows: [routine] } = await client.query(`
    UPDATE routines 
    SET ${setString}
    WHERE id=${ id }
    RETURNING *;
    `, Object.values(fields));

    return routine 
  } catch (error) {
    throw error;
  }
}


async function destroyRoutine(id) {
  try {
    const { rows: routine } = await client.query(`
      DELETE FROM routine_activities
      WHERE "routineId" = $1
    `, [id])


    const { rows: [routineToRemove] } = await client.query(`
      DELETE FROM routines
      WHERE id=$1
      RETURNING *
    `, [id])
    return routineToRemove;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
