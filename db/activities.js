const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  // return the new activity
  try{
    const { rows: [users] } = await client.query(`
    INSERT INTO users (name, description)
    VALUES ($1, $2)
    ON CONFLICT (activity) DO NOTHING
    RETURNING *;
    `,[activity]);

    return activity;
    catch (error){
    throw error;
    }
  }
}

async function getAllActivities() {
  // select and return an array of all activities
  // creates and returns the new activity 

  try{
    const { rows } = await client.query
    SELECT * FROM activities;

    return rows;
    catch (error) {
    throw error;
    }
  }
}
  // should we add a specific message like in juicebox? to double check


async function getActivityById(id) {}

try{
  const { rows: [client] } = await client.query;
  SELECT  name, description 
  FROM users
  WHERE id=${username}
}

// ABOVE - not incorrect just need to merge 

async function getActivityByName(name) {}

  SELECT  name, description 
  FROM users
  WHERE id=${username}

// used as a helper inside db/routines.js
async function attachActivitiesToRoutines(routines) {}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id --> ask teach why bc it says to do that 
  // do update the name and description
  // return the updated activity
  // is it bc multiple ids can have the same activity?
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
