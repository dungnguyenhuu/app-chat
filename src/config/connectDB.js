import mongoose from "mongoose";
import bluebird from "bluebird";

// Kết nối với MongoDB
let connectDB = () => {
    mongoose.Promise = bluebird;

    let DB_CONNECTION = "mongodb";
    let DB_HOST = "localhost";
    let DB_PORT = 27017;
    let DB_NAME = "app_chat";
    let DB_USERNAME = "";
    let DB_PASSWORD = "";

    // mongodb://localhost:27017/app_chat
    let URI = `${DB_CONNECTION}://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
    try {
        mongoose.connect(URI, {useMongoClient: true});
        console.log('Connect successful');
    } catch (error) {
        console.log('Connect failue');
    }
    
};

module.exports = connectDB;
