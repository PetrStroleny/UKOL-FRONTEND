
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import { LoggedMiddleWare } from "./utils/middlewares.js";

import shoppingListRouter from "./shopping-list.js";
import shoppingItemRouter from "./shopping-item.js";
import userRouter from "./user.js";
import { init } from "./utils/init.js";

async function server(dbhost, port, initOnlyUsers = false) {

    // Inicializace nového Express.js serveru
    const app = express();

    try {
    await mongoose.connect(dbhost);
    console.log("connected to db");
    } catch(e) {
    console.log(e);
    return;
    }

    // Parsování body
    app.use(express.json()); // podpora pro application/json
    app.use(express.urlencoded({ extended: true })); // Podpora pro application/x-www-form-urlencoded

    app.use(cors());

    await init(initOnlyUsers);

    app.use(LoggedMiddleWare);


    app.use("/shopping-list", shoppingListRouter);
    app.use("/shopping-item", shoppingItemRouter);
    app.use("/user", userRouter);

    app.get("/*", (_, res) => {
    res.send("Unknown path!");
    });

    // Nastavení portu, na kterém má běžet HTTP server
    app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
    });

    return app;
}

export default server;