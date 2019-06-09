'use strict';
const Sequelize = require('sequelize');

const database = require('../config/connection.js');
const sequelize = database.getClient();

module.exports = function() {
    var Asocciate = sequelize.define('asocciates', {
        id: {
            autoIncrement: false,
            primaryKey: true,
            type: Sequelize.INTEGER
        },        
        type: {
            type: Sequelize.STRING
        },	        
        uid: {
            type: Sequelize.STRING
        },		
        email: {
            type: Sequelize.STRING
        },
        names: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        },
        nacionality: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        city: {
            type: Sequelize.STRING
        },
        activity: {
            type: Sequelize.STRING
        },
        created_at: {
            type: Sequelize.DATE
        } ,
        image: {
            type: Sequelize.STRING
        }   ,
        answer: {
            type: Sequelize.STRING
        } ,
        dni: {
            type: Sequelize.STRING
        },
        birthdate: {
            type: Sequelize.STRING
        } ,
        contact: {
            type: Sequelize.STRING
        },
        employees: {
            type: Sequelize.STRING
        },
        phase: {
            type: Sequelize.STRING
        },
        services: {
            type: Sequelize.STRING
        }                                                                          
 
    },
    {
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: false,
        tableName: 'asocciates',
        hooks: {
            beforeCreate: (o,options) => {
				o.uid= uuidv1();
            }           
        }	        
    }    
    );
 
    return Asocciate;
 
}