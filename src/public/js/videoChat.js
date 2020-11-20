function videoChat(divId) {
    $(`#video-chat-${divId}`).unbind("click").on("click", function() {
        let targetId = $(this).data("chat");
        let callerName = $("#navbar-username").text();

        let dataToEmit = {
            listenerId: targetId,
            callerName: callerName
        };

        // 1. at caller
        socket.emit("caller-check-listener-online", dataToEmit);
    });
}

function playVideoStream(videoTagId, stream) {
    let video = document.getElementById(videoTagId);
    video.srcObject = stream;
    video.onloadeddata = function() {
        video.play();
    }
}

function closeVideoStream(stream){
    return stream.getTracks().forEach(track => track.stop());
}

$(document).ready(function () {
    // 2. of caller
    socket.on("server-send-listener-is-offline", function() {
        alertify.notify("Người dùng không trực tuyến bây giờ", "error", 5);
    });

    let iceServer = $("#ice-server-list").val();

    let getPeerId = "";
    const peer = new Peer({
        key: "peerjs",
        host: "peerjs-server-trungquandev.herokuapp.com",
        secure: true,
        port: 443,
        config: { 'iceServers': JSON.parse(iceServer) },
        // debug: 3
    });
    peer.on("open", function(peerId){
        getPeerId = peerId;
    });
    // 3. of listener
    socket.on("server-request-peer-id-of-listener", function(response) {
        let listenerName = $("#navbar-username").text();
        let dataToEmit = {
            callerId: response.callerId,
            listenerId: response.listenerId,
            callerName: response.callerName,
            listenerName: listenerName,
            listenerPeerId: getPeerId,
        };

        // 4. of listener
        socket.emit("listener-emit-peer-id-to-server", dataToEmit);
    });

    let timeInterval;
    // 5. of caller
    socket.on("server-send-peer-id-of-caller", function(response) {
        let dataToEmit = {
            callerId: response.callerId,
            listenerId: response.listenerId,
            callerName: response.callerName,
            listenerName: response.listenerName,
            listenerPeerId: response.listenerPeerId,
        };

        // 6. of caller
        socket.emit("caller-request-call-to-server", dataToEmit);

        Swal.fire({
            title: `Đang gọi cho &nbsp; <span style="color: #2ECC71;"> ${response.listenerName} </span> &nbsp; <i class="fa fa-volume-control-phone"></i>`,
            html: `
                Thời gian: <strong style="color: #D43F3A"></strong> giây <br> <br>
                <button id="btn-cancel-call" class="btn btn-danger">Hủy cuộc gọi</button>    
            `,
            backdrop: "rgba(85, 85, 85, 0.4)",
            width: "52rem",
            timer: 20000,
            allowOutsideClick: false,
            onBeforeOpen: () => {
                $("#btn-cancel-call").unbind("click").on("click", function () {
                    Swal.close();
                    clearInterval(timeInterval);

                    // 7. of caller
                    socket.emit("caller-cancel-requset-call-to-server", dataToEmit);
                });

                if(Swal.getContent().querySelector != null) {
                    Swal.showLoading();
                    timeInterval = setInterval(() => {
                        Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
                    }, 1000);
                }
            },
            onOpen: () => {
                //  12. of caller
                socket.on("server-send-reject-call-to-caller", function(response) {
                    Swal.close();
                    clearInterval(timeInterval);

                    Swal.fire({
                        type: "info",
                        title: `<span style="color: #2ECC71;"> ${response.listenerName} </span> &nbsp; đã từ chối cuộc gọi`,
                        backdrop: "rgba(85, 85, 85, 0.4)",
                        width: "52rem",
                        allowOutsideClick: false,
                        confirmButtonColor: "#2ECC71",
                        confirmButtonText: "Xác nhận",
                    });
                });

                
            },
            onClose: () => {
                clearInterval(timeInterval);
            },
        }).then((result) => {
            return false;
        });
    });

    // 8. of listener
    socket.on("server-send-request-call-to-listener", function(response) {
        let dataToEmit = {
            callerId: response.callerId,
            listenerId: response.listenerId,
            callerName: response.callerName,
            listenerName: response.listenerName,
            listenerPeerId: response.listenerPeerId,
        };

        Swal.fire({
            title: `<span style="color: #2ECC71;"> ${response.callerName} </span> &nbsp; đang gọi video cho bạn &nbsp;<i class="fa fa-volume-control-phone"></i>`,
            html: `
                Thời gian: <strong style="color: #D43F3A"></strong> giây <br> <br>
                <button id="btn-reject-call" class="btn btn-danger">Từ chối</button>    
                <button id="btn-accept-call" class="btn btn-success">Đồng ý</button>    
            `,
            backdrop: "rgba(85, 85, 85, 0.4)",
            width: "52rem",
            timer: 20000,
            allowOutsideClick: false,
            onBeforeOpen: () => {
                $("#btn-reject-call").unbind("click").on("click", function () {
                    Swal.close();
                    clearInterval(timeInterval);
                    
                    // 10. of listener
                    socket.emit("listener-reject-request-to-server", dataToEmit);
                });

                $("#btn-accept-call").unbind("click").on("click", function () {
                    Swal.close();
                    clearInterval(timeInterval);
                    
                    // 11. of listener
                    socket.emit("listener-accept-request-to-server", dataToEmit);
                });

                if(Swal.getContent().querySelector != null){
                    Swal.showLoading();
                    timeInterval = setInterval(() => {
                        Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
                    }, 1000);
                }
            },
            onOpen: () => {
                // 9. of listener 
                socket.on("server-send-cancel-request-call-to-listener", function(response) {
                    Swal.close();
                    clearInterval(timeInterval);
                });

                 
            },
            onClose: () => {
                clearInterval(timeInterval);
            },
        }).then((result) => {
            return false;
        });
    });

    // 13. of caller
    socket.on("server-send-accept-request-call-to-caller", function(response) {
        Swal.close();
        clearInterval(timeInterval);
        
        let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
        getUserMedia({video: true, audio: true}, function(stream) {
            // hiển thị modal streaming
            $("#streamModal").modal("show");
            // play my stream local of caller
            playVideoStream("local-stream", stream);
            // call to listener
            let call = peer.call(response.listenerPeerId, stream);
            // listens, play stream of listener
            call.on("stream", function(remoteStream) {
              // play stream local of listener
                playVideoStream("remote-stream", remoteStream);
            });

            $("#streamModal").bind("hidden.bs.modal", function() {
                closeVideoStream(stream);
                Swal.fire({
                    type: "info",
                    title: `Đã kết thúc cuộc gọi &nbsp; <span style="color: #2ECC71;"> ${response.listenerName} </span> `,
                    backdrop: "rgba(85, 85, 85, 0.4)",
                    width: "52rem",
                    allowOutsideClick: false,
                    confirmButtonColor: "#2ECC71",
                    confirmButtonText: "Xác nhận",
                });
            });
          }, function(err) {
            if(err.toString() === "NotAllowedError: Permission denied") {
                alertify.notify("Bạn chưa cấp quyền mở camera và microphone trên trình duyệt", "error", 5);
            }

            if(err.toString() === "NotFoundError: Requested device not found") {
                alertify.notify("Không tìm thấy thiết bị nghe gọi trên máy", "error", 5);
            }
          });
    });

   // 14. of listener
   socket.on("server-send-accept-request-call-to-listener", function(response) {
        Swal.close();
        clearInterval(timeInterval);
        
        var getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
      
        peer.on("call", function(call) {
            getUserMedia({video: true, audio: true}, function(stream) {
                // hiển thị modal streaming
                $("#streamModal").modal("show");
                // play my stream local of caller
                playVideoStream("local-stream", stream);

                call.answer(stream); // Answer the call with an A/V stream.
                call.on("stream", function(remoteStream) {
                    // play my stream local of caller
                    playVideoStream("remote-stream", remoteStream);
                });

                $("#streamModal").bind("hidden.bs.modal", function() {
                    closeVideoStream(stream);
                    Swal.fire({
                        type: "info",
                        title: `Đã kết thúc cuộc gọi &nbsp; <span style="color: #2ECC71;"> ${response.callerName} </span>  `,
                        backdrop: "rgba(85, 85, 85, 0.4)",
                        width: "52rem",
                        allowOutsideClick: false,
                        confirmButtonColor: "#2ECC71",
                        confirmButtonText: "Xác nhận",
                    });
                });
            }, function(err) {
                if(err.toString() === "NotAllowedError: Permission denied") {
                    alertify.notify("Bạn chưa cấp quyền mở camera và microphone trên trình duyệt", "error", 5);
                }
                if(err.toString() === "NotFoundError: Requested device not found") {
                    alertify.notify("Không tìm thấy thiết bị nghe gọi trên máy", "error", 5);
                }
            });
        });
    });
});