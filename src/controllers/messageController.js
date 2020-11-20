import { validationResult } from "express-validator/check";
import { message } from "./../services/index";
import multer from "multer";
import { appConfig } from "./../config/appConfig";
import { transErrors, transSuccess } from "./../../lang/vi";
import fsExtra from "fs-extra";
import ejs from "ejs";
import { lastItemOfArray, convertTimestamp, bufferToBase64 } from "./../helpers/clientHelper";
import { promisify } from "util";

/* Make ejs function renderFile available with async await */
const renderFile = promisify(ejs.renderFile).bind(ejs);

// xử lý text emoji chat
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

// xử lý image chat
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
            
            res.status(200).send({message: newMessage});
        } catch (error) {
            console.log(error);
            console.log("loi o addnewImage messageController");
            return res.status(500).send(error);
        }
    });
    
};

// xử lý attachment chat
let storageAttachmentChat = multer.diskStorage({
    destination: (req, file, callback) => {
        // callback(error, seccess);
        callback(null, appConfig.attachment_message_directory);
    },
    filename: (req, file, callback) => {
        let attachmentName = `${file.originalname}`;
        callback(null, attachmentName);
    }
});

let attachmentMessageUploadFile = multer({
    storage: storageAttachmentChat,
    limits: {fileSize: appConfig.attachment_message_limit_size},
}).single("my-attachment-chat");

let addNewAttachment = (req, res) => {
    attachmentMessageUploadFile(req, res, async (error) => {
        if(error) {
            if(error.message) {
                return res.status(500).send(transErrors.attachment_message_size);
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
    
            let newMessage = await message.addNewattAchment(sender, receiverId, messageVal, isChatGroup);
            // remove attachment, vì đã lưu trong mongoDb
            await fsExtra.remove(`${appConfig.attachment_message_directory}/${newMessage.file.fileName}`);
            
            res.status(200).send({message: newMessage});
        } catch (error) {
            console.log(error);
            console.log("loi o addnewAttachment messageController");
            return res.status(500).send(error);
        }
    });
    
};

// lấy thêm contact
let readMoreAllChat =  async (req, res) => {
    try {
        // số user đã lấy
        let skipPersonal = +(req.query.skipPersonal);
        let skipGroup = +(req.query.skipGroup)

        // lấy thêm user
        let newAllConversations = await message.readMoreAllChat(req.user._id, skipPersonal, skipGroup);
        
        let dataToRender = {
            newAllConversations: newAllConversations,
            lastItemOfArray: lastItemOfArray,
            convertTimestamp: convertTimestamp,
            bufferToBase64: bufferToBase64,
            user: req.user,
        }
        let leftSideData = await renderFile("src/views/main/readMoreConversation/_leftSide.ejs", dataToRender);
        let rightSideData = await renderFile("src/views/main/readMoreConversation/_rightSide.ejs", dataToRender);
        let imageModalData = await renderFile("src/views/main/readMoreConversation/_imageModal.ejs", dataToRender);
        let attachmentModalData = await renderFile("src/views/main/readMoreConversation/_attachmentModal.ejs", dataToRender);

        return res.status(200).send({
            leftSideData: leftSideData,
            rightSideData: rightSideData,
            imageModalData: imageModalData,
            attachmentModalData: attachmentModalData,
        });
    } catch (error) {
        console.log("loi o messageController");
        console.log(error);
        return res.status(500).send(error);
    }
};

let readMoreUserChat = async (req, res) => {
    try {
        // số user đã lấy
        let skipPersonal = +(req.query.skipPersonal);

        // lấy thêm user
        let newUserConversations = await message.readMoreUserChat(req.user._id, skipPersonal);
        
        let dataToRender = {
            newAllConversations: newUserConversations,
            lastItemOfArray: lastItemOfArray,
            convertTimestamp: convertTimestamp,
            bufferToBase64: bufferToBase64,
            user: req.user,
        }
        let leftSideData = await renderFile("src/views/main/readMoreConversation/_leftSide.ejs", dataToRender);
        let rightSideData = await renderFile("src/views/main/readMoreConversation/_rightSide.ejs", dataToRender);
        let imageModalData = await renderFile("src/views/main/readMoreConversation/_imageModal.ejs", dataToRender);
        let attachmentModalData = await renderFile("src/views/main/readMoreConversation/_attachmentModal.ejs", dataToRender);

        return res.status(200).send({
            leftSideData: leftSideData,
            rightSideData: rightSideData,
            imageModalData: imageModalData,
            attachmentModalData: attachmentModalData,
        });
    } catch (error) {
        console.log("loi o messageController");
        console.log(error);
        return res.status(500).send(error);
    }
};

let readMoreGroupChat = async (req, res) => {
    try {
        // số user đã lấy
        let skipGroup = +(req.query.skipGroup)

        // lấy thêm user
        let groupAllConversations = await message.readMoreGroupChat(req.user._id, skipGroup);
        
        let dataToRender = {
            newAllConversations: groupAllConversations,
            lastItemOfArray: lastItemOfArray,
            convertTimestamp: convertTimestamp,
            bufferToBase64: bufferToBase64,
            user: req.user,
        }
        let leftSideData = await renderFile("src/views/main/readMoreConversation/_leftSide.ejs", dataToRender);
        let rightSideData = await renderFile("src/views/main/readMoreConversation/_rightSide.ejs", dataToRender);
        let imageModalData = await renderFile("src/views/main/readMoreConversation/_imageModal.ejs", dataToRender);
        let attachmentModalData = await renderFile("src/views/main/readMoreConversation/_attachmentModal.ejs", dataToRender);

        return res.status(200).send({
            leftSideData: leftSideData,
            rightSideData: rightSideData,
            imageModalData: imageModalData,
            attachmentModalData: attachmentModalData,
        });
    } catch (error) {
        console.log("loi o messageController");
        console.log(error);
        return res.status(500).send(error);
    }
};

module.exports = {
    addNewTextEmoji: addNewTextEmoji,
    addNewImage: addNewImage,
    addNewAttachment: addNewAttachment,
    readMoreAllChat: readMoreAllChat,
    readMoreUserChat: readMoreUserChat,
    readMoreGroupChat: readMoreGroupChat,
};
