import { returnJSONFromFile } from "./_fs.js";

import User from "../models/user.js"; 

export async function LoggedMiddleWare(req, res, next) {
    try {
        const authHeader = req.get("Authorization");
        if (!authHeader || authHeader == "" || authHeader.length == 0) {
            res.status(409).send({
                errorMessage: "Authorization empty",
            });
            return;
        }
    
        const splitedToken = authHeader.split(" ");
    
        if (splitedToken[0] != "bearer") {
            res.status(409).send({
                errorMessage: "Wrong authorization",
            });
            return;
        }

        const token = splitedToken[1];

        const jsonUsers = await returnJSONFromFile("./users", res);

        if (!jsonUsers.some(user => user.token == token)) {
            res.status(409).send({
                errorMessage: "User does not exist",
            });
            return;
        };
        
    } catch (e) {
        res.status(500).send({
            errorMessage: "Internal server error",
        });
        return;
    }

    next();
}

export async function getLoggedID(req, res) {
    const authHeader = req.get("Authorization");
    if (authHeader == "" || authHeader.length == 0) {
        throw Error("Forbidden");
    }

    const splitedToken = authHeader.split(" ")
    if (splitedToken.length < 2) {
        throw Error("Forbidden");
    }

    if (splitedToken[0] != "bearer") {
        throw Error("Forbidden");
    }

    const token = splitedToken[1];


    const _user = await User.findOne({ "token": token });

    return _user.id;
}