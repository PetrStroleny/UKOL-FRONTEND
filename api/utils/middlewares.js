import { returnJSONFromFile } from "./_fs.js";

export async function LoggedMiddleWare(req, res, next) {
    try {
        const authHeader = req.get("Authorization");
        if (authHeader == "" || authHeader.length == 0) throw Error("Forbidden");
    
        const splitedToken = authHeader.split(" ");
    
        if (splitedToken[0] != "bearer") throw Error("Forbidden");

        const token = splitedToken[1];

        const jsonUsers = await returnJSONFromFile("./users", res);

        if (!jsonUsers.some(user => user.token == token)) throw Error("Forbidden");
        
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

    const jsonUsers = await returnJSONFromFile("./users", res);

    if (!jsonUsers.some(user => user["token"] == token)) {
        throw Error("Forbidden");
    }

    return jsonUsers.filter(user => user["token"] == token)[0].id;
}