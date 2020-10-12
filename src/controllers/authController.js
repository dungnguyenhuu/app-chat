let getLoginRegister = (req, res) => {
    return res.render("auth/master");
};

let getLogout = (req, res) => {
    // do somthing
};

module.exports = {
    getLoginRegister: getLoginRegister,
    getLogout: getLogout
};
