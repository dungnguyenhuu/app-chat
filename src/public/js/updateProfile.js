let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;

function updateProfle () {
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

    $("#input-change-username").bind("change", function () {
        userInfo.username = $(this).val();
    });

    $("#input-change-gender-male").bind("click", function () {
        userInfo.gender = $(this).val();
    });

    $("#input-change-gender-female").bind("click", function () {
        userInfo.gender = $(this).val();
    });

    $("#input-change-address").bind("change", function () {
        userInfo.address = $(this).val();
    });

    $("#input-change-phone").bind("change", function () {
        userInfo.phone = $(this).val();
    });

}

$(document).ready(function () {
    updateProfle();

    originAvatarSrc = $("#user-modal-avatar").attr("src");

    $("#input-btn-update-user").bind("click", function () {
        if ($.isEmptyObject(userInfo) && !userAvatar){
            alertify.notify("Bạn chưa thay đổi thông tin", "error", 5);
            return false;
        }

        $.ajax({
            url: "/user/update-avatar",
            type: "put",
            cache: false,
            contentType: false,
            processData: false,
            data: userAvatar,
            success: function (result) {  },
            error: function (error) {  },
        });
        // console.log(userAvatar);
        // console.log(userInfo);
    });

    $("#input-btn-reset-user").bind("click", function () {
        userAvatar = null;
        userInfo = {};
        $("#user-modal-avatar").attr("src", originAvatarSrc);
    });

});
