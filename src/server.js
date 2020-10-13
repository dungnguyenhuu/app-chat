import express from "express";
import ConnectDB from "./config/connectDB";
import ConfigViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import configSession from "./config/session";
import passport from "passport";


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

// congfig passport
app.use(passport.initialize());
app.use(passport.session());

// tạo routes
initRoutes(app);

let hostname = "localhost";
let port = 8888;

app.listen(port, hostname, () => {
    console.log(`running ${hostname}: ${port}`);
});
