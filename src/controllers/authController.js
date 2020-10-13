import {validationResult} from "express-validator/check";
import {auth} from "./../services/index";

let getLoginRegister = (req, res) => {
    return res.render("auth/master", {
        errors: req.flash("errors"),
        success: req.flash("success"),
    });
};

let postRegister = async (req, res) => {
    let errorArr = [];
    let successArr = [];

    // kiểm tra dữ liệu nhập có lỗi
    let validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()){
        let errors = Object.values(validationErrors.mapped());

        // lấy thông báo lỗi đưa vào mảng errorArr
        errors.forEach(item => {
            errorArr.push(item.msg);
        });
        
        req.flash("errors", errorArr);
        // chuyển hướng lại trang đăng ký
        return res.redirect("/login-register");
    } else {
        try {
            let createUserSucces = await auth.register(req.body.email, req.body.gender, req.body.password);
            successArr.push(createUserSucces);
            req.flash("success", successArr);
            // chuyển hướng lại trang đăng ký cùng với succes
            return res.redirect("/login-register");
        } catch (error) {
            errorArr.push(error);
            req.flash("errors", errorArr);
            // chuyển hướng lại trang đăng ký cùng với errors
            return res.redirect("/login-register");
        }
    }
};

let getLogout = (req, res) => {
    // do somthing
};

module.exports = {
    getLoginRegister: getLoginRegister,
    getLogout: getLogout,
    postRegister: postRegister
};
