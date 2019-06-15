const express = require('express');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const utils = require('../services/utils');
const service = require('../services/user');

const router = express.Router();

const activeMenu= utils.getActiveMenu("users");

/* GET users listing. */
router.get('/', 
ensureLoggedIn('/auth/signIn'),
function(req, res, next) {
  utils.setLocalUser(res);
  utils.validateRol(req.user,'ADMIN');
  res.render('users/index', {activeMenu: activeMenu,users:[]});

});

router.get('/agregar', 
ensureLoggedIn('/auth/signIn'),
function(req, res, next) {
  utils.setLocalUser(res);
  utils.validateRol(req.user,'ADMIN');
  res.render('users/add', {activeMenu: activeMenu,user: null});
});

router.post('/agregar', 
ensureLoggedIn('/auth/signIn'),
function(req, res, next) {
  utils.setLocalUser(res);
  utils.validateRol(req.user,'ADMIN');
  const o = req.body;
  if (o.status=='on' || o.status==true || o.status=='true' ) {
    o.status = 'ACTIVE';
  }
  else {
    o.status = 'INACTIVE';
  }

  service.create(o).then(function(data) {
    if (!data.success) {
      req.flash('error', data.msg);
      res.render('users/add', {activeMenu: activeMenu,user: o});
    }
    else {
      res.redirect('/admin/usuarios');
    }
    
  })
  .catch(function(err) {
    next(err);
  }); 
  
});


router.get('/:id/editar', 
ensureLoggedIn('/auth/signIn'),
function(req, res, next) {
  utils.setLocalUser(res);
  utils.validateRol(req.user,'ADMIN');
  service.get(req.params.id).then(function(data) {
    if (!data.success) {
      req.flash('error', data.msg);
      res.redirect('/admin/usuarios');
    }
    else {
      res.render('users/edit', {activeMenu: activeMenu,user: data.data});        
    }
  })
  .catch(function(err) {
    next(err);
  }); 

});

router.post('/:id/editar', 
ensureLoggedIn('/auth/signIn'),
function(req, res, next) {
  utils.setLocalUser(res);
  utils.validateRol(req.user,'ADMIN');
  const o = req.body;
  if (o.status=='on' || o.status==true || o.status=='true' ) {
    o.status = 'ACTIVE';
  }
  else {
    o.status = 'INACTIVE';
  }

  service.update(req.params.id,o).then(function(data) {
    if (!data.success) {
      req.flash('error', data.msg);
      res.redirect('/admin/usuarios'+req.params.id+"/editar");
    }
    else {
      res.redirect('/admin/usuarios');
    }

    
  })
  .catch(function(err) {
    next(err);
  }); 
});

router.get('/:id/eliminar',
ensureLoggedIn('/auth/signIn'),
 function(req, res, next) {
  utils.setLocalUser(res);
  utils.validateRol(req.user,'ADMIN');
  if (req.user.id==req.params.id) {
    var e = new Error("Acceso prohibido. No puedes eliminarte a ti mismo");
    e.status= 401;
    throw e;      
  }
  
  service.get(req.params.id).then(function(data) {
    if (!data.success) {
      req.flash('error', data.msg);
      res.redirect('/admin/usuarios');
    }
    else {
      service.delete(req.params.id).then(function(data) {
        if (!data.success) {
          req.flash('error', data.msg);
          res.redirect('/admin/usuarios');
        }
        else {
          res.redirect('/admin/usuarios');
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


module.exports = router;
