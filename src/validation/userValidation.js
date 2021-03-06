import {check} from "express-validator/check";
import {transValidation} from "./../../lang/vi";

let updateInfo = [
    check("username", transValidation.upadate_username)
        .optional()
        .isLength({min: 3, max: 17}),
        // .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/),
    check("gender", transValidation.upadate_gender)
        .optional()
        .isIn(["male", "female"]),
    check("address", transValidation.upadate_address)
        .optional()
        .isLength({min: 3, max: 17}),
    check("phone", transValidation.upadate_phone)
        .optional()
        .matches(/^(0)[0-9]{9,10}$/),
];

let updatePass = [
    check("currentPass", transValidation.password_incorrect)
        .isLength({min:8})
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
    check("newPass", transValidation.password_incorrect)
        .isLength({min:8})
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
    check("comfirmPass", transValidation.password_comfirmation_incorrect)
        .custom((value, {req}) => {
            return value === req.body.newPass;
        }),
];

module.exports = {
    updateInfo: updateInfo,
    updatePass: updatePass,
}
