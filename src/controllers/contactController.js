import {contact} from "./../services/index";

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
        
        let users = await contact.findUsersContact(currentUserId, keyword);
        return res.render("main/contact/sections/_findUserAddContact.ejs", {users});
    } catch (error) {
        return res.status(500).send(error);        
    }
};

module.exports = {
    findUsersContact: findUsersContact,
};
