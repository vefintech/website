'use strict';
const uuidv1 = require('uuid/v1');
const Sequelize = require('sequelize');

const database = require('../config/connection.js');
const sequelize = database.getClient();

module.exports = function() {
    var Entrepreneur = sequelize.define('entrepreneur', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        uid: {
            type: Sequelize.STRING
        },		
        email: {
            type: Sequelize.STRING,
            notEmpty: true,
			allowNull: false,
            validate: {
                isEmail: true
            }
        },
        names: {
            type: Sequelize.STRING,
            notEmpty: true,
			allowNull: false
        },
        image: {
            type: Sequelize.STRING,
            allowNull: true
        },
        city: {
            type: Sequelize.STRING,
            notEmpty: true,
			allowNull: false
        },	
		nationality: {
            type: Sequelize.STRING,
            allowNull: true
        },
        entrepreneurship: {
            type: Sequelize.STRING,
            notEmpty: true,
			allowNull: false
        },
        services: {
            type: Sequelize.STRING,
            notEmpty: true,
			allowNull: false
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: true
        },
		phase: {
            type: Sequelize.ENUM('Semilla','Pruebas','En Marcha'),
            defaultValue: 'Semilla'			
		},
		answer: {
            type: Sequelize.STRING,
            notEmpty: true,
			allowNull: false
        },
        created_at: {
            type: Sequelize.DATE
        }  
 
    },
    {
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: false,
        tableName: 'entrepreneur',
        hooks: {
            beforeCreate: (o,options) => {
				o.uid= uuidv1();
            }           
        }		
    }    
    );
 
    return Entrepreneur;
 
}