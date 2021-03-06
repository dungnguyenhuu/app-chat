import multer from "multer";
import { appConfig } from "./../config/appConfig";
import { transErrors, transSuccess } from "./../../lang/vi";
import uuidv4 from "uuid/v4";
import { user } from "./../services/index";
import { validationResult } from "express-validator/check";


let storageAvatar = multer.diskStorage({
    destination: (req, file, callback) => {
        // callback(error, seccess);
        callback(null, appConfig.avatar_directory);
    },
    filename: (req, file, callback) => {
        let math = appConfig.avatar_type;
        if (math.indexOf(file.mimetype) === -1) {
            return callback(transErrors.avatar_type, null);
        };

        let avatarName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
        callback(null, avatarName);
    }
});

let avatartUploadFile = multer({
    storage: storageAvatar,
    limits: {fileSize: appConfig.avatar_limit_size},
}).single("avatar");

// cập nhập ảnh đại diện
let updateAvatar = (req, res) => {
    avatartUploadFile(req, res, async (error) => {
        if(error) {
            if(error.message) {
                return res.status(500).send(transErrors.avatar_size);
            }
            return res.status(500).send(error);
        }
        try {
            let  updateUserItem = {
                avatar: req.file.filename,
                updateAt: Date.now,
            };

            // cập nhập user
            let userUpdate = await user.updateUser(req.user._id, updateUserItem);

<<<<<<< HEAD
            // xóa ảnh user cũ thì mở comment còn giờ thì chưa xóa
            // if(userUpdate.avatar !== "avatar-default.jpg") {
            //     await fsExtra.remove(`${appConfig.avatar_directory}/${userUpdate.avatar}`);
            // };
=======
            // xóa ảnh user cũ
                // if(userUpdate.avatar !== "avatar-default.jpg") {
                //     await fsExtra.remove(`${appConfig.avatar_directory}/${userUpdate.avatar}`);
                // };
>>>>>>> revert1

            // kết quả trả về khi cập nhập thành công
            let result = {
                message: transSuccess.user_info_updated,
                imageSrc: `/images/users/${req.file.filename}`,
            };
            return res.status(200).send(result);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    });
};

// cập nhập thông tin user
let updateInfo = async (req, res) => {
    let errorArr = [];
    
    // kiểm tra dữ liệu nhập có lỗi
    let validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()){
        let errors = Object.values(validationErrors.mapped());

        // lấy thông báo lỗi đưa vào mảng errorArr
        errors.forEach(item => {
            errorArr.push(item.msg);
        });
        
        return res.status(500).send(errorArr);
    }

    try {
        let updateUserItem = req.body;
        await user.updateUser(req.user._id, updateUserItem);

        let result = {
            message: transSuccess.user_info_updated,
        };
        return res.status(200).send(result);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};

// Cập nhập password
let updatePass = async (req, res) => {
    let errorArr = [];

    // kiểm tra dữ liệu nhập có lỗi
    let validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()){
        let errors = Object.values(validationErrors.mapped());

        // lấy thông báo lỗi đưa vào mảng errorArr
        errors.forEach(item => {
            errorArr.push(item.msg);
        });
        return res.status(500).send(errorArr);
    }

    try {
        let updateUserItem = req.body;
        // req.body = {
        //     currentPass: 'Aa@12345',
        //     newPass: 'Aa@12345',
        //     comfirmPass: 'Aa@12345'
        //   }
        // cập nhập password bên service
        await user.updatePass(req.user.id, updateUserItem);

        let result = {
            message: transSuccess.user_pass_updated,
        };
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send(error);
    }
};

module.exports = {
    updateAvatar: updateAvatar,
    updateInfo: updateInfo,
    updatePass: updatePass,
}
