import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

const db = mysql.createPool({
    host: `${process.env.HOST}`,
    user: `${process.env.USER}`,
    database: `${process.env.DATABASE}`,
    password: `${process.env.PASSWORD}`
  }).promise();

export default db