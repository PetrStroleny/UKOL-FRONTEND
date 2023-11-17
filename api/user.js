import express from "express";
import {returnJSONFromFile} from "./utils/_fs.js";

const router = express.Router();

router.get("/", async (req, res) => {   
    try {
        const jsonUsers = await returnJSONFromFile("users", res);

        res.send(jsonUsers);
    } catch (e) {
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }
});

export default router;