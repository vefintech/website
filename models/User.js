'use strict';
const uuidv1 = require('uuid/v1');
const bcrypt = require('bcryptjs');
const Sequelize = require('sequelize');

const database = require('../config/connection.js');
const sequelize = database.getClient();

module.exports = function() {
    var User = sequelize.define('user', {
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
            validate: {
                isEmail: true
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
 
        last_login: {
            type: Sequelize.DATE
        },
        status: {
            type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
            defaultValue: 'INACTIVE'
        },
        rol: {
            type: Sequelize.ENUM('ADMIN', 'USER'),
            defaultValue: 'USER'
        },
        created_at: {
            type: Sequelize.DATE
        }                 
 
    },
    {
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: false,
        tableName: 'user',
        hooks: {
            beforeCreate: (o,options) => {
				o.uid= uuidv1();
				o.password = bcrypt.hashSync(o.password, 10);
            }           
        },        
		instanceMethods: {
			comparePassword : function(pass) {
				return bcrypt.compareSync(pass, this.password);
			}			
		}		
    }    
    );
 
    return User;
 
}