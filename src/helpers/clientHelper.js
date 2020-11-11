import moment from "moment";
<<<<<<< HEAD
import momentLocal from "moment/locale/vi";

export let bufferToBase64 = (bufferFrom) => {
    return Buffer.from(bufferFrom).toString("base64");
=======
// import "moment/locale/vi";

export let bufferToBase64 = (bufferForm) => {
    return Buffer.from(bufferForm).toString("base64");
>>>>>>> revert1
};

export let lastItemOfArray = (array) => {
    if(!array.length) {
        return [];
    }
    return array[array.length - 1];
};

export let convertTimestamp = (timestamp) => {
<<<<<<< HEAD
    if(!timestamp) {
        return "";
    }

=======
    if(!timestamp){
        return "";
    }
>>>>>>> revert1
    return moment(timestamp).local("vi").startOf("seconds").fromNow();
};
