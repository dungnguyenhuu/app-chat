import { validationResult } from "express-validator/check";
import { message } from "./../services/index";
import multer from "multer";
import { appConfig } from "./../config/appConfig";
import { transErrors, transSuccess } from "./../../lang/vi";
import fsExtra from "fs-extra";

let addNewTextEmoji = async (req, res) => {
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
    };

    try {
        let sender = {
            id: req.user._id,
            name: req.user.username,
            avatar: req.user.avatar,
        };
        let receiverId = req.body.uid;
        let messageVal = req.body.messageVal;
        let isChatGroup = req.body.isChatGroup;

        let newMessage = await message.addNewTextEmoji(sender, receiverId, messageVal, isChatGroup);
        res.status(200).send(newMessage);
    } catch (error) {
        console.log(error);
        console.log("loi o addnewTextEmji messageController");
        return res.status(500).send(error);
    }
};

let storageImageChat = multer.diskStorage({
    destination: (req, file, callback) => {
        // callback(error, seccess);
        callback(null, appConfig.image_message_directory);
    },
    filename: (req, file, callback) => {
        let math = appConfig.image_message_type;
        if (math.indexOf(file.mimetype) === -1) {
            return callback(transErrors.image_message_type, null);
        };

        let imageName = `${file.originalname}`;
        callback(null, imageName);
    }
});

let imageMessageUploadFile = multer({
    storage: storageImageChat,
    limits: {fileSize: appConfig.image_message_limit_size},
}).single("my-image-chat");

let addNewImage =  (req, res) => {
    imageMessageUploadFile(req, res, async (error) => {
        if(error) {
            if(error.message) {
                return res.status(500).send(transErrors.image_message_size);
            }
            return res.status(500).send(error);
        }
        try {
            let sender = {
                id: req.user._id,
                name: req.user.username,
                avatar: req.user.avatar,
            };
            let receiverId = req.body.uid;
            let messageVal = req.file;
            let isChatGroup = req.body.isChatGroup;
    
            let newMessage = await message.addNewImage(sender, receiverId, messageVal, isChatGroup);
            // remove image, vì đã lưu trong mongoDb
            await fsExtra.remove(`${appConfig.image_message_directory}/${newMessage.file.fileName}`);
            
            res.status(200).send(newMessage);
        } catch (error) {
            console.log(error);
            console.log("loi o addnewImage messageController");
            return res.status(500).send(error);
        }
    });
    
};

module.exports = {
    addNewTextEmoji: addNewTextEmoji,
    addNewImage: addNewImage,
};
