
import express from "express";
import cors from "cors";

import { LoggedMiddleWare } from "./utils/middlewares.js";

import shoppingListRouter from "./shopping-list.js";
import shoppingItemRouter from "./shopping-item.js";
import userRouter from "./user.js";

// Inicializace nového Express.js serveru
const app = express();
// Definování portu, na kterém má aplikace běžet na localhostu
const port = process.env.PORT || 8000;

// Parsování body
app.use(express.json()); // podpora pro application/json
app.use(express.urlencoded({ extended: true })); // Podpora pro application/x-www-form-urlencoded

const corsOptions = {
    origin: 'http://localhost:5173',
};
app.use(cors(corsOptions));

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