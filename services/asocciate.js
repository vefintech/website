const Sequelize = require('sequelize');
const Op = require('sequelize').Op;
const bcrypt = require('bcryptjs');
const User = require('../models/User.js')();
const Personal = require('../models/Personal.js')();
const Legal = require('../models/Legal.js')();
const Ally = require('../models/Ally.js')();
const Entrepreneur = require('../models/Entrepreneur.js')();
const Asocciate = require('../models/Asocciate.js')();

const database = require('../config/connection.js');
const sequelize = database.getClient();

module.exports = {
    updateAsocciate: async function(reqData) {
        let obj = await this.getRelById(reqData.type,reqData.uid);

        if (!obj) {
            return { code: 404, success: false, msg: "El usuario no existe" };
        }
          
        let user = await this.getUserByEmail(obj.email);
        if (!user) {
            return { code: 400, success: false, msg: "El usuario no existe" };
        }
        
        let rel;
        switch (reqData.type) {
            case 'PERSONAL':
                if (reqData.birthdate===null || reqData.birthdate==='') {
                    reqData.birthdate='1970-01-01';
                }

                rel = {
                    names: reqData.names,
                    birthdate: reqData.birthdate,		
                    city: reqData.city,	
                    nationality:reqData.nationality,
                    phone: reqData.phone,
                    answer:obj.answer};
                break;
            case 'LEGAL':
                rel = {
                    business_name: reqData.business_name,
                    image: reqData.image==''?obj.image:reqData.image,		
                    dni: reqData.dni,
                    phone: reqData.phone,
                    address:reqData.address,
                    contact:reqData.contact,
                    activity:reqData.activity,
                    employees: reqData.employees,
                    answer:obj.answer};
                break; 
            case 'ALLY':
                rel = {
                    business_name: reqData.business_name,
                    image: reqData.image==''?obj.image:reqData.image,			
                    dni: reqData.dni,
                    phone: reqData.phone,
                    address:reqData.address,
                    contact:reqData.contact,
                    activity:reqData.activity,
                    answer:obj.answer};
                break;      
            case 'ENTREPENEUR':
                rel = {
                    names: reqData.names,
                    image: reqData.image==''?obj.image:reqData.image,		
                    city: reqData.city,	
                    nationality:reqData.nationality,
                    entrepreneurship: reqData.entrepreneurship,
                    services: reqData.services,
                    phase: reqData.phase,
                    phone: reqData.phone,
                    answer:obj.answer};    
                break;                                           
        }

        let t; 
        try {
            
            t = await sequelize.transaction();

            await obj.update(rel,{ transaction: t });

            await t.commit();

            return {
                success: true,
                code: 200,
                msg: "User updated"
            };
            
        } catch (err) {
            // Rollback transaction if any errors were encountered
            await t.rollback();
            
            return {
                success: false,
                code: 500,
                msg: err.message
            };            
        }
    },     

    create: async function(reqData) {
        let obj = await this.existEmail(reqData.email);
        if (obj.exist) {
            var e = new Error("El email ya se encuentra registrado");
            e.status = 400;
            throw e;
        }
          
        let user = await this.getUserByEmail(reqData.email);
        if (user) {
            var e = new Error("El email ya se encuentra registrado");
            e.status = 400;
            throw e;
        }

        user = {email: reqData.email, password: reqData.password,status: reqData.status};

        let rel;
        switch (reqData.type) {
            case 'PERSONAL':
                if (reqData.birthdate===null || reqData.birthdate==='') {
                    reqData.birthdate='1970-01-01';
                }

                rel = {email: reqData.email ,
                    names: reqData.names,
                    birthdate: reqData.birthdate,		
                    city: reqData.city,	
                    nationality:reqData.nationality,
                    phone: reqData.phone,
                    answer:reqData.answer};
                break;
            case 'LEGAL':
                rel = {email: reqData.email ,
                    business_name: reqData.business_name,
                    image: reqData.image,		
                    dni: reqData.dni,	
                    phone: reqData.phone,
                    address:reqData.address,
                    contact:reqData.contact,
                    activity:reqData.activity,
                    employees: reqData.employees,
                    answer:reqData.answer};
                break; 
            case 'ALLY':
                rel = {email: reqData.email ,
                    business_name: reqData.business_name,
                    image: reqData.image,		
                    dni: reqData.dni,	
                    phone: reqData.phone,
                    address:reqData.address,
                    contact:reqData.contact,
                    activity:reqData.activity,
                    answer:reqData.answer};
                break;      
            case 'ENTREPENEUR':
                rel = {email: reqData.email ,
                    names: reqData.names,
                    image: reqData.image,		
                    city: reqData.city,	
                    nationality:reqData.nationality,
                    entrepreneurship: reqData.entrepreneurship,
                    services: reqData.services,
                    phase: reqData.phase,
                    phone: reqData.phone,
                    answer:reqData.answer};    
                break;                                           
        }

        return sequelize.transaction(function(t) {
            return User
                .create(user,{ transaction: t })
                .then(function(){
                    switch (reqData.type) {
                        case 'PERSONAL':
                            return Personal.create(rel,{ transaction: t });
                        case 'LEGAL':
                        return  Legal.create(rel,{ transaction: t });
                            break; 
                        case 'ALLY':
                            return  Ally.create(rel,{ transaction: t });
                        case 'ENTREPENEUR':
                            return  Entrepreneur.create(rel,{ transaction: t });
                        default:
                            throw new Error("Ocurrio un error en el registro")    
                    }
                });
        });
    },
    update: async function(reqData) {
        let obj = await this.getRelById(reqData.type,reqData.uid);

        if (!obj) {
            return { code: 404, success: false, msg: "El usuario no existe" };
        }
          
        let user = await this.getUserByEmail(reqData.email);
        if (!user) {
            return { code: 400, success: false, msg: "El usuario no existe" };
        }

        let userData = {password: user.password,status: reqData.status};
        if (reqData.password != null && reqData.password!='') {
            userData.password = bcrypt.hashSync(reqData.password, 10);
        }

        let rel;
        switch (reqData.type) {
            case 'PERSONAL':
                rel = {
                    names: reqData.names,
                    birthdate: reqData.birthdate,		
                    city: reqData.city,	
                    nationality:reqData.nationality,
                    phone: reqData.phone,
                    answer:reqData.answer};
                break;
            case 'LEGAL':
                rel = {
                    business_name: reqData.business_name,
                    image: reqData.image==''?obj.image:reqData.image,		
                    dni: reqData.dni,
                    phone: reqData.phone,
                    address:reqData.address,
                    contact:reqData.contact,
                    activity:reqData.activity,
                    employees: reqData.employees,
                    answer:reqData.answer};
                break; 
            case 'ALLY':
                rel = {
                    business_name: reqData.business_name,
                    image: reqData.image==''?obj.image:reqData.image,			
                    dni: reqData.dni,
                    phone: reqData.phone,
                    address:reqData.address,
                    contact:reqData.contact,
                    activity:reqData.activity,
                    answer:reqData.answer};
                break;      
            case 'ENTREPENEUR':
                rel = {
                    names: reqData.names,
                    image: reqData.image==''?obj.image:reqData.image,		
                    city: reqData.city,	
                    nationality:reqData.nationality,
                    entrepreneurship: reqData.entrepreneurship,
                    services: reqData.services,
                    phase: reqData.phase,
                    phone: reqData.phone,
                    answer:reqData.answer};    
                break;                                           
        }


        let t; 
        try {
            
            t = await sequelize.transaction();

            await user.update(userData,{ transaction: t });
            await obj.update(rel,{ transaction: t });

            await t.commit();

            return {
                success: true,
                code: 200,
                msg: "User updated"
            };
            
        } catch (err) {
            // Rollback transaction if any errors were encountered
            await t.rollback();
            
            return {
                success: false,
                code: 500,
                msg: err.message
            };            
        }
    }, 
    get: async function(reqData) {
        let obj = await this.getRelById(reqData.type,reqData.uid);

        if (!obj) {
            return { code: 404, success: false, msg: "El usuario no existe" };
        }

        let user = await this.getUserByEmail(obj.email);
        if (!user) {
            return { code: 404, success: false, msg: "El usuario no existe" };
        }

        obj.status = user.status;

        return {
            success: true,
            code: 200,
            data: obj
        };        
    }, 
    getById: async function(id) {
        let as = await Asocciate.findOne({ where: {id: id} });

        if (!as) {
            return { code: 404, success: false, msg: "El usuario no existe" };
        }

        obj = await this.getRelById(as.type,as.uid);
        if (!obj) {
            return { code: 404, success: false, msg: "El usuario no existe" };
        }

        obj.type = as.type;

        return {
            success: true,
            code: 200,
            data: obj
        };        
    },     
    list: async function(pageData) {
        let page = parseInt(searchData.page);
        if (isNaN(page)) {
            searchData.page = 0;
            page = 0;
        }

        if(page<=0) {
            searchData.page=0;
        }

        let limit = parseInt(searchData.limit);
        if (isNaN(limit)) {
            searchData.limit = 10;
            limit= 10;
        }

        if(limit<=0) {
            searchData.limit=10;
        }

        var ands = [];

        if (searchData.q!='') {
            ands.push({ [Op.or]: [
                {email: {[Op.Like]: "%"+searchData.q+"%" }},
                {names: {[Op.Like]: "%"+searchData.q+"%" }},
                {phone: {[Op.Like]: "%"+searchData.q+"%" }},
                {nacionality: {[Op.Like]: "%"+searchData.q+"%" }},
                {city: {[Op.Like]: "%"+searchData.q+"%" }},
                {address: {[Op.Like]: "%"+searchData.q+"%" }},
                {activity: {[Op.Like]: "%"+searchData.q+"%" }}
            ]});
        }

        if (searchData.type!='') {
            ands.push({type: searchData.type});
        } 


        let data = await Asocciate.findAll(
                    { where: { [Op.and]: ands },
                    offset: searchData.page, limit: searchData.limit }
        );

        let total = await Asocciate.findAndCountAll({ where: { [Op.and]: ands }});  

        let response = { code: 200, success: true, data: {data: data, recordsFiltered: total.count, recordsTotal: total.count} };

        return response;
    },  
    delete: async function(id,type) {

        let rel = await this.getRelById(type,id);

        if (!rel) {
            return { code: 404, success: false, msg: "User not found" };
        }

        let user = await this.getUserByEmail(rel.email);
        if (!user) {
            return { code: 404, success: false, msg: "User not found" };
        }

        let t; 
        try {
            
            t = await sequelize.transaction();
            await rel.destroy({ transaction: t });
            await user.destroy({ transaction: t });
            await t.commit();

            return {
                success: true,
                code: 200,
                msg: "User deleted"
            };
            
        } catch (err) {
            // Rollback transaction if any errors were encountered
            await t.rollback();
            
            return {
                success: false,
                code: 500,
                msg: err.message
            };            
        }
    },            
    search: async function(searchData) {
        let page = parseInt(searchData.page);
        if (isNaN(page)) {
            searchData.page = 1;
            page = 1;
        }

        if(page<=0) {
            searchData.page=1;
            page = 1;
        }
        
        page-=1;

        let limit = parseInt(searchData.limit);
        if (isNaN(limit)) {
            searchData.limit = 10;
            limit= 10;
        }

        if(limit<=0) {
            searchData.limit=10;
            limit= 10;
        }

        var ands = [];

        if (searchData.q!='') {
            ands.push({ [Op.or]: [
                {email: {[Op.like]: "%"+searchData.q+"%" }},
                {names: {[Op.like]: "%"+searchData.q+"%" }},
                {phone: {[Op.like]: "%"+searchData.q+"%" }},
                {nacionality: {[Op.like]: "%"+searchData.q+"%" }},
                {city: {[Op.like]: "%"+searchData.q+"%" }},
                {address: {[Op.like]: "%"+searchData.q+"%" }},
                {activity: {[Op.like]: "%"+searchData.q+"%" }}
            ]});
        }

        if (searchData.type!='') {
            ands.push({type: searchData.type});
        } 


        let data = await Asocciate.findAll(
                    {   where: { [Op.and]: ands },
                        offset: (page*limit), 
                        limit: limit ,
                        order: [['created_at', 'DESC']]
                    }
        );
         
        let total = await Asocciate.findAndCountAll({ where: { [Op.and]: ands }});  

        let response = { code: 200, success: true, data: {data: data, recordsFiltered: total.count, recordsTotal: total.count} };

        return response;
        
    },
    existEmail: async function(email) {
        let obj = await Asocciate.findOne({ where: {email: email} });
        if (obj) {
            return { code: 200, success: true, exist: true };
        } else {
            return { code: 200, success: true, exist: false };
        }
    },
    getRelById: async function(type,id) {
        let rel;
        switch (type) {
            case 'PERSONAL':
                rel = await this.getPersonalById(id);
                break;
            case 'LEGAL':
                rel = await this.getLegalById(id);
                break; 
            case 'ALLY':
                rel = await this.getAllyById(id);
                break;      
            case 'ENTREPENEUR':
                rel = await this.getEntrepeneurById(id);
                break;                                           
        }
        return rel;
    }, 
    getUserByEmail: async function(email) {
        let obj = await User.findOne({ where: {email: email} });
        return obj;
    },       
    getUserById: async function(id) {
        let obj = await User.findOne({ where: {uid: id} });
        return obj;
    },
    getPersonalById: async function(id) {
        let obj = await Personal.findOne({ where: {uid: id} });
        return obj;
    },
    getLegalById: async function(id) {
        let obj = await Legal.findOne({ where: {uid: id} });
        return obj;
    },
    getAllyById: async function(id) {
        let obj = await Ally.findOne({ where: {uid: id} });
        return obj;
    } ,
    getEntrepeneurById: async function(id) {
        let obj = await Entrepreneur.findOne({ where: {uid: id} });
        return obj;
    } ,
    indicators: async function() {
        const stats = [
            {'type': 'PERSONAL', 'n': 0, name: 'Personal', icon: 'icon-user',color:'primary'},
            {'type': 'LEGAL', 'n': 0,  name: 'Juridico',icon: 'icon-organization',color:'purple'},
            {'type': 'ALLY', 'n': 0,  name: 'Aliado',icon: 'icon-people',color:'green'},
            {'type': 'ENTREPENEUR', 'n': 0,  name: 'Emprendedor',icon: 'icon-briefcase',color:'yellow'},
          ];


         let obj = await Asocciate.findAll({
            group: [ 'type' ],
            attributes: ['type', [Sequelize.fn('count', Sequelize.col('uid')), 'stats']],
        });

        for (var i=0; i<obj.length; i++) {
            const d = obj[i].get();
            switch (d.type) {
                case 'PERSONAL':
                    stats[0].n = d.stats;
                    break;
                case 'LEGAL':
                    stats[1].n = d.stats;
                    break; 
                case 'ALLY':
                    stats[2].n = d.stats;
                    break;      
                case 'ENTREPENEUR':
                    stats[3].n = d.stats;
                    break;                                           
            }
          }

        return { code: 200, success: true, data: stats };
        
    },
    indicatorsIndex: async function() {
        const stats = [
            {'type': 'TOTAL', 'n': 0, name: 'Total', icon: 'icon-user',color:'primary'},
            {'type': 'LEGAL', 'n': 0,  name: 'Juridico',icon: 'icon-organization',color:'purple'},
            {'type': 'ENTREPENEUR', 'n': 0,  name: 'Emprendedor',icon: 'icon-briefcase',color:'yellow'},
          ];

        let obj = await Asocciate.findAll({
            attributes: [ [Sequelize.fn('count', Sequelize.col('uid')), 'stats']],
        });

        for (var i=0; i<obj.length; i++) {
            const d = obj[i].get();
            stats[0].n = d.stats;
        }

        obj = await Asocciate.findAll({
            group: [ 'type' ],
            attributes: ['type', [Sequelize.fn('count', Sequelize.col('uid')), 'stats']],
        });

        for (var i=0; i<obj.length; i++) {
            const d = obj[i].get();
            switch (d.type) {
                case 'LEGAL':
                    stats[1].n = d.stats;
                    break;      
                case 'ENTREPENEUR':
                    stats[2].n = d.stats;
                    break;                                           
            }
          }

        return { code: 200, success: true, data: stats };
        
    }     
}