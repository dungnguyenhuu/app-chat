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

// hủy bỏ liên lạc bên tab danh bạ
let removeContact = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let contactId = req.body.uid;

        // console.log(contactId);
        // console.log(currentUserId);
        // gọi removeContact() ở servive
        let removeContact = await contact.removeContact(currentUserId, contactId);
        return res.status(200).send({success: !!removeContact});
    } catch (error) {
        console.log("loi o removerContact contactController");
        console.log(error);
        return res.status(500).send(error);        
    }
};

// hủy bỏ yêu cầu đang chờ xác nhận
let removeRequestContactSent = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let contactId = req.body.uid;

        // gọi removeRequestContactSent() ở servive
        let removeReq = await contact.removeRequestContactSent(currentUserId, contactId);
        return res.status(200).send({success: !!removeReq});
    } catch (error) {
        return res.status(500).send(error);        
    }
}; 

// hủy bỏ yêu cầu kết bạn
let removeRequestContactRecevied = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let contactId = req.body.uid;

        // gọi removeRequestContactSent() ở servive
        let removeReq = await contact.removeRequestContactRecevied(currentUserId, contactId);
        return res.status(200).send({success: !!removeReq});
    } catch (error) {
        return res.status(500).send(error);        
    }
};

let approveRequestContactRecevied = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let contactId = req.body.uid;

        // gọi approveRequestContactSent() ở servive
        let approveReq = await contact.approveRequestContactRecevied(currentUserId, contactId);
        return res.status(200).send({success: !!approveReq});
    } catch (error) {
        return res.status(500).send(error);        
    }
};

// lấy thêm user trong contact bên tab danh bạ
let readMoreContacts = async (req, res) => {
    try {
        // số user đã lấy
        let skipNumberContact = +(req.query.skipNumber);

        // lấy thêm user
        let newContactUsers = await contact.readMoreContacts(req.user._id, skipNumberContact);
        return res.status(200).send(newContactUsers);
    } catch (error) {
        console.log("loi o contactController");
        console.log(error);
        return res.status(500).send(error);
    }
};

// lấy thêm user trong contact bên tab đang chờ xác nhận
let readMoreContactsSent = async (req, res) => {
    try {
        // số user đã lấy
        let skipNumberContactSent = +(req.query.skipNumber);
        // console.log(skipNumberContactSent);
        // lấy thêm user
        let newContactSent = await contact.readMoreContactsSent(req.user._id, skipNumberContactSent);
        // console.log(newContactSent);
        return res.status(200).send(newContactSent);
    } catch (error) {
        console.log("loi o readMoreContactsSent contactController");
        console.log(error);
        return res.status(500).send(error);
    }
};

// lấy thêm user trong contact bên tab yêu cầu kết bạn
let readMoreContactsReceived = async (req, res) => {
    try {
        // số user đã lấy
        let skipNumberContactReceived = +(req.query.skipNumber);
        // console.log(skipNumberContactReceived);
        // lấy thêm user
        let newContactReceived = await contact.readMoreContactsReceived(req.user._id, skipNumberContactReceived);
        // console.log(newContactReceived);
        return res.status(200).send(newContactReceived);
    } catch (error) {
        console.log("loi o readMoreContactsReceived contactController");
        console.log(error);
        return res.status(500).send(error);
    }
};

module.exports = {
    findUsersContact: findUsersContact,
    addNew: addNew,
    removeContact: removeContact,
    removeRequestContactSent: removeRequestContactSent,
    removeRequestContactRecevied: removeRequestContactRecevied,
    approveRequestContactRecevied: approveRequestContactRecevied,
    readMoreContacts: readMoreContacts,
    readMoreContactsSent: readMoreContactsSent,
    readMoreContactsReceived: readMoreContactsReceived,
};
