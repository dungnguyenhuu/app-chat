$(document).ready(function () {
    /* tab danh bạ */
    $("#link-read-more-all-chat").bind("click", function (e) {
        let skipPersonal = $("#all-chat").find("li:not(.group-chat)").length;
        let skipGroup = $("#all-chat").find("li.group-chat").length;

        $.get(`/message/read-more-all-chat?skipPersonal=${skipPersonal}&skipGroup=${skipGroup}`, function(data) {
            if(data.leftSideData.trim() === "") {
                alertify.notify("Bạn không còn cuộc trò chuyện nào nữa", "error", 5);
                $("#link-read-more-all-chat").css("display", "none");
            }

            // 1. handle leftSide 
            $("#all-chat").find("ul").append(data.leftSideData);

            // 2. handle scroll left
            resizeNineScrollLeft()
            nineScrollLeft();

            // 3. handle rightSide
            $("#screem-chat").append(data.rightSideData);

            // 4. call screenChat function
            changeScreenChat();

            // 5. convert emoji
            convertEmoji();

            // 6. handle imageModal
            $("body").append(data.imageModalData);

            // 7. call gridPhoto()
            gridPhotos(5);

            // 8. handle attachmentModal
            $("body").append(data.attachmentModalData);

            // 9. check online
            socket.emit("check-status");
        });
    });

    /* tab đang chờ xác nhận */
    /* $("#link-read-more-contacts-send").bind("click", function (e) {
        let skipNumber = $("#request-contact-sent").find("li").length;

        $.get(`/contact/read-more-contacts-sent?skipNumber=${skipNumber}`, function(newContactSent) {
            if (!newContactSent.length) {
                alertify.notify("Bạn không còn người bạn nào", "error", 5);
                return false;
            };
            newContactSent.forEach(function(user) {
                // console.log(user);
                // chèn thêm người bạn vào cuối tab contact trong modal contact
                $("#request-contact-sent")
                    .find("ul")
                        .append(
                            `<li class="_contactList" data-uid="${ user._id }">
                            <div class="contactPanel">
                                <div class="user-avatar">
                                    <img src="images/users/${ user.avatar }" alt="">
                                </div>
                                <div class="user-name">
                                    <p>
                                        ${ user.username }
                                    </p>
                                </div>
                                <br>
                                <div class="user-address">
                                    <span>&nbsp ${ (user.address !== null) ? user.address : "" }</span>
                                </div>
                                <div class="user-remove-request-contact-sent action-danger display-important" data-uid="${ user._id }">
                                    Hủy yêu cầu
                                </div>
                            </div>
                        </li>`
                        );
            });

            removeRequestContactSent(); // js/removeRequestContactSent.js
        });
    }); */

    /* tab yêu cầu kết bạn */
    /* $("#link-read-more-contacts-recevied").bind("click", function (e) {
        let skipNumber = $("#request-contact-received").find("li").length;

        $.get(`/contact/read-more-contacts-received?skipNumber=${skipNumber}`, function(newContactReceived) {
            if (!newContactReceived.length) {
                alertify.notify("Bạn không còn người bạn nào", "error", 5);
                return false;
            };
            newContactReceived.forEach(function(user) {
                // console.log(user);
                // chèn thêm người bạn vào cuối tab contact trong modal contact
                $("#request-contact-received")
                    .find("ul")
                        .append(
                            ` <li class="_contactList" data-uid="${ user._id }">
                            <div class="contactPanel">
                                <div class="user-avatar">
                                    <img src="images/users/${ user.avatar }" alt="">
                                </div>
                                <div class="user-name">
                                    <p>
                                        ${ user.username }
                                    </p>
                                </div>
                                <br>
                                <div class="user-address">
                                    <span>&nbsp ${ (user.address !== null) ? user.address : "" }</span>
                                </div>
                                <div class="user-approve-request-contact-received" data-uid="${ user._id }">
                                    Chấp nhận
                                </div>
                                <div class="user-remove-request-contact-received action-danger" data-uid="${ user._id }">
                                    Xóa yêu cầu
                                </div>
                            </div>
                        </li>`
                    );
            });

            removeRequestContactRecevied(); // js/removeRequestContactRecevied.js
            approveRequestContactRecevied(); // js/approveReqContactRecevied.js
        });
    }); */
});
