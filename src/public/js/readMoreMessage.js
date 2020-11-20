function readMoreMessage() {
    $(".right .chat").scroll(function() {
        
        // get the first message
        let firstMessage = $(this).find(".bubble:first");

        // get possiton of first message
        let currentOffset = firstMessage.offset().top - $(this).scrollTop();

        if($(this).scrollTop() === 0) {
            let messageLoading = `<img src="images/chat/loading_message.gif" class="message-loading" />`;
            $(this).prepend(messageLoading);

            let targetId = $(this).data("chat");
            let skipMessage = $(this).find("div.bubble").length;
            let chatInGroup = $(this).hasClass("chat-in-group") ? true : false;

            let thisDom = $(this);

            $.get(`/message/read-more?skipMessage=${skipMessage}&targetId=${targetId}&chatInGroup=${chatInGroup}`, function(data) {
                if(data.rightSideData.trim() === "") {
                    alertify.notify("Bạn không còn tin nhắn nào nữa", "error", 5);
                    thisDom.find("img.message-loading").remove();
                    return false;
                }

                // 1. handle rightSide
                $(`.right .chat[data-chat=${targetId}]`).prepend(data.rightSideData);

                // 2. prepend scroll
                $(`.right .chat[data-chat=${targetId}]`).scrollTop(firstMessage.offset().top - currentOffset);

                // 3. convert emoji
                convertEmoji();

                // 4. handle image modal
                $(`#imagesModal_${targetId}`).find("div.all-images").append(data.imageModalData);

                // 5. call gridPhoto
                gridPhotos(5);

                // handle attachment modal
                $(`attachmentsModal_${targetId}`).find("div.list-attachments").append(data.attachmentModalData);

                //  7. remove message loading
                thisDom.find("img.message-loading").remove();
            });
        }

    });
}

$(document).ready(function () {
    readMoreMessage();
});