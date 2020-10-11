import express from "express";
import ConnectDB from "./config/connectDB";
import ContactModel from "./model/contact.model";
import env from "../evn/environment";

let app = express();

// kết nối với MongoDB
ConnectDB();

let hostname = "localhost";
let port = 8888;

app.get("/testDB", async (req, res) => {
    try {
        let item = {
            userId: "1999",
            contactId: "2000",
        };
        let contact = await ContactModel.createNew(item);
        res.send(JSON.stringify(contact));
    } catch (error) {
        console.log(error);        
    }
});

app.listen(port, hostname, () => {
    console.log(`running ${hostname}: ${port}`);
});
