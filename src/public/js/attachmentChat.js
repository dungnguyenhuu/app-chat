function attachmentChat(divId) {
    $(`#attachment-chat-${divId}`).unbind("change").on("change", function() {
        // chọn tệp đính kèm 
        let fileData = $(this).prop("files")[0];
        let limit = 1048576; // 1MB

        // kiểm tra kích thước tệp 
        if (fileData.size > limit){
            alertify.notify("Tệp upload tối đa 1MB", "error", 5);
            $(this).val(null);
            return false;
        }

        let targetId = $(this).data("chat");
        let isChatGroup = false;
        // lưu lại ảnh
        let messageFormData = new FormData();
        messageFormData.append("my-attachment-chat", fileData);
        messageFormData.append("uid", targetId);

        if($(this).hasClass("chat-in-group")) {
            messageFormData.append("isChatGroup", true);
            isChatGroup = true;
        }

        $.ajax({
            url: "/message/add-new-attachment",
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
                let messageOfMe = $(`<div class="bubble me bubble-attachment-file" data-mess-id="${data._id}"></div>`);
                let attachmentChat = `
                    <a href="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}" 
                        download="${data.message.file.fileName}">
                        ${data.message.file.fileName}
                    </a>`;

                if(isChatGroup) {
                    // let senderAvatar = `
                        // <img src="images/users/${data.message.sender.avatar}" alt="" 
                        // class="avatar-small" title="${data.message.sender.name}">`;
                    // messageOfMe.html(`${senderAvatar} ${attachmentChat}`);
                    // increaseNumberMessageGroup(divId);
                    dataToEmit.groupId = targetId;
                } else {
                    // messageOfMe.html(imageChat);
                    dataToEmit.contactId = targetId;
                }
                messageOfMe.html(attachmentChat);

                // 2. thêm vào cuối màn hình chat
                $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
                nineScrollRight(divId);

                // 4. cập nhập vùng preview tin nhắn và time bên leftside
                $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime")
                    .html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
                $(`.person[data-chat=${divId}]`).find("span.preview").html("Tệp đính kèm...");

                // 5. đưa contact lên đầu bên leftside
                $(`.person[data-chat=${divId}]`).on("leftside.moveConversationToTheTop", function() {
                    let dataToMove = $(this).parent();
                    $(this).closest("ul").prepend(dataToMove);
                    $(this).off("leftside.moveConversationToTheTop");
                });
                $(`.person[data-chat=${divId}]`).trigger("leftside.moveConversationToTheTop");

                // 6. emit realtime
                socket.emit("chat-attachment", dataToEmit);

                // 9. add to modal image
                let attachmentChatToAddModal = `
                    <li>
                        <a href="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}" 
                            download="${data.message.file.fileName}">
                            ${data.message.file.fileName}
                        </a>
                    </li>`;
                $(`#attachmentsModal_${divId}`).find("ul.list-attachments").append(attachmentChatToAddModal);
            },
            error: function (error) { 
                alertify.notify(error.responseText, "error", 5);
            },
        });
    });
}

$(document).ready(function () {
    socket.on("response-chat-attachment", function(response) {
        let divId = "";

        // 1. xử lý tin nhắn từ controller trước khi hiện ra
        let messageOfYou = $(`<div class="bubble you bubble-attachment-file" data-mess-id="${response.message._id}"></div>`);
        let attachmentChat = ` 
            <a href="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}" 
                download="${response.message.file.fileName}">
                ${response.message.file.fileName}
            </a>`;
        

        if(response.currentGroupId) {
            let senderAvatar = `
                <img src="images/users/${response.message.sender.avatar}" alt="" 
                class="avatar-small" title="${response.message.sender.name}">`;
            messageOfYou.html(`${senderAvatar} ${attachmentChat}`);
            
            divId = response.currentGroupId;
            // console.log(`group: ${divId}`);
        } else {
            /* messageOfYou.html(attachmentChat); */
            divId = response.currentUserId;
            messageOfYou.html(attachmentChat);
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
        $(`.person[data-chat=${divId}]`).find("span.preview").html("Tệp đính kèm...");

        // 5. đưa contact lên đầu bên leftside
        $(`.person[data-chat=${divId}]`).on("leftside.moveConversationToTheTop", function() {
            let dataToMove = $(this).parent();
            $(this).closest("ul").prepend(dataToMove);
            $(this).off("leftside.moveConversationToTheTop");
        });
        $(`.person[data-chat=${divId}]`).trigger("leftside.moveConversationToTheTop");

        // 9. add to modal image
        if(response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
            let attachmentChatToAddModal = `
                    <li>
                        <a href="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}" 
                            download="${response.message.file.fileName}">
                            ${response.message.file.fileName}
                        </a>
                    </li>`;
            $(`#attachmentsModal_${divId}`).find("ul.list-attachments").append(attachmentChatToAddModal);
        }
    });
});
