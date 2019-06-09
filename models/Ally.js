'use strict';
const uuidv1 = require('uuid/v1');
const Sequelize = require('sequelize');

const database = require('../config/connection.js');
const sequelize = database.getClient();

module.exports = function() {
    var Ally = sequelize.define('ally', {
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
        business_name: {
            type: Sequelize.STRING,
            notEmpty: true,
			allowNull: false
        },
        image: {
            type: Sequelize.STRING,
            allowNull: true
        },
        dni: {
            type: Sequelize.STRING,
            notEmpty: true,
			allowNull: false
        },
        address: {
            type: Sequelize.STRING,
			allowNull: true
        },
        phone: {
            type: Sequelize.STRING,
            notEmpty: true,
			allowNull: false
        },
		contact: {
            type: Sequelize.STRING,
            notEmpty: true,
			allowNull: false
        },
        activity: {
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
        tableName: 'ally',
        hooks: {
            beforeCreate: (o,options) => {
				o.uid= uuidv1();
            }           
        }	
    }    
    );
 
    return Ally;
 
}