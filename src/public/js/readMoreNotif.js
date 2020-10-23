$(document).ready(function () {
    $("#link-read-more-notif").bind("click", function (e) {
        let skipNumber = $("ul.list-notifications").find("li").length;
        $.get(`/notification/read-more?skipNumber=${skipNumber}`, function(notifications) {
            if (!notifications.length) {
                alertify.notify("Bạn không còn thông báo nào", "error", 5);
                return false;
            };
            notifications.forEach(function(notification) {
                // chèn thêm thông báo vào cuối modal notification
                $("ul.list-notifications").append(`<li>${notification}</li>`);
            });
        });
    });
});
