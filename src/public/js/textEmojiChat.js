function textEmojiChat (divId) {
    $(".emojionearea").unbind("keyup").on("keyup", function(element) {
        let currentEmojiArea = $(this);
        if(element.which === 13) {
            let targetId = $(`#write-chat-${divId}`).data("chat");
            let messageVal = $(`#write-chat-${divId}`).val();
            
            if(!targetId.length || !messageVal.length) {
                return false;
            };

            let dataTextEmojiForSend = {
                uid: targetId,
                messageVal: messageVal,
            };

            if($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
                dataTextEmojiForSend.isChatGroup = true;
            }

            $.post("/message/add-new-text-emiji", dataTextEmojiForSend,
                function (data) { // success
                    let dataToEmit = {
                        message: data,
                    };
                    // console.log(data);
                    // 1. xử lý tin nhắn từ controller trước khi hiện ra
                    let messageOfMe = $(`<div class="convert-emoji bubble me" data-mess-id="${data._id}"></div>`);
                    messageOfMe.text(data.text);
                    let convertEmojiMessage = emojione.toImage(messageOfMe.html());

                    if(dataTextEmojiForSend.isChatGroup) {
                        /* let senderAvatar = `<img src="images/users/${data.sender.avatar}" alt="" class="avatar-small" title="${data.sender.name}">`;
                        messageOfMe.html(`${senderAvatar} ${convertEmojiMessage}`);
                        increaseNumberMessageGroup(divId); */
                        dataToEmit.groupId = targetId;
                    } else {
                        /* messageOfMe.html(convertEmojiMessage); */
                        dataToEmit.contactId = targetId;
                    }
                    messageOfMe.html(convertEmojiMessage);

                    // 2. thêm vào cuối màn hình chat
                    $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
                    nineScrollRight(divId);

                    // 3. trả lại vùng nhập tin nhắn về trống
                    $(`#write-chat-${divId}`).val("");
                    $(".emojionearea").find(".emojionearea-editor").text("");

                    // 4. cập nhập vùng preview tin nhắn và time bên leftside
                    $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime")
                        .html(moment(data.createdAt).locale("vi").startOf("seconds").fromNow());
                    $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(data.text));

                    // 5. đưa contact lên đầu bên leftside
                    $(`.person[data-chat=${divId}]`).on("leftside.moveConversationToTheTop", function() {
                        let dataToMove = $(this).parent();
                        $(this).closest("ul").prepend(dataToMove);
                        $(this).off("leftside.moveConversationToTheTop");
                    });
                    $(`.person[data-chat=${divId}]`).trigger("leftside.moveConversationToTheTop");

                    // 6. emit realtime
                    socket.emit("chat-text-emoji", dataToEmit);

                    // 7. emit remove typing real-time
                    typingOff(divId);
                    let checkTyping = $(`.chat[data-chat=${divId}]`).find("div.bubble-typing-gif")
                    if (checkTyping.length){
                        checkTyping.remove();
                    }
                }).fail(function(res) {
                    // error
                    alertify.notify(res.responseText, "error", 5);
                });
        }  
    });
};
$(document).ready(function () {
    socket.on("response-chat-text-emoji", function(response) {
        // console.log(response);
        let divId = "";
        // 1. xử lý tin nhắn từ controller trước khi hiện ra
        let messageOfYou = $(`<div class="convert-emoji bubble you" data-mess-id="${response.message._id}"></div>`);
        messageOfYou.text(response.message.text);
        let convertEmojiMessage = emojione.toImage(messageOfYou.text());
        // console.log(`convertEmojiMessage: ${convertEmojiMessage}`);

        if(response.currentGroupId) {
            let senderAvatar = `<img src="images/users/${response.message.sender.avatar}" alt="" class="avatar-small" title="${response.message.sender.name}">`;
            messageOfYou.html(`${senderAvatar} ${convertEmojiMessage}`);
            
            divId = response.currentGroupId;
            // console.log(`group: ${divId}`);
        } else {
            /* messageOfYou.html(convertEmojiMessage); */
            divId = response.currentUserId;
            messageOfYou.html(convertEmojiMessage);
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
        $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(response.message.text));

        // 5. đưa contact lên đầu bên leftside
        $(`.person[data-chat=${divId}]`).on("leftside.moveConversationToTheTop", function() {
            let dataToMove = $(this).parent();
            $(this).closest("ul").prepend(dataToMove);
            $(this).off("leftside.moveConversationToTheTop");
        });
        $(`.person[data-chat=${divId}]`).trigger("leftside.moveConversationToTheTop");

    });
});
