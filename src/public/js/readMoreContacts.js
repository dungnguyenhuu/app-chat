$(document).ready(function () {
    /* tab danh ba */
    $("#link-read-more-contacts").bind("click", function (e) {
        let skipNumber = $("#contacts").find("li").length;

        $.get(`/contact/read-more-contacts?skipNumber=${skipNumber}`, function(newContactUsers) {
            if (!newContactUsers.length) {
                alertify.notify("Bạn không còn người bạn nào", "error", 5);
                return false;
            };
            newContactUsers.forEach(function(user) {
                // chèn thêm người bạn vào cuối tab contact trong modal contact
                $("#contacts")
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
                                    <div class="user-talk" data-uid="${ user._id }">
                                        Trò chuyện
                                    </div>
                                    <div class="user-remove-contact action-danger" data-uid="${ user._id }">
                                        Xóa liên hệ
                                    </div>
                                </div>
                            </li>`
                        );
            });
        });
    });

    /* tab đang chờ xác nhận */
    $("#link-read-more-contacts-send").bind("click", function (e) {
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
    });

    /* tab yêu cầu kết bạn */
    $("#link-read-more-contacts-recevied").bind("click", function (e) {
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
    });
});
