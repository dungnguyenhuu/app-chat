import moment from "moment";
import momentLocal from "moment/locale/vi";

export let bufferToBase64 = (bufferFrom) => {
    return Buffer.from(bufferFrom).toString("base64");
};

export let lastItemOfArray = (array) => {
    if(!array.length) {
        return [];
    }
    return array[array.length - 1];
};

export let convertTimestamp = (timestamp) => {
    if(!timestamp) {
        return "";
    }

    return moment(timestamp).local("vi").startOf("seconds").fromNow();
};