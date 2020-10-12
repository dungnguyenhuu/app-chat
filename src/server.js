import express from "express";
import ConnectDB from "./config/connectDB";
import ContactModel from "./model/contact.model";
import ConfigViewEngine from "./config/viewEngine";

// khởi tại app
let app = express();

// kết nối với MongoDB
// ConnectDB();

// tạo view engine
ConfigViewEngine(app);

let hostname = "localhost";
let port = 8888;

app.get("/", (req, res) => {
    return res.render("main/master");
});

app.get("/login-register", (req, res) => {
    return res.render("auth/loginRegister");
});

app.listen(port, hostname, () => {
    console.log(`running ${hostname}: ${port}`);
});
