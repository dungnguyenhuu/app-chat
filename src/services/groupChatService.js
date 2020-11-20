import _ from "lodash";
import ChatGroupModel from "./../model/chatGroupModel";

let addNewGroup = (currentUserId, arrayMemberIds, groupChatName) => {
    return new Promise(async (resolve, reject) => {
        try {
           // add current userId to array members
           arrayMemberIds.unshift({userId: `${currentUserId}`});
           arrayMemberIds = _.unionBy(arrayMemberIds, "userId");
           let newGroupItem = {
                name: groupChatName,                                       // tên nhóm trò chuyện
                userAmount: arrayMemberIds.length,       // số thành viên
                userId: `${currentUserId}`,                                     // id người tạo nhóm
                members: arrayMemberIds,   
           };
           let newGroup = ChatGroupModel.createNew(newGroupItem);
           resolve(newGroup);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    addNewGroup: addNewGroup,
}