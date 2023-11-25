import express from "express";
import User from "./models/user.js";

const router = express.Router();

router.get("/", async (req, res) => {   
    try {
        const _users = await User.find();

        res.send(_users);
    } catch (e) {
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }
});

export default router;