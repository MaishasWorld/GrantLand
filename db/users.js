const client = require("./client");
const bcrypt = require('bcrypt');
// database functions

async function hashedPassword({password}) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}
async function checkPassword(password, hash) {
  const compare = await bcrypt.compare(password, hash)
  return compare;
}
// user functions
async function createUser({ username, password }) {
  try {
    const newPassword = await hashedPassword({password});

    const { rows: [user] } = await client.query(`
      INSERT INTO users(username, password)
      VALUES ($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING id, username;
    `, [username, newPassword]
    );
    // delete user.password
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  try {
    if(!username || !password) {
      return;
    }
    const { rows: [user]} = await client.query(`
      SELECT * FROM users
      WHERE username = $1;
      `,[username]);
    const match = await checkPassword(password, user.password);
    if(!match) {
      return null;
    }
      delete user.password;
      return user;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const { rows: [user]} = await client.query(`
      SELECT * FROM users
      WHERE id = $1;
      `,[userId]);
      delete user.password;
      return user;
  } catch (error) {
    
  }
}

async function getUserByUsername(userName) {
  try {
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
