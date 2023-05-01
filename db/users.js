const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  try {
    const { rows: [user] } = await client.query(`
      INSERT INTO users(username, password)
      VALUES ($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING id, username;
    `, [username, password]
    );
    // delete user.password
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  // try {
  //   const { rows: [user] } = await client.query(`
  //     SELECT user FROM users
  //     WHERE username=${username}
  //     `)
  //     return user;
  // } catch (error) {
    
  // }
}

async function getUserById(userId) {

}

async function getUserByUsername(userName) {
  try {
    console.log("this is userName", userName);
    const { rows: [user]} = await client.query(`
      SELECT * FROM users
      WHERE username = $1;
      `,[userName]);
      return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
