function markNotificationAsRead(targetUsers) {
    $.ajax({
        type: "put",
        url: "/notification/mark-all-as-read",
        data: {targetUsers: targetUsers},
        success: function (result) {
            if(result) {
                targetUsers.forEach(function(uid) {
                    $(".noti_content").find(`div[data-uid = ${uid}]`).removeClass("notif-readed-false");
                    $("ul.list-notifications").find(`li>div[data-uid = ${uid}]`).removeClass("notif-readed-false");
                });
                decreaseNumberNotification("noti_counter", targetUsers.length);
            };
        },
    });
}


$(document).ready(function () {
    // đánh dấu đã đọc trên notification popup
    $("#popup-mark-notif-as-read").bind("click", function (e) {
        let targetUsers = [];
        $(".noti_content").find("div.notif-readed-false").each(function(index, notification) {
            targetUsers.push($(notification).data("uid"));
        });

        if(!targetUsers.length){
            alertify.notify("Bạn không còn thông báo nào chưa đọc", "error", 5);
            return false; 
        };

        markNotificationAsRead(targetUsers);
    });

    // đánh dấu đã đọc trên notification modal
    $("#modal-mark-notif-as-read").bind("click", function (e) {
        let targetUsers = [];
        $("ul.list-notifications").find("li>div.notif-readed-false").each(function(index, notification) {
            targetUsers.push($(notification).data("uid"));
        });

        if(!targetUsers.length){
            alertify.notify("Bạn không còn thông báo nào chưa đọc", "error", 5);
            return false; 
        };

        markNotificationAsRead(targetUsers);
    });
});
