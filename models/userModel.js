// models/userModel.js

const db = require('../utils/mongoDBApi');

const DB_NAME = 'elearning_db'; // replace with your actual DB name
const COLLECTION = 'users';

async function createUser(userData) {
    return await db.createListing(userData, DB_NAME, COLLECTION);
}

async function findUserByEmail(email) {
    return await db.readRow({ email }, DB_NAME, COLLECTION);
}

async function updateUser(email, updates) {
    return await db.updateRow({ email }, updates, DB_NAME, COLLECTION);
}

async function deleteUser(email) {
    return await db.deleteRow({ email }, DB_NAME, COLLECTION);
}

async function listUsers(filter = {}) {
    return await db.readRows(filter, DB_NAME, COLLECTION);
}

module.exports = {
    createUser,
    findUserByEmail,
    updateUser,
    deleteUser,
    listUsers
};
