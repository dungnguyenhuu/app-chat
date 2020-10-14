import UserModel from "./../model/userModel";

/* cập nhập thông tin người dùng */

let updateUser = (id, item) => {
    return UserModel.updateUser(id, item);
};

module.exports = {
    updateUser: updateUser,
};
