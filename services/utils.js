
module.exports = {
    getActiveMenu: function(option) {
        let optionsMenu = {
            users: false,
            associates: false,
            changePassword: false,
            updateData: false
        };
        switch(option) {
            case "updateData":
                optionsMenu.updateData = true;
                break;             
            case "changePassword":
                optionsMenu.changePassword = true;
                break;            
            case "users":
                optionsMenu.users = true;
                break;
            case "associates":
                optionsMenu.associates = true;
                break;
        }

        return optionsMenu;
    } ,
    validateRol: function(user, rol,req,res) {
        if (user.rol!=rol) {
            var e = new Error("Acceso prohibido");
            e.status= 401;
            throw e;
        }
    },
    setLocalUser: function(res) {
        res.locals.authenticated = false;
        if (req.user) {
          res.locals.authenticated =  true;
        }
      }       
}