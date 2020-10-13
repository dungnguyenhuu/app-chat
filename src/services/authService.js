import UserModel from "./../model/userModel";
// import bcrypt from "bcrypt"; mã hóa password
import uuidv4 from "uuid/v4";
import {transErrors, transSuccess} from "./../../lang/vi";

// let saltRounds = 7;

let register =   (email, gender, password) => {
    return new Promise( async (resolve, reject) => {
        let userByEmail = await UserModel.findByEmail(email);
        if(userByEmail){ // lỗi tài khoản đã tồn tại
            if (userByEmail.deletedAt != null){//lỗi tài khoản bị xóa
                return reject(transErrors.account_remove);
            }
            if (!userByEmail.local.isActive ){//lỗi tài khoản chưa kích hoạt
                return reject(transErrors.account_not_active);
            }
            return reject(transErrors.account_in_use);
        }
    
        // let salt = bcrypt.genSaltSync(saltRounds);
        let userItem = {
            username: email.split("@")[0],
            gender: gender,
            local: {
                email: email,
                // password: bcrypt.hasSync(password, salt),
                password: password,
                verifyToken: uuidv4(),
            },
        };
    
        let user = await UserModel.createNew(userItem);
        resolve(transSuccess.userCreated(user.local.email));
    });
};

module.exports = {
    register: register
};
