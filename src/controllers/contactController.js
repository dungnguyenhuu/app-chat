import {validationResult} from "express-validator/check";
import {contact} from "./../services/index";

// tìm kiếm người dùng để kết bạn
let findUsersContact = async (req, res) => {
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
        let currentUserId = req.user._id;
        let keyword = req.params.keyword;
        
        // gọi findUsersContact() ở servive
        let users = await contact.findUsersContact(currentUserId, keyword);
        return res.render("main/contact/sections/_findUserAddContact.ejs", {users});
    } catch (error) {
        return res.status(500).send(error);        
    }
};

// thêm mới 1 liên lạc
let addNew = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let contactId = req.body.uid;

        // gọi addNew() ở servive
        let newContact = await contact.addNew(currentUserId, contactId);
        return res.status(200).send({success: !!newContact});
    } catch (error) {
        return res.status(500).send(error);        
    }
};

// hủy bỏ yêu cầu kết bạn (xóa contact)
let removeRequestContact = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let contactId = req.body.uid;

        // gọi removeRequestContact() ở servive
        let removeReq = await contact.removeRequestContact(currentUserId, contactId);
        return res.status(200).send({success: !!removeReq});
    } catch (error) {
        return res.status(500).send(error);        
    }
}; 

module.exports = {
    findUsersContact: findUsersContact,
    addNew: addNew,
    removeRequestContact: removeRequestContact,
};
