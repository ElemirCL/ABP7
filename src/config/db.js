const { Pool } = require('pg');//importando modulo pg 
require('dotenv').config();
// const { Sequelize } = require('sequelize');//importando modulo sequelize


// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//     host: process.env.DB_HOST,
//     port:process.env.DB_PORT,
//     dialect: 'postgres', // o mysql, sqlite, etc.
// });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
    console.log('Client conectado a PostgreSQL');
})

pool.on('error', (error) => {
    console.error('Error inesperado en pool: ', error.code, error.message);
})

module.exports = pool;