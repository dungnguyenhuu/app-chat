import mongoose from "mongoose";
import bluebird from "bluebird";
import { appConfig } from "./appConfig";

// Kết nối với MongoDB
let connectDB = () => {
    mongoose.Promise = bluebird;

    // mongodb://localhost:27017/app_chat
    let URI = `${appConfig.DB_CONNECTION}://${appConfig.DB_HOST}:${appConfig.DB_PORT}/${appConfig.DB_NAME}`;
    try {
        mongoose.connect(URI, {useMongoClient: true});
        console.log('Connect successful');
    } catch (error) {
        console.log('Connect failue');
    }
    
};

module.exports = connectDB;
