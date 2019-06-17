var express = require('express');
var moment = require('moment');
const ejs = require('ejs');
const excel = require('node-excel-export');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var formidable = require('formidable');
const path = require('path');
var utils = require('../services/utils');
const service = require('../services/asocciate');
var router = express.Router();

var activeMenu= utils.getActiveMenu("associates");

router.get('/', 
ensureLoggedIn('/auth/signIn'),
function(req, res, next) {

  const searchData = {
    page: req.query.page?(req.query.page):1,
    limit: req.query.limit || 10,
    q: req.query.q || '',
    type: req.query.type || '',
  };

  service.search(searchData)
    .then(function(data) {
      
      res.render('associates/index', {activeMenu: activeMenu,moment: moment,
        associates: {
            data: data.data.data,
            page: searchData.page, 
            limit: searchData.limit ,
            total: data.data.recordsTotal 
            } }
        );
    })
    .catch(function(err) {
      next(err);
    });
  
});

router.get('/:id/:type/ver', 
ensureLoggedIn('/auth/signIn'),
function(req, res, next) {
  const reqData = {uid: req.params.id, type: req.params.type};
  service.get(reqData)
    .then(function(data) {
      if (!data.success) {
        req.flash('error', data.msg);
        res.redirect('/admin/asociados');
      }
      else {
        res.render('associates/view', {activeMenu: activeMenu,moment: moment,type:req.params.type ,associate: data.data});        
      }
    })
    .catch(function(err) {
      next(err);
    });
});

router.get('/agregar', 
ensureLoggedIn('/auth/signIn'),
function(req, res, next) {
  utils.validateRol(req.user,'ADMIN');
  res.render('associates/add', {activeMenu: activeMenu,action: 'add',associate: null});
});

router.post('/agregar', 
ensureLoggedIn('/auth/signIn'),
function(req, res, next) {
  utils.validateRol(req.user,'ADMIN');
  var o = {image: ''};
  var form = new formidable.IncomingForm();
  form.parse(req);

  form
    .on('fileBegin', function (name, file){
      if (file.name!='') {
          o['image'] ="i"+moment().format("YYYYhhmmss")+file.name;
          file.path = path.join(__dirname, '..','public','img','associates',o['image']);
        }

      })
      .on('error', function(err) {
        req.flash('error', err.message);
        res.render('associates/add', {activeMenu: activeMenu,action: 'add',associate: o});
      })
      .on('field', function(field, value) {
        o[field] =value;
      })
      .on('end', function() {
        if (o.bot!='') {
          req.flash('error', "Existen errores en sus datos");
          res.render('associates/add', {activeMenu: activeMenu,action: 'add',associate: o});
        }
        else {
          if (o.status=='on' || o.status==true || o.status=='true' ) {
            o.status = 'ACTIVE';
          }
          else {
            o.status = 'INACTIVE';
          }
      
          service.create(o)
          .then(function(data) {
            res.redirect('/admin/asociados');
          })
          .catch(function(err) {
            req.flash('error', err.message);
            res.render('associates/add', {activeMenu: activeMenu,action: 'add',associate: o});
          });
        
        }
      });

});


router.get('/:id/:type/editar', 
ensureLoggedIn('/auth/signIn'),
function(req, res, next) {
  utils.validateRol(req.user,'ADMIN');
  const reqData = {uid: req.params.id, type: req.params.type};

  service.get(reqData)
    .then(function(data) {
      if (!data.success) {
        req.flash('error', data.msg);
        res.redirect('/admin/asociados/'+req.params.id+'/'+req.params.type+'/ver');
      }
      else {
        data.data.type =req.params.type;
        res.render('associates/edit', {activeMenu: activeMenu,action: 'edit',associate: data.data,type:req.params.type});      
      }
    })
    .catch(function(err) {
      next(err);
    });


});

router.post('/:id/:type/editar', 
ensureLoggedIn('/auth/signIn'),
function(req, res, next) {
  utils.validateRol(req.user,'ADMIN');
  var o = {image: ''};
  var form = new formidable.IncomingForm();
  form.parse(req);

  form
    .on('fileBegin', function (name, file){
        if (file.name!='') {
          o['image'] ="i"+moment().format("YYYYhhmmss")+file.name;
          file.path = path.join(__dirname, '..','public','img','associates',o['image']);
       }
      })
      .on('error', function(err) {
        req.flash('error', err.message);
        res.render('associates/add', {activeMenu: activeMenu,action: 'edit',associate: o});
      })
      .on('field', function(field, value) {
        o[field] =value;
      })
      .on('end', function() {
        o.uid = req.params.id;
        o.type = req.params.type;
        if (o.bot!='') {
          req.flash('error', "Existen errores en sus datos");
          res.render('associates/add', {activeMenu: activeMenu,action: 'edit',associate: o});
        }
        else {
          if (o.status=='on' || o.status==true || o.status=='true' ) {
            o.status = 'ACTIVE';
          }
          else {
            o.status = 'INACTIVE';
          }
      
          service.update(o).then(function(data) {
            if (!data.success) {
              req.flash('error', data.msg);
              res.redirect('/admin/asociados/'+req.params.id+"/"+req.params.type+"/editar");
            }
            else {
              res.redirect('/admin/asociados');
            }
          })
          .catch(function(err) {
            next(err);
          }); 
        
        }
      });

});

router.get('/:id/:type/eliminar', 
ensureLoggedIn('/auth/signIn'),
function(req, res, next) {
  utils.validateRol(req.user,'ADMIN');
  const reqData = {uid: req.params.id, type: req.params.type};

  service.get(reqData)
    .then(function(data) {
      if (!data.success) {
        req.flash('error', data.msg);
        res.redirect('/admin/asociados/'+req.params.id+'/'+req.params.type+'/ver');
      }
      else {
        service.delete(req.params.id,req.params.type).then(function(data) {
          if (!data.success) {
            req.flash('error', data.msg);
            res.redirect('/admin/asociados');
          }
          else {
            res.redirect('/admin/asociados');
          }
        })
        .catch(function(err) {
          next(err);
        });        
      }
    })
    .catch(function(err) {
      next(err);
    });

});


router.get('/actualizar', 
ensureLoggedIn('/auth/signIn'),
function(req, res, next) {
  utils.validateRol(req.user,'USER');
  activeMenu= utils.getActiveMenu("updateData");
  service.getById(req.user.id)
    .then(function(data) {
      if (!data.success) {
        req.flash('error', data.msg);
        res.redirect('/admin');
      }
      else {
        res.render('associates/update', {activeMenu: activeMenu,associate: data.data});
      }
    })
    .catch(function(err) {
      next(err);
    });


});

router.post('/actualizar', 
ensureLoggedIn('/auth/signIn'),
function(req, res, next) {
  utils.validateRol(req.user,'USER');
  activeMenu= utils.getActiveMenu("updateData");
  service.getById(req.user.id)
    .then(function(data) {
      if (!data.success) {
        req.flash('error', data.msg);
        res.redirect('/admin/asociados/actualizar');
      }
      else {
        var o = {image: '',type: data.data.type,uid: data.data.uid};
        var form = new formidable.IncomingForm();
        form.parse(req);
      
        form
          .on('fileBegin', function (name, file){
              if (file.name!='') {
                o['image'] ="i"+moment().format("YYYYhhmmss")+file.name;
                file.path = path.join(__dirname, '..','public','img','associates',o['image']);
             }
            })
            .on('error', function(err) {
              req.flash('error', err.message);
              res.redirect('/admin/asociados/actualizar');
            })
            .on('field', function(field, value) {
              o[field] =value;
            })
            .on('end', function() {
              if (o.bot!='') {
                req.flash('error', "Existen errores en sus datos");
                res.redirect('/admin/asociados/actualizar');
              }
              else {
                service.updateAsocciate(o).then(function(data) {
                  if (!data.success) {
                    req.flash('error', data.msg);
                    res.redirect('/admin/asociados/actualizar');
                  }
                  else {
                    req.flash('notify', "Informacion actualizada");
                    res.redirect('/admin/asociados/actualizar');
                  }
                })
                .catch(function(err) {
                  next(err);
                }); 
              
              }
            });
      }
    })
    .catch(function(err) {
      next(err);
    });

  

});

router.get('/excel', 
ensureLoggedIn('/auth/signIn'),
function(req, res, next) {
  service.search({page:1, limit: 999999, q: '', type: ''})
    .then(function(data) {
     
      const styles = {
        headerDark: {
          fill: {
            fgColor: {
              rgb: 'FFFFFFFF'
            }
          },
          font: {
            color: {
              rgb: '00000000'
            },
            sz: 14,
            bold: true,
            underline: true
          }
        }
      };

      const heading = [];
      
      
      const specification = {
        email: {displayName: 'Correo electronico',width: '30',headerStyle: styles.headerDark},
        names: {displayName: 'Nombres y Apellidos/Razon Social',width: '80',headerStyle: styles.headerDark},
        dni: {displayName: 'RIF',width: '10',headerStyle: '',cellStyle: '',headerStyle: styles.headerDark},
        birthdate: {displayName: 'Fecha de nacimiento',width: '10',headerStyle: styles.headerDark},    
        phone: {displayName: 'Telefono',width: '10',headerStyle: styles.headerDark},
        nacionality: {displayName: 'Nacionalidad',width: '20',headerStyle: styles.headerDark},
        address: {displayName: 'Direccion',width: '100',headerStyle: styles.headerDark},
        city: {displayName: 'Ciudad',width: '20',headerStyle: styles.headerDark},
        contact: {displayName: 'Persona de contacto',width: '50',headerStyle: styles.headerDark},
        activity: {displayName: 'Actividad/Emprendimiento',width: '80',headerStyle: styles.headerDark},
        phase: {displayName: 'Fase',width: '10',headerStyle: styles.headerDark},
        services: {displayName: 'Servicios',width: '100',headerStyle: styles.headerDark},
        answer: {displayName: 'Respuesta',width: '80',headerStyle: styles.headerDark}
  };
      
      var dataset =[];
      for(var i=0; i<data.data.data.length; i++) {
        var o =data.data.data[i].get();
        var d = {
          email: o.email,
          names: o.names,
          phone: o.phone,
          nacionality: o.nacionality,
          address: o.address,
          city: o.city,
          activity: o.activity,
          dni: o.dni,
          birthdate: o.birthdate || '',
          contact: o.contact,
          phase: o.phase || '',
          services: o.services,
          answer: o.answer
        };
        dataset.push(d);
      }
      

      const merges = []

      const report = excel.buildExport(
        [ 
          {
            name: 'Miembros', 
            heading: heading,
            merges: merges, 
            specification: specification,
            data: dataset 
          }
        ]
      );
      res.attachment('miembros.xlsx'); 
      return res.send(report);      
    })
    .catch(function(err) {
      next(err);
    });  
});


module.exports = router;
