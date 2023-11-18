import express, { json } from "express";
import { body } from "express-validator";
import fs from "fs";
import { returnJSONFromFile } from "./utils/_fs.js";
import { validate } from "./validation.js";
import { getLoggedID } from "./utils/middlewares.js";
import { slugify } from "./utils/string.js";

const router = express.Router();

// @TODO toggle-archive/:id

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
        if (!jsonShoppingLists.some(shoppingList => shoppingList.id == Number(req.params.id) && shoppingList.owner == loggedID)) {
            res.status(400).send({
                errorMessage: "Shopping item does not exist",
            });
            return;
        }

        let shoopingItemsToDelete = [];
        const newShoppingLists = jsonShoppingLists.filter(shoppingItem => {
            if (shoppingItem.id != Number(req.params.id)) return true;
            shoopingItemsToDelete = shoppingItem["shopping-items"];
            return false;
        });
        const newShoppingItems = jsonShoppingItems.filter(shoppingItem => !shoopingItemsToDelete.includes(shoppingItem.id));
        
        fs.writeFileSync("./shopping-lists.json", JSON.stringify(newShoppingLists));
        fs.writeFileSync("./shopping-items.json", JSON.stringify(newShoppingItems));
        res.send({message: "Ok"});
    } catch (e) {
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }
});

router.post("/edit-or-create", validate([
    body("id").isInt(), 
    body("name").isLength({min: 1, max: 150}),
]), async (req, res) => {
    try {  

        //@todo same name check
        const jsonShoppingLists = await returnJSONFromFile("shopping-lists", res);

        const jsonData = req.body;
        
        const editing = jsonData.id != 0;
        
        let newShoppingLists = [];

        const loggedID = await getLoggedID(req, res);
        const slug = slugify(jsonData.name);
        if (editing) {
            if (!jsonShoppingLists.some(shoppingList => shoppingList.id == jsonData.id && shoppingList.owner == loggedID)) {
                res.status(400).send({
                    errorMessage: "Shopping list does not exist",
                });
                return;
            }
            newShoppingLists = jsonShoppingLists.map(shoppingList => shoppingList.id == jsonData.id ? {...shoppingList, name: jsonData.name, slug} : shoppingList);
        } else {
            let newShoppingList = {};
            newShoppingList = {name: jsonData.name, slug, owner: loggedID, members: [], "shopping-items": []};
            if (jsonShoppingLists.length != 0) {
                newShoppingLists = [{id: jsonShoppingLists[jsonShoppingLists.length - 1].id + 1, ...newShoppingList}, ...jsonShoppingLists];
            } else {
                newShoppingLists = [{id: 1, ...newShoppingList}];
            }
        }

        fs.writeFileSync("./shopping-lists.json", JSON.stringify(newShoppingLists));
        res.send({message: "Ok", slug});
    } catch (e) {
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }
});

router.post("/leave/:id", async (req, res) => {    
    try {
        if (isNaN(Number(req.params.id))) {
            res.status(400).send({
                errorMessage: "Id must be integer",
            });
            return;
        }

        const jsonShoppingLists = await returnJSONFromFile("shopping-lists", res);

        const loggedID = await getLoggedID(req, res);

        if (!jsonShoppingLists.some(shoppingList => shoppingList.id == Number(req.params.id) && shoppingList.members.includes(loggedID))) {
            res.status(400).send({
                errorMessage: "Shopping item does not exist",
            });
            return;
        }

        const newShoppingLists = jsonShoppingLists.map(shoppingList => shoppingList.id == Number(req.params.id) ? 
            ({...shoppingList, members: shoppingList.members.filter(member => member != loggedID)}) : 
            shoppingList
        );
        fs.writeFileSync("./shopping-lists.json", JSON.stringify(newShoppingLists));
        res.send({message: "Ok"});
    } catch (e) {
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }
});

router.post("/change-members", validate([
    body("id").isInt(), 
    body("members").isArray().custom((value) => {
        if (!value.every(Number.isInteger)) throw new Error("members must be array of integers");
        return true;
    }),
]), async (req, res) => {
    try {
        const jsonShoppingLists = await returnJSONFromFile("shopping-lists", res);
        const jsonUsers = await returnJSONFromFile("users", res);

        const jsonData = req.body;

        const loggedID = await getLoggedID(req, res);
        if (!jsonShoppingLists.some(shoppingList => shoppingList.id == jsonData.id && shoppingList.owner == loggedID)) {
            res.status(400).send({
                errorMessage: "Shopping list does not exist",
            });
            return;
        }
        
        for (const _userID of jsonData.members) {
            if (!jsonUsers.some(user => user.id == _userID)) {
                res.status(400).send({
                    errorMessage: "Member does not exist",
                });
                return;
            }
        }

        const newShoppingLists = jsonShoppingLists.map(shoppingList => shoppingList.id == jsonData.id ? ({...shoppingList, members: jsonData.members}) : shoppingList);

        fs.writeFileSync("./shopping-lists.json", JSON.stringify(newShoppingLists));
        res.send({message: "Ok"});
    } catch (e) {
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }
});

router.get("/", async (req, res) => {   
    try {
        const jsonShoppingLists = await returnJSONFromFile("shopping-lists", res);
        
        const loggedID = await getLoggedID(req, res);

        res.send(jsonShoppingLists.filter(shoppingList => shoppingList.members.includes(loggedID) || shoppingList.owner == loggedID));
    } catch (e) {
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }
});

router.get("/:slug", async (req, res) => {    
    try {
        const jsonShoppingLists = await returnJSONFromFile("shopping-lists", res);
        const jsonShoppingItems = await returnJSONFromFile("shopping-items", res);
        const jsonUsers = await returnJSONFromFile("users", res);

        const loggedID = await getLoggedID(req, res);
        console.log(req.params.slug);
        if (!jsonShoppingLists.some(shoppingList => shoppingList.slug == req.params.slug && (shoppingList.members.includes(loggedID) || shoppingList.owner == loggedID))) {
            res.status(400).send({
                errorMessage: "Shopping item does not exist",
            });
            return;
        }
        console.log("xxx");
        const _shoppingList = jsonShoppingLists.filter(shoppingList => shoppingList.slug == req.params.slug)[0];
        res.send({
            list: _shoppingList, 
            items: jsonShoppingItems.filter(shoppingItem => _shoppingList["shopping-items"].includes(shoppingItem.id)),
            users: jsonUsers,
        });
    } catch (e) {
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }
});

export default router;