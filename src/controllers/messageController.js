import { validationResult } from "express-validator/check";
import { message } from "./../services/index";

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

module.exports = {
    addNewTextEmoji: addNewTextEmoji,
};
