const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  try {
    // const lowerName = name.toLowerCase();
    const { rows: [activity] } = await client.query(`
      INSERT INTO activities(name, description)
      VALUES ($1, $2)
      ON CONFLICT (name) DO NOTHING
      RETURNING *;
    `, [name, description]
    );
    return activity;
  } catch (error) {
    throw error;
  }
}

async function getAllActivities() {
  // select and return an array of all activities
  // creates and returns the new activity 

  try{
    const { rows } = await client.query (`
         SELECT * FROM activities;
`);
    return rows;
  } catch (error) {
    throw error;
    }
  }

async function getActivityById(id) {
try{
  const { rows: [activity] } = await client.query(`
  SELECT *
  FROM activities
  WHERE id=$1
  `,[id]);
  
  return activity;
} catch (error) {
  throw error;
}
}

async function getActivityByName(name) {
try {
  const { rows: [activity] } = await client.query(`
  SELECT *
  FROM activities
  WHERE name = $1
  `,[name]);

  return activity
 } catch (error) {
  throw error;
}
}

// used as a helper inside db/routines.js
// Attach array of activities to each routine
async function attachActivitiesToRoutines(routines) {
    const routinesToReturn = [...routines];   
    const position = routine.map((_, index) => `$${ index + 1}`).join(', ');
    const routineIds = routine.map(routine => routine.id);

      // Get the activities, then JOIN routine_activities (so we can get routineId)
      // Do for every routine seperately

      const { rows: activities } = await client.query(`
      SELECT activities.*, routine_activites.duration, routine_activites.count, routine_activites."routineId", routine_activites.id AS "routine_activityId"
      FROM activities
      JOIN routine_activites ON routine_activites."activityId" = activities.id
      WHERE routine_activites."routineId" IN (${position})
      `,
      routineIds 
      ) 
     ; 
      
// Loop over each routine
for (const routine of routinesToReturn){

// If routine.id matches the activity.routineId, then add to routine
const activitiesToAdd = activities.filter(
  (activity) => activity.routineId === routine.id);

routine.activies = activitiesToAdd;
}
return routinesToReturn;
}

async function updateActivity({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', '); 

    if (setString.length === 0){
      return;
    }

    try {
      const { rows: [activity] } = await client.query(`
      UPDATE activities 
      SET ${setString}
      WHERE id=${ id }
      RETURNING *;
      `, Object.values(fields));

      return activity 
    } catch (error) {
      throw error;
    }
   }
  // Do update the name and description does not affect ID
  // Return the updated activity
  //
  // $$ --> why two?
  // Is it bc multiple ids can have the same activity?
  // Why is index on line 80? Which lecture?
  // 

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
