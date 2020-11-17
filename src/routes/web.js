import express from "express";
import { home, auth, user, contact, notification, message, groupChat } from "./../controllers/index";
import { authValid, userValid, contactValid, messageValid, groupChatValid } from "./../validation/index";
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

    router.get("/contact/find-users/:keyword", auth.checkLoggedIn, contactValid.findUserContact, contact.findUsersContact);
    router.post("/contact/add-new", auth.checkLoggedIn, contact.addNew);
    router.delete("/contact/remove-contact", auth.checkLoggedIn, contact.removeContact);
    router.delete("/contact/remove-request-contact-sent", auth.checkLoggedIn, contact.removeRequestContactSent);
    router.delete("/contact/remove-request-contact-recevied", auth.checkLoggedIn, contact.removeRequestContactRecevied);
    router.put("/contact/approve-request-contact-recevied", auth.checkLoggedIn, contact.approveRequestContactRecevied);
    router.get("/contact/read-more-contacts", auth.checkLoggedIn, contact.readMoreContacts);
    router.get("/contact/read-more-contacts-sent", auth.checkLoggedIn, contact.readMoreContactsSent);
    router.get("/contact/read-more-contacts-received", auth.checkLoggedIn, contact.readMoreContactsReceived);

    router.get("/notification/read-more", auth.checkLoggedIn, notification.readMore);
    router.put("/notification/mark-all-as-read", auth.checkLoggedIn, notification.markAllAsRead);

    router.post("/message/add-new-text-emiji", auth.checkLoggedIn, messageValid.checkMessageLength, message.addNewTextEmoji);
    router.post("/message/add-new-image", auth.checkLoggedIn, message.addNewImage);
    router.post("/message/add-new-attachment", auth.checkLoggedIn, message.addNewAttachment);

    router.get("/contact/search-friends/:keyword", auth.checkLoggedIn, contactValid.findUserContact, contact.searchFriends);
    router.post("/group-chat/add-new", auth.checkLoggedIn, groupChatValid.addNewGroup, groupChat.addNewGroup);

    return app.use("/", router);
};

module.exports = initRoutes;
