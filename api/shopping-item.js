import express from "express";
import { body } from "express-validator";
import fs from "fs";
import {returnJSONFromFile} from "./utils/_fs.js";
import {validate} from "./validation.js";
import { getLoggedID } from "./utils/middlewares.js";

const router = express.Router();

router.delete("/delete/:id",  async (req, res) => {
    try {
        if (isNaN(Number(req.params.id))) {
            res.status(400).send({
                errorMessage: "Id must be integer",
            });
            return;
        }

        const jsonShoppingItems = await returnJSONFromFile("shopping-items", res);
        const jsonShoppingLists = await returnJSONFromFile("shopping-lists", res);
        
        const loggedID = await getLoggedID(req, res);

        if (!jsonShoppingLists.some(shoppingList => shoppingList["shopping-items"].includes(Number(req.params.id)))) {
            res.status(400).send({
                errorMessage: "Shopping item is not under any list",
            });
            return;
        }
        const listFromItem = jsonShoppingLists.filter(shoppingList => shoppingList["shopping-items"].includes(Number(req.params.id)))[0];

        if (!jsonShoppingItems.some(shoppingItem => shoppingItem.id == Number(req.params.id) && (listFromItem.members.includes(loggedID) || listFromItem.owner == loggedID))) {
            res.status(400).send({
                errorMessage: "Shopping item does not exist",
            });
            return;
        }

        const newShoppingItems = jsonShoppingItems.filter(shoppingItem => shoppingItem.id != Number(req.params.id));
        const newShoppingLists = jsonShoppingLists.map(shoppingList => {
            if (!shoppingList["shopping-items"].includes(Number(req.params.id))) return shoppingList;
            return {...shoppingList, "shopping-items": shoppingList["shopping-items"].filter(shoppingItem => shoppingItem != Number(req.params.id))};
        });
        
        fs.writeFileSync("./shopping-items.json", JSON.stringify(newShoppingItems));
        fs.writeFileSync("./shopping-lists.json", JSON.stringify(newShoppingLists));
        res.send({message: "Ok"});
    } catch (e) {
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }
});

router.post("/toggle-done/:id",  async (req, res) => {
    try {
        if (isNaN(Number(req.params.id))) {
            res.status(400).send({
                errorMessage: "Id must be integer",
            });
            return;
        }

        const jsonShoppingItems = await returnJSONFromFile("shopping-items", res);
        const jsonShoppingLists = await returnJSONFromFile("shopping-lists", res);

        const loggedID = await getLoggedID(req, res);
        if (!jsonShoppingLists.some(shoppingList => 
            (shoppingList.members.includes(loggedID) || shoppingList.owner == loggedID) && 
            shoppingList["shopping-items"].includes(Number(req.params.id)))
        ) {
            res.status(409).send({
                errorMessage: "Logged user not member nor user of list",
            });
            return;
        }
        
        const newShoppingItems = jsonShoppingItems.map(shoppingItem => (shoppingItem.id == Number(req.params.id)) ? ({...shoppingItem, done: !shoppingItem.done}) : shoppingItem);

        fs.writeFileSync("./shopping-items.json", JSON.stringify(newShoppingItems));
        res.send({message: "Ok"});
    } catch (e) {
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }
});

router.post("/create", validate([
        body("shopping-list-id").isInt({min: 1}), 
        body("name").isLength({min: 1, max: 150}),
        body("count").isInt({min: 1, max: 999}),
    ]), async (req, res) => {    
    try {
        const jsonShoppingItems = await returnJSONFromFile("shopping-items", res);
        const jsonShoppingLists = await returnJSONFromFile("shopping-lists", res);

        const jsonData = req.body;
        let newShoppingItems = jsonShoppingItems;
        let id = 0;
        
        const newShoppingItem = {name: jsonData.name, done: false, count: Number(jsonData.count)};
        if (jsonShoppingItems.length != 0) {
            id = jsonShoppingItems[jsonShoppingItems.length - 1].id + 1;
            newShoppingItems = [...jsonShoppingItems, {id: id, ...newShoppingItem}];
        } else {
            id = 1;
            newShoppingItems = [{id: id, ...newShoppingItem}];
        }

        const newShoppingLists = jsonShoppingLists.map(shoppingList => {
            if (shoppingList.id != req.body["shopping-list-id"]) return shoppingList;
            return {...shoppingList, "shopping-items": [...shoppingList["shopping-items"], id]};
        });

        fs.writeFileSync("./shopping-items.json", JSON.stringify(newShoppingItems));
        fs.writeFileSync("./shopping-lists.json", JSON.stringify(newShoppingLists));
        res.send({message: "Ok"});
    } catch (e) {
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }
});

export default router;