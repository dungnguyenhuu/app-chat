function imageChat(divId) {
    $(`#image-chat-${divId}`).unbind("change").on("change", function() {
        // chọn ảnh 

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

        let targetId = $(this).data("chat");
        // lưu lại ảnh
        let messageFormData = new FormData();
        messageFormData.append("my-image-chat", fileData);
        messageFormData.append("uid", targetId);

        if($(this).hasClass("chat-in-group")) {
            messageFormData.append("isChatGroup", true);
        }
    
        $.ajax({
            url: "/message/add-new-image",
            type: "post",
            cache: false,
            contentType: false,
            processData: false,
            data: messageFormData,
            success: function (data) { 
                console.log(data);
            },
            error: function (error) { 
                alertify.notify(error.responseText, "error", 5);
            },
        });

    });
}