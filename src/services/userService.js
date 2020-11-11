import UserModel from "./../model/userModel";
import {transErrors} from "./../../lang/vi"
// import bcrypt from "bcrypt";

/* cập nhập thông tin người dùng 
    @param {userId} id 
    @param {data update} item
*/
let updateUser = (id, item) => {
    return UserModel.updateUser(id, item);
};

/* cập nhập password 
    @param {userId} id 
    @param {data update} dataUpdate
*/
let updatePass = (id, dataUpdate) => {
    return new Promise (async (resolve, reject) => {
<<<<<<< HEAD
        let currentUser = await UserModel.findUserByIdForUpdatePass(id);
=======
        let currentUser = await UserModel.findUserByIdToUpdatePass(id);
>>>>>>> revert1
        if(!currentUser){
            return reject.apply(transErrors.account_undefine);
        }

        // let checkPass = await currentUser.comparePassword(dataUpdate.currentPass);
        // kiểm tra mật khẩu
        let checkPass = currentUser.comparePassword(dataUpdate.currentPass);
        if (!checkPass) {
            return reject(transErrors.user_current_pass_failed);
        }

        // let satl = bcrypt.genSaltSync(saltRounds);
        await UserModel.updatePass(id, dataUpdate.newPass);

        resolve(true);
    });
};

module.exports = {
    updateUser: updateUser,
    updatePass: updatePass,
};
