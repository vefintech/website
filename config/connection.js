'use strict';
const config = require('./config.js');

const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || "development";

module.exports = {
    connection: null,
    constructor: function() {
        this.connection = new Sequelize(config[env]);
    },
    connect: function() {
        if (!this.connection) {
            this.connection = new Sequelize(config[env]);
        }
    },
    getClient: function() {
        this.connect();        
        return this.connection;
    }
}