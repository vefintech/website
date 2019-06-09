const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sequelize = require('sequelize');
const config = require('../config/config.js');
const User = require('../models/User.js')();


module.exports = {
    me: async function(email) {
        let obj = await User.findOne({ where: {email: email} });
        if (!obj) {
            return { code: 404, success: false, msg: "User not found" };
        }
        
        return {
            success: true,
            code: 200,
            data: obj
        };
    },
    resetPassword: async function(body) {

        let obj = await User.findOne({ where: {email: body.email} });
        if (!obj) {
            return { code: 500, success: false, msg: "Usuario no encontrado" };
        }

        body.password = bcrypt.hashSync(body.password, 10);

        let user = await obj.update({password: body.password});

        return {success: true};
    },    
    validate: async function(email) {
        let obj = await User.findOne({ where: {email: email} });
        if (!obj) {
            return { code: 500, success: false, msg: "Usuario no encontrado" };
        }
        
        var user = obj.get();
        if (user.status=='ACTIVE') {
            return { code: 500, success: false, msg: "El usuario ya se encuentra validado" };
        }

        user = await obj.update({status: 'ACTIVE'});

        return {success: true};
    },    
    signIn: async function(userData) {
        let obj = await User.findOne({ where: {email: userData.email, status: 'active'} });

        if (!obj) {
            return { code: 404, success: false, msg: "User not found" };
        }


        const match = bcrypt.compareSync(userData.password,obj.password);
        if (!match) {
            return { code: 401, success: false, msg: "Invalid credentials" };
        }

        var payload = {
            subject: obj.email,
            audience: config.audience,
            issuer: config.issuer,
            rol: obj.rol,
            id: obj.id,
            email: obj.email
        };

        var token = jwt.sign(payload, config.secret, {
            expiresIn: config.sessionTime
        });

        return {
            success: true,
            code: 200,
            token: token,
            user: obj
        };
    },
    get: async function(id) {
        const user = await User.findOne({ where: {uid: id} });
        if (!user) {
            return { code: 404, success: false, msg: "User not found" };
        }

        return {
            success: true,
            code: 200,
            data: user
        };
    },
    list: async function(pageData) {
        

        let page = parseInt(pageData.page);
        if (isNaN(page)) {
            page = 0;
        }

        let limit = parseInt(pageData.limit);
        if (isNaN(limit)) {
            limit = 10;
        }

        if(limit<=0) {
            limit=10;
        }

        let offset = (page );

        let users = await User.findAll({ offset: offset, limit: limit });
        
        response = { code: 200, success: true, data: users };

        return response;
    },
    listAdmin: async function(pageData) {
        let page = parseInt(pageData.page);
        if (isNaN(page)) {
            page = 0;
        }

        let limit = parseInt(pageData.limit);
        if (isNaN(limit)) {
            limit = 10;
        }

        if(limit<=0) {
            limit=10;
        }

        let offset = (page );

        let users = await User.findAll({ where: {rol: 'ADMIN'},offset: offset, limit: limit });
        
        response = { code: 200, success: true, data: users };

        return response;
    },
    create: async function(user) {
        let res = await this.existEmail(user.email);
        if (res.exist) {
            return { code: 400, success: false, msg: "El email ya se encuentra registrado" };
        }

        let obj = await User.create(user);
        return {
            success: true,
            code: 200,
            msg: "User created"
        };
    },

    update: async function(id, user) {
        let obj = await this.getUserById(id);
        if (!obj) {
            return { code: 404, success: false, msg: "User not found" };
        }

        if (user.email != obj.email) {
            let res = await this.existEmail(user.email);
            if (res.exist) {
                return { code: 400, success: false, msg: "Email exist!" };
            }
        }
        
        if (user.password != null && user.password!='') {
            user.password = bcrypt.hashSync(user.password, 10);
        } else {
            user.password = obj.password;
        }

        obj = await obj.update(user);
        return {
            success: true,
            code: 200,
            msg: "User updated"
        };

    },

    delete: async function(id) {
        let obj = await this.getUserById(id);
        if (!obj) {
            return { code: 404, success: false, msg: "User not found" };
        }

        await obj.destroy({ force: true });

        return {
            success: true,
            code: 200,
            msg: "User deleted"
        };

    },
    existEmail: async function(email) {
        let obj = await User.findOne({ where: {email: email} });
        if (obj) {
            return { code: 200, success: true, exist: true };
        } else {
            return { code: 200, success: true, exist: false };
        }
    },
    getUserByEmail: async function(email) {
        let obj = await User.findOne({ where: {email: email} });
        return obj;
    },
    getUserById: async function(id) {
        let obj = await User.findOne({ where: {uid: id} });
        return obj;
    }  ,   
    
    pageListAdmin: async function(pageData) {
        let page = parseInt(pageData.page);
        if (isNaN(page)) {
            page = 0;
        }

        let limit = parseInt(pageData.limit);
        if (isNaN(limit)) {
            limit = 10;
        }

        if(limit<=0) {
            limit=10;
        }

        let offset = (page );

        let users = await User.findAll({ where: {rol: 'ADMIN'},offset: offset, limit: limit });
        let total = await User.findAndCountAll({ where: {rol: 'ADMIN'} });

        response = { code: 200, success: true, data: {data: users, recordsFiltered: total.count, recordsTotal: total.count} };

        return response;
    },    
    pageList: async function(pageData) {
        let page = parseInt(pageData.page);
        if (isNaN(page)) {
            page = 0;
        }
  

        let limit = parseInt(pageData.limit);
        if (isNaN(limit)) {
            limit = 10;
        }

        if(limit<=0) {
            limit=10;
        }

        let offset = (page );

        let users = await User.findAll({ where: {rol: 'ADMIN'},offset: offset, limit: limit });
        let total = await User.findAndCountAll({ where: {rol: 'ADMIN'} });

        response = { code: 200, success: true, data: {data: users, recordsFiltered: total.count, recordsTotal: total.count} };

        return response;
    }, 
}