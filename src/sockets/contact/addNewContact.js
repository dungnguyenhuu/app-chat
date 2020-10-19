/* param: io from socket.io lib */
let addNewContact = (io) => {
    io.on("connection", (socket) => {
        // console.log("New user connected");
        socket.on("add-new-contact", (data) => {
            console.log(data);
            console.log(socket.request.user);
        });
    });
};

module.exports = addNewContact;
