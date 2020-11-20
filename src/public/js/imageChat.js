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
        let isChatGroup = false;
        // lưu lại ảnh
        let messageFormData = new FormData();
        messageFormData.append("my-image-chat", fileData);
        messageFormData.append("uid", targetId);

        if($(this).hasClass("chat-in-group")) {
            messageFormData.append("isChatGroup", true);
            isChatGroup = true;
        }
    
        $.ajax({
            url: "/message/add-new-image",
            type: "post",
            cache: false,
            contentType: false,
            processData: false,
            data: messageFormData,
            success: function (data) { 
                // console.log(data);
                let dataToEmit = {
                    message: data.message,
                };
                // 1. xử lý tin nhắn từ controller trước khi hiện ra
                let messageOfMe = $(`<div class="bubble me bubble-image-file" data-mess-id="${data._id}"></div>`);
                let imageChat = `
                    <img src="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}" 
                    class="show-image-chat">`;

                if(isChatGroup) {
                    // let senderAvatar = `
                        // <img src="images/users/${data.message.sender.avatar}" alt="" 
                        // class="avatar-small" title="${data.message.sender.name}">`;
                    // messageOfMe.html(`${senderAvatar} ${imageChat}`);
                    // increaseNumberMessageGroup(divId);
                    dataToEmit.groupId = targetId;
                } else {
                    // messageOfMe.html(imageChat);
                    dataToEmit.contactId = targetId;
                }
                messageOfMe.html(imageChat);

                // 2. thêm vào cuối màn hình chat
                $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
                nineScrollRight(divId);

                // 4. cập nhập vùng preview tin nhắn và time bên leftside
                $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime")
                    .html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
                $(`.person[data-chat=${divId}]`).find("span.preview").html("Hình ảnh...");

                // 5. đưa contact lên đầu bên leftside
                $(`.person[data-chat=${divId}]`).on("leftside.moveConversationToTheTop", function() {
                    let dataToMove = $(this).parent();
                    $(this).closest("ul").prepend(dataToMove);
                    $(this).off("leftside.moveConversationToTheTop");
                });
                $(`.person[data-chat=${divId}]`).trigger("leftside.moveConversationToTheTop");

                // 6. emit realtime
                socket.emit("chat-image", dataToEmit);

                // 9. add to modal image
                let imageChatToAddModal = `
                    <img src="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}" 
                        class="show-image-chat">`;
                $(`#imagesModal_${divId}`).find("div.all-images").append(imageChatToAddModal);
            },
            error: function (error) { 
                alertify.notify(error.responseText, "error", 5);
            },
        });

    });
}

$(document).ready(function () {
    socket.on("response-chat-image", function(response) {
        let divId = "";

        // 1. xử lý tin nhắn từ controller trước khi hiện ra
        let messageOfYou = $(`<div class="bubble you bubble-image-file" data-mess-id="${response.message._id}"></div>`);
        let imageChat = `
            <img src="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}" 
                class="show-image-chat">`;
        

        if(response.currentGroupId) {
            let senderAvatar = `
                <img src="images/users/${response.message.sender.avatar}" alt="" 
                    class="avatar-small" title="${response.message.sender.name}">`;
            messageOfYou.html(`${senderAvatar} ${imageChat}`);
            
            divId = response.currentGroupId;
            // console.log(`group: ${divId}`);
        } else {
            /* messageOfYou.html(imageChat); */
            divId = response.currentUserId;
            messageOfYou.html(imageChat);
        }
        
        // 2. thêm vào cuối màn hình chat
        if(response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
            $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
            nineScrollRight(divId);
            // increaseNumberMessageGroup(divId);
            $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime")
                .html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());
        }

        // 4. cập nhập vùng preview tin nhắn và time bên leftside
        $(`.person[data-chat=${divId}]`).find("span.time")
            .html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat=${divId}]`).find("span.preview").html("Hình ảnh...");

        // 5. đưa contact lên đầu bên leftside
        $(`.person[data-chat=${divId}]`).on("leftside.moveConversationToTheTop", function() {
            let dataToMove = $(this).parent();
            $(this).closest("ul").prepend(dataToMove);
            $(this).off("leftside.moveConversationToTheTop");
        });
        $(`.person[data-chat=${divId}]`).trigger("leftside.moveConversationToTheTop");

        // 9. add to modal image
        if(response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
            let imageChatToAddModal = `
                <img src="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}" 
                    class="show-image-chat">`;
            $(`#imagesModal_${divId}`).find("div.all-images").append(imageChatToAddModal);
        }
    })
});
