
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import { LoggedMiddleWare } from "./utils/middlewares.js";

import shoppingListRouter from "./shopping-list.js";
import shoppingItemRouter from "./shopping-item.js";
import userRouter from "./user.js";
import { init } from "./utils/init.js";

async function main() {
  // Inicializace nového Express.js serveru
  const app = express();
  // Definování portu, na kterém má aplikace běžet na localhostu
  const port = process.env.PORT || 8000;

  // Conncet MONGO DB 
  const dbURI = "mongodb+srv://admin:test@cluster0.25shizm.mongodb.net/unicorn?retryWrites=true&w=majority";
  
  try {
    await mongoose.connect(dbURI);
    console.log("connected to db");
  } catch(e) {
    console.log(e);
    return;
  }

  // Parsování body
  app.use(express.json()); // podpora pro application/json
  app.use(express.urlencoded({ extended: true })); // Podpora pro application/x-www-form-urlencoded

  app.use(cors());

  app.post("/init", init);

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
}

main();