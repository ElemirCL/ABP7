const { Client } = require('pg');//importando modulo pg
const dbConfig = require('./dbConfig/config');//importando información de conexión a db desde config.js
const chalk = require('chalk');//importando modulo chalk

async function conectarDB(){
    const client = new Client(dbConfig);

    try {
        await client.connect();
        console.log(chalk.green('Conexión exitosa a PostgreSQL'));
    } catch (error) {
        console.error(chalk.red('Error de conexión: '),chalk.bgRed(error.code, error.message));
    }finally{
        await client.end();
        console.log(chalk.inverse('Conexión a PostgreSQL finalizada.'));
    }
}

conectarDB();