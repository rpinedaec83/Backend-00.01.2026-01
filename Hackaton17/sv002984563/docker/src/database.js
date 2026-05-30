const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    process.env.DB_SCHEMA, 
    process.env.DB_USER,  
    process.env.DB_PASSWORD
    {
        host: process.env.DB_HOST, 
        port: process.env.DB_PORT,
        dialect: 'postgres'
    }
);

const Person = sequelize.define('Person',{
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName:{
        type: Sequelize.STRING,
        allowNull: true
    }
});

module.exports ={
    sequelize,
    Person
}