export const transValidation = {
    email_incorrect: "Email phải có dạng example@gmail.com!",
    gender_incorrect: "Bạn đã sửa trường giới tính của bạn?",
    password_incorrect: "Mật khẩu cần chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữa thường, chữ số và ký tự. VD: Aa@12345",
    password_comfirmation_incorrect: "Nhập lại mật khẩu chưa chính xác!!",
    upadate_username: "Username giới hạn trong khoảng 3 - 17 kí tự ",
    upadate_gender: "Bạn đã sửa trường giới tính của bạn?",
    upadate_address: "Địa chỉ giới hạn trong khoảng 3 - 30 kí tự",
    upadate_phone: "Số điện thoại Việt Nam bắt đầu bằng số 0, giới hạn trong khoảng 10-11 kí tự",
    keyword_find_user: "Lỗi từ khóa tìm kiếm, không được có kí tự đặc biệt",
    message_text_emoji_incorrect: "Tin nhắn không hợp lệ, tối thiểu 1 kí tự, tối đa 400 kí tự",
};

export const transErrors = {
    account_in_use: "Email này đã được sử dụng.",
    account_remove: "Tài khoản đã bị xóa",
    account_not_active: "Email đã được đăng ký nhưng chưa được kích hoạt. Kiểm tra lại email",
    account_undefine: "Tài khoản không tồn tại",
    login_failed: "Sai tài khoản hoặc mật khẩu.",
    server_error: "Có lỗi ở phía máy chủ",
    avatar_type: "Kiểu file không hợp lệ, chỉ chấp nhận jpg, png.",
    avatar_size: "Ảnh upload tối đa 1MB",
    user_current_pass_failed: "Mật khẩu hiện tại không chính xác",
    conversation_not_found: "Cuộc trò chuyện không tồn tại",

    image_message_type: "Kiểu file không hợp lệ, chỉ chấp nhận jpg, png.",
    image_message_size: "Ảnh upload tối đa 1MB",

    attachment_message_size: "Tệp đính kèm upload tối đa 1MB",
};

export const transSuccess = {
    userCreated: (userEmail) => {
        return `Tài khoản <strong>${userEmail}</strong> đã được tạo.`;
    },
    login_success: (username) => {
        return `${username} đăng nhập thành công.`
    },
    logout_success: "Đăng xuất thành công",
    user_info_updated: "Cập nhập thông tin người dùng thành công",
    user_pass_updated: "Cập nhâp mật khẩu thành công",
};
