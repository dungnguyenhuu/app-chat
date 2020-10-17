import express from "express";
import {home, auth, user, contact} from "./../controllers/index";
import {authValid, userValid, contactValid} from "./../validation/index";
import passport from "passport"
import initPassportLocal from "./../controllers/passportController/local";

// init passportLocal
initPassportLocal();

let router = express.Router();

 /* Init all routes
 @param app from exactly express module */

let initRoutes = (app) => {
    
    router.get("/login-register", auth.checkLoggedOut, auth.getLoginRegister);
    router.post("/register", auth.checkLoggedOut, authValid.register, auth.postRegister);

    router.post("/login", auth.checkLoggedOut, passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login-register",
        successFlash: true,
        failureFlash: true,
    }));

    router.get("/", auth.checkLoggedIn, home.getHome);
    router.get("/logout", auth.checkLoggedIn, auth.getLogout);
    router.put("/profile/update-avatar", auth.checkLoggedIn, user.updateAvatar);
    router.put("/profile/update-info", auth.checkLoggedIn, userValid.updateInfo, user.updateInfo);
    router.put("/profile/update-pass", auth.checkLoggedIn, userValid.updatePass, user.updatePass);
    router.get("/contact/find-users/:keyword", auth.checkLoggedIn,contactValid.findUserContact,  contact.findUsersContact);


    return app.use("/", router);
};

module.exports = initRoutes;
