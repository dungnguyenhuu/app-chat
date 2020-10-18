import passport from "passport";
import passportLocal from "passport-local";
import UserModel from "./../../model/userModel";
import {transErrors, transSuccess} from "./../../../lang/vi";

let LocalStrategy = passportLocal.Strategy;

/* Valid user account type: local */
let initPassportLocal = () => {
    // kiểm tra thông tin đăng nhập
    passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
    }, async (req, email, password, done) => {
        try {
            let user = await UserModel.findByEmail(email);
            if (!user) {
                return done(null, false, req.flash("errors", transErrors.login_failed));
            }
            if (!user.local.isActive) {
                return done(null, false, req.flash("errors", transErrors.account_not_active));
            }

            let checkPassword = user.comparePassword(password);
            if(!checkPassword) {
                return done(null, false, req.flash("errors", transErrors.login_failed));
            }

            return done(null, user, req.flash("success", transSuccess.login_success(user.username)));
        } catch (error) {
            return done(null, false, req.flash("errors", transErrors.server_error));
        }
    }));

    // ghi thông tin user vào session
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    // lấy thông tin của user từ session
    passport.deserializeUser((id, done) => {
        UserModel.findUserById(id)
            .then(user => {
                // console.log(user._id);
                return done(null, user);
            })
            .catch(error => {
                return done(error, null);
            });
    });
};

module.exports = initPassportLocal;
