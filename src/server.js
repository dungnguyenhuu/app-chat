import express from "express";
import ConnectDB from "./config/connectDB";
import ContactModel from "./model/contactModel";
import ConfigViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import configSession from "./config/session";


// khởi tại app
let app = express();

// kết nối với MongoDB
ConnectDB();

// config session
configSession(app);

// tạo view engine
ConfigViewEngine(app);

// enable post data for request
app.use(bodyParser.urlencoded({extended: true}));

// enable flash messages
app.use(connectFlash());

// tạo routes
initRoutes(app);

let hostname = "localhost";
let port = 8888;

app.listen(port, hostname, () => {
    console.log(`running ${hostname}: ${port}`);
});
