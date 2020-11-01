function textEmojiChat (divId) {
    $(".emojionearea").unbind("keyup").on("keyup", function(element) {
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
                function (data) {
                    // success
                    console.log(data);
                }).fail(function(res) {
                    // error
                    alertify.notify(res.responseText, "error", 5);
                });
        }  
    });
};
