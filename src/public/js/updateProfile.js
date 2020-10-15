let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;
let originUserInfo = {};

function updateProfle () {
    // chọn ảnh đại diện
    $("#input-change-avatar").bind("change", function () {
        let fileData = $(this).prop("files")[0];
        let math = ["image/png", "image/jpg", "image/jpeg"];
        let limit = 1048576; // 1MB

        // kiểm tra đúng định dạng ảnh
        if ($.inArray(fileData.type, math) === -1){
            alertify.notify("Kiểu file không hợp lệ, chỉ chấp nhận jpg, png.", "error", 5);
            $(this).val(null);
            return false;
        }

        // kiểm tra kích thước ảnh
        if (fileData.size > limit){
            alertify.notify("Ảnh upload tối đa 1MB", "error", 5);
            $(this).val(null);
            return false;
        }

        // thực hiện upload ảnh
        if (typeof (FileReader) != "undefined"){
            let imagePreview = $("#image-edit-profile");
            imagePreview.empty();

            // cấu hình các thuộc tính ảnh
            let fileReader = new FileReader();
            fileReader.onload = function (element) {
                $("<img>", {
                    "src": element.target.result,
                    "class": "avatar img-circle",
                    "id": "user-modal-avatar",
                    "alt": "avatar",
                }).appendTo(imagePreview);
            };

            // hiển thị ảnh
            imagePreview.show();
            fileReader.readAsDataURL(fileData);

            // lưu lại ảnh
            let formData = new FormData();
            formData.append("avatar", fileData);
            userAvatar = formData;
        } else {
            alertify.notify("Trình duyệt của bản không hỗ trợ FileReader", "error", 5);

        }
    });

    // nhập tên username
    $("#input-change-username").bind("change", function () {
        let username = $(this).val();
        // let regexUsername = new RegExp("^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$");

        if(username.length < 3 || username.length > 17){
            alertify.notify("Username giới hạn trong khoảng 3 - 17 kí tự", "error", 5);
            $(this).val(originUserInfo.username);
            // xóa đi tránh lỗi khi nhập 2 lần liên tiếp
            delete userInfo.username;
            return false;
        }
        userInfo.username = username;
    });

    // chọn giới tính nam
    $("#input-change-gender-male").bind("click", function () {
        let gender = $(this).val();

        if(gender !== "male") {
            alertify.notify("Bạn đã sửa trường giới tính của bạn?", "error", 5);
            $(this).val(originUserInfo.gender);
            // xóa đi tránh lỗi khi nhập 2 lần liên tiếp
            delete userInfo.gender;
            return false;
        }
        userInfo.gender = gender;
    });

    // chọn giới tính nữ
    $("#input-change-gender-female").bind("click", function () {
        let gender = $(this).val();

        if(gender !== "female") {
            alertify.notify("Bạn đã sửa trường giới tính của bạn?", "error", 5);
            $(this).val(originUserInfo.gender);
            // xóa đi tránh lỗi khi nhập 2 lần liên tiếp
            delete userInfo.gender;
            return false;
        }
        userInfo.gender = gender;
    });

    // nhập số điện thoại
    $("#input-change-phone").bind("change", function () {
        let phone = $(this).val();
        let regexPhone = new RegExp("^(0)[0-9]{9,10}$");
        if(!regexPhone.test(phone)) {
            alertify.notify("Số điện thoại Việt Nam bắt đầu bằng số 0, giới hạn trong khoảng 10-11 kí tự", "error", 5);
            $(this).val(originUserInfo.phone);
            // xóa đi tránh lỗi khi nhập 2 lần liên tiếp
            delete userInfo.phone;
            return false;
        }
        userInfo.phone = phone;
    });

    // nhập số địa chỉ
    $("#input-change-address").bind("change", function () {
        let address = $(this).val();

        if(address.length < 3 || address.length > 30) {
            alertify.notify("Địa chỉ giới hạn trong khoảng 3 - 30 kí tự", "error", 5);
            $(this).val(originUserInfo.address);
            // xóa đi tránh lỗi khi nhập 2 lần liên tiếp
            delete userInfo.address;
            return false;
        }
        userInfo.phone = $(this).val();
    });

}

function callUpdateAvatar() {
    $.ajax({
        url: "/profile/update-avatar",
        type: "put",
        cache: false,
        contentType: false,
        processData: false,
        data: userAvatar,
        success: function (result) { 
            // console.log(result);

            // thông báo thành công
            $(".user-modal-alert-success").find("span").text(result.message);
            $(".user-modal-alert-success").css("display", "block");
            // cập nhập ảnh đại diện trên navbar
            $("#navbar-avatar").attr("src", result.imageSrc);
            originAvatarSrc = result.imageSrc;
            $("#input-btn-reset-user").click();
         },
        error: function (error) { 
            // hiển thị lỗi
            $(".user-modal-alert-error").find("span").text(error.responseText);
            $(".user-modal-alert-error").css("display", "block");

            // reset
            $("#input-btn-reset-user").click();
         },
    });
}

function callUpdateUserInfo() {
    $.ajax({
        url: "/profile/update-info",
        type: "put",
        data: userInfo,
        success: function (result) { 
            // console.log(result);
            // thông báo thành công
            $(".user-modal-alert-success").find("span").text(result.message);
            $(".user-modal-alert-success").css("display", "block");
            
            // cập nhập lại thông tin mới thành thông tin hiện tại
            originUserInfo = Object.assign(originUserInfo, userInfo);    
            
            // cập nhập tên trên navbar
            $("#navbar-username").text(originUserInfo.username);
            
            $("#input-btn-reset-user").click();
         },
        error: function (error) { 
            // hiển thị lỗi
            $(".user-modal-alert-error").find("span").text(error.responseText);
            $(".user-modal-alert-error").css("display", "block");

            // reset
            $("#input-btn-reset-user").click();
         },
    });
}

$(document).ready(function () {
   
    originAvatarSrc = $("#user-modal-avatar").attr("src");
    originUserInfo = {
        username: $("#input-change-username").val(),
        gender: ($("#input-change-gender-male").is(":checked")) ? $("#input-change-gender-male").val() : $("#input-change-gender-female").val(),
        address: $("#input-change-address").val(),
        phone: $("#input-change-phone").val(),
    };

    // Cập nhập thông tin user
    updateProfle();

    // click btn lưu
    $("#input-btn-update-user").bind("click", function () {
        if ($.isEmptyObject(userInfo) && !userAvatar){
            alertify.notify("Bạn chưa thay đổi thông tin", "error", 5);
            return false;
        }

        // khi thay đổi ảnh
        if (userAvatar){
            callUpdateAvatar();
        }

        // khi thay đổi thông tin
        if(!$.isEmptyObject(originUserInfo)){
            callUpdateUserInfo();
        }
    });

    // click hủy bỏ
    $("#input-btn-reset-user").bind("click", function () {
        userAvatar = null;
        userInfo = {};
        $("#input-change-avatar").val(null);
        $("#user-modal-avatar").attr("src", originAvatarSrc);

        $("#input-change-username").val(originUserInfo.username);
        (originUserInfo.gender === "male") ? $("#input-change-gender-male").click() : $("#input-change-gender-female").click();
        $("#input-change-address").val(originUserInfo.address);
        $("#input-change-phone").val(originUserInfo.phone);
    });
});
