'use strict';
const uuidv1 = require('uuid/v1');
const Sequelize = require('sequelize');

const database = require('../config/connection.js');
const sequelize = database.getClient();

module.exports = function() {
    var Personal = sequelize.define('personal', {
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
        birthdate: {
            type: Sequelize.DATE,
            allowNull: true
        },		
        city: {
            type: Sequelize.STRING,
            notEmpty: true,
			allowNull: false
        },	
		nationality: {
            type: Sequelize.STRING,
            type: Sequelize.STRING,
            notEmpty: true,
			allowNull: false
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: true
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
        tableName: 'personal',
        hooks: {
            beforeCreate: (o,options) => {
				o.uid= uuidv1();
            }           
        }        		
    }    
    );
 
    return Personal;
 
}