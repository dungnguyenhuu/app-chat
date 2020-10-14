export const transValidation = {
    email_incorrect: "Email phải có dạng example@gamil.com!",
    gender_incorrect: "Bạn đã sửa trường giới tính của bạn?",
    password_incorrect: "Mật khẩu cần chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữa thường, chữ số và ký tự. VD: Aa@12345",
    password_comfirmation_incorrect: "Nhập lại mật khẩu chưa chính xác!!",
};

export const transErrors = {
    account_in_use: "Email này đã được sử dụng.",
    account_remove: "Tài khoản đã bị xóa",
    account_not_active: "Email đã được đăng ký nhưng chưa được kích hoạt. Kiểm tra lại email",
    login_failed: "Sai tài khoản hoặc mật khẩu.",
    server_error: "Có lỗi ở phía máy chủ",
};

export const transSuccess = {
    userCreated: (userEmail) => {
        return `Tài khoản <strong>${userEmail}</strong> đã được tạo.`;
    },
    login_success: (username) => {
        return `${username} đăng nhập thành công.`
    },
    logout_success: "Đăng xuất thành công."
};
