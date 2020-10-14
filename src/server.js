import express from "express";
import ConnectDB from "./config/connectDB";
import ConfigViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import configSession from "./config/session";
import passport from "passport";
import {appConfig} from "./config/appConfig";


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

app.listen(appConfig.port, appConfig.hostname, () => {
    console.log(`running ${appConfig.hostname}: ${appConfig.port}`);
});
