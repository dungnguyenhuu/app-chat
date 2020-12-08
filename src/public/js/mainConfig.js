const socket = io();

function nineScrollLeft() {
  $('.left').niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
}

function resizeNineScrollLeft() {
  $(".left").getNiceScroll().resize();
}

function nineScrollRight(divId) {
  $(`.right .chat[data-chat = ${divId}]`).niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
  // console.log($(`.right .chat[data-chat = ${divId}]`)[0].scrollHeight);
  $(`.right .chat[data-chat = ${divId}]`).scrollTop($(`.right .chat[data-chat = ${divId}]`)[0].scrollHeight);
}

function enableEmojioneArea(divId) {
  $(`#write-chat-${divId}`).emojioneArea({
    standalone: false,
    pickerPosition: 'top',
    filtersPosition: 'bottom',
    tones: false,
    autocomplete: false,
    inline: true,
    hidePickerOnBlur: true,
    search: false,
    shortnames: false,
    events: {
      keyup: function(editor, event) {
        // gán giá trị thay đổi vào input bị ẩn
        $('.write-chat').val(this.getText());
      },
      click: function () {
        // bật lắng nghe DOM cho việc chat tin nhắn văn bản, emoji
        textEmojiChat(divId);
        typingOn(divId);
      },
      blur: function() {
        typingOff(divId);
      },
    },
  });
  $('.icon-chat').bind('click', function(event) {
    event.preventDefault();
    $('.emojionearea-button').click();
    $('.emojionearea-editor').focus();
  });
}

function spinLoaded() {
  $('#loader').css('display', 'none');
}

function spinLoading() {
  $('#loader').css('display', 'block');
}

function ajaxLoading() {
  $(document)
    .ajaxStart(function() {
      spinLoading();
    })
    .ajaxStop(function() {
      spinLoaded();
    });
}

function showModalContacts() {
  $('#show-modal-contacts').click(function() {
    $(this).find('.noti_contact_counter').fadeOut('slow');
  });
}

function configNotification() {
  $('#noti_Button').click(function() {
    $('#notifications').fadeToggle('fast', 'linear');
    // $('.noti_counter').fadeOut('slow');
    return false;
  });
  $(".main-content").click(function() {
    $('#notifications').fadeOut('fast', 'linear');
  });
}

function gridPhotos(layoutNumber) {
  $(".show-images").unbind("click").on("click", function() {
    let href = $(this).attr("href");
    let modalImageId = href.replace("#", "");

    let originDataImage = $(`#${modalImageId}`).find("div.modal-body").html();

    let countRows = Math.ceil($(`#${modalImageId}`).find("div.all-images>img").length / layoutNumber);
    let layoutStr = new Array(countRows).fill(layoutNumber).join("");
    $(`#${modalImageId}`).find("div.all-images").photosetGrid({
      highresLinks: true,
      rel: "withhearts-gallery",
      gutter: "2px",
      layout: layoutStr,
      onComplete: function() {
        $(`#${modalImageId}`).find(".all-images").css({
          "visibility": "visible"
        });
        $(`#${modalImageId}`).find(".all-images a").colorbox({
          photo: true,
          scalePhotos: true,
          maxHeight: "90%",
          maxWidth: "90%"
        });
      }
    });

    // bắt sự kiện đóng modal
    $(`#${modalImageId}`).on("hidden.bs.modal", function () {
      $(this).find("div.modal-body").html(originDataImage);
    });
  });

}

function showButtonGroupChat() {
  $('#select-type-chat').bind('change', function() {
    if ($(this).val() === 'group-chat') {
      $('.create-group-chat').show();
      // Do something...
    } else {
      $('.create-group-chat').hide();
    }
  });
}



// function flashMasterNotify() {
//   let notify = $(".master-success-message").text();
//   if (notify.length){
//     alertify.notify(notify, "success", 5);
//   }
// };

function changeTypeChat(){
  $("#select-type-chat").bind("change", function() {
    let optionSelected = $("option:selected", this);
    optionSelected.tab("show");

    if($(this).val() === "user-chat") {
      $(".create-group-chat").hide();
    } else {
      $(".create-group-chat").show();
    }
  });
}

function changeScreenChat() {
  $(".room-chat").unbind("click").on("click", function() {
    let divId = $(this).find("li").data("chat");

    $(".person").removeClass("active");
    $(`.person[data-chat=${divId}]`).addClass("active");
    $(this).tab("show");

    //cấu hình thanh cuộn bên vùng chat bên phải
    nineScrollRight(divId);
    
    // Bật emoji, tham số truyền vào là id của box nhập nội dung tin nhắn
    enableEmojioneArea(divId);

    // bật lắng nghe DOM cho việc chat tin nhắn hình ảnh
    imageChat(divId);

    // bật lắng nghe DOM cho việc chat tin nhắn tệp đính kèm
    attachmentChat(divId);

    // bật lắng nghe DOM cho việc gọi video
    videoChat(divId);

    // zoom img
    zoomImageChat(divId);

  });
};

function convertEmoji() {
  $(".convert-emoji").each(function() {
    var original = $(this).html();
    var converted = emojione.toImage(original);
    $(this).html(converted);
  });
};

function bufferToBase64(buffer) {
  return btoa(
    new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
  );
}

function zoomImageChat(divId) {
  $(".show-image-chat").unbind("click").on("click", function() {
    $(`#img-chat-modal-${divId}`).css("display", "block");
    $(`#img-chat-modal-content-${divId}`).attr("src", $(this)[0].src);

    $(`#img-chat-modal-${divId}`).on("click", function() {
      $(this).css("display", "none");
    });
  });
}

function notYetConversations() {
  if(!$("ul.people").find("a").length) {
    Swal.fire({
      type: "info",
      title: "Bạn chưa có bạn bè? Hãy tìm kiếm bạn bè để trò chuyện!",
      showCancelButton: false,
      confirmButtonColor: "#2ECC71",
      confirmButtonText: "Đồng ý",
    }).then((result) => {
      $("#contactsModal").modal("show");
    });
  }
}

function userTalk() {
  $(".user-talk").unbind("click").on("click", function() {
    let divId = $(this).data("uid");
    // console.log(divId);
    $("ul.people").find(`a[href="#uid_${divId}"]`).click();
    // $("#contactsModal").modal("hide");
    $(this).closest("div.modal").modal("hide");
  });
}

$(document).ready(function() {
  // Hide số thông báo trên đầu icon mở modal contact
  showModalContacts();

  // Bật tắt popup notification
  configNotification();

  // Cấu hình thanh cuộn
  nineScrollLeft();

  // Icon loading khi chạy ajax
  ajaxLoading();

  // Hiển thị hình ảnh grid slide trong modal tất cả ảnh, tham số truyền vào là số ảnh được hiển thị trên 1 hàng.
  // Tham số chỉ được phép trong khoảng từ 1 đến 5
  gridPhotos(5);

  // hien thong bao loi
  // flashMasterNotify();

  // thay đổi kiểu trò chuyện
  changeTypeChat();

  // thay đổi màn hình chat
  changeScreenChat();

  // chuyển các unicode thành hình ảnh biểu tượng cảm xúc
  convertEmoji();

  notYetConversations();

  userTalk();

  if($("ul.people").find("a").length) {
    $("ul.people").find("a")[0].click();
  }

  $("#video-chat").bind("click", function () {
    alertify.notify("Chức năng không phù hợp với nhóm trò chuyện", "info", 5);
  });
});
