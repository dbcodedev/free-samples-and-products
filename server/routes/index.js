import express from "express";

const routes = express.Router()

routes.get("/settings", (req, res) => {
    const sendData = { text: "This is coming from /settings route." };
    console.log(sendData.text)
    res.status(200).json(sendData);
});

export default routes;