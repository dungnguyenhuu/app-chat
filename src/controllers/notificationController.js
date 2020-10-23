import { notification } from "./../services/index";

let readMore = async (req, res) => {
    try {
        // số thông báo đã lấy
        let skipNumberNotif = +(req.query.skipNumber);

        // lấy thêm thông báo
        let newNotifications = await notification.readMore(req.user._id, skipNumberNotif);
        
        return res.status(200).send(newNotifications);
    } catch (error) {
        console.log("loi o notificationController");
        return res.status(500).send(error);
    }
};

module.exports = {
    readMore: readMore,
};
