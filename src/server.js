import express from "express";
import ConnectDB from "./config/connectDB";
import ContactModel from "./model/contact.model";
import ConfigViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import bodyParser from "body-parser";

// khởi tại app
let app = express();

// kết nối với MongoDB
// ConnectDB();

// tạo view engine
ConfigViewEngine(app);

// enable post data for request
app.use(bodyParser.urlencoded({extended: true}));

// tạo routes
initRoutes(app);

let hostname = "localhost";
let port = 8888;

app.listen(port, hostname, () => {
    console.log(`running ${hostname}: ${port}`);
});
