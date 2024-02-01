import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import bluebird from 'bluebird';

const SALT_ROUND = bcrypt.genSaltSync(10);

/**
 * 
 * @param {*} rawPassword - password inputted from client
 * @returns hashed password by bcrypt
 */
const hashUserPassword = async (rawPassword) => {
    return await bcrypt.hash(rawPassword, SALT_ROUND);
};

/**
 * 
 * @returns list of users in database 
 */
const getUserList = async () => {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'jwt_auth_manager',
            Promise: bluebird
        });

        let userList = [];
        const [rows, fields] = await connection.execute(`
            SELECT * FROM users
        `);

        userList = rows;
        return userList;
    } catch (error) {
        console.log("Error: ", error.message);
    }

}

/**
 * 
 * @param {*} email - email inputted from client
 * @param {*} password - password inputted from client
 * @param {*} username - username inputted from client
 */
const createNewUser = async (email, password, username) => {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'jwt_auth_manager',
            Promise: bluebird
        });

        let hashedPassword = await hashUserPassword(password);

        let [rows, fields] = await connection.execute(`
            INSERT INTO users (email, username, password)
            VALUES (?, ?, ?)
        `, [email, username, hashedPassword]
        );

        return rows;
    } catch (error) {
        console.log("Error: ", error.message);
    }

};


/**
 * 
 * @param {*} userID - user id wanted to delete
 */
const deleteUser = async (userID) => {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'jwt_auth_manager',
            Promise: bluebird
        });


        let [rows, fields] = await connection.execute(`
            DELETE FROM users WHERE id = ?
        `, [userID]
        );

        return rows;

    } catch (error) {
        console.log("Error: ", error.message);
    }
};

module.exports = {
    hashUserPassword,
    getUserList,
    createNewUser,
    deleteUser
};