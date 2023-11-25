import express from "express";
import { body } from "express-validator";
import ShoppingItem from "./models/shopping-item.js";
import ShoppingList from "./models/shopping-list.js";
import { getLoggedID } from "./utils/middlewares.js";
import { validate } from "./validation.js";

const router = express.Router();

router.delete("/delete/:id",  async (req, res) => {
    try {
        const loggedID = await getLoggedID(req, res);

        const shoppingListExists = await ShoppingList.exists({
            $or: [{"shoppingItems":{"$in": req.params.id}}, {"members":{"$in":loggedID}}, {"owner":loggedID}],
        });
        if (!shoppingListExists) {
            res.status(409).send({
                errorMessage: "Logged user not member nor owner of list or list does not exist",
            });
            return;
        } 

        await ShoppingItem.deleteOne({_id: req.params.id});

        res.send({message: "Ok"});
    } catch (e) {
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }
});

router.post("/toggle-done/:id",  async (req, res) => {
    try {
        const loggedID = await getLoggedID(req, res);

        const shoppingListExists = await ShoppingList.exists({
            $or: [{"shoppingItems":{"$in": req.params.id}}, {"members":{"$in":loggedID}}, {"owner":loggedID}],
        });
        if (!shoppingListExists) {
            res.status(409).send({
                errorMessage: "Logged user not member nor owner of list or list does not exist",
            });
            return;
        } 

        const _shoppingItem = await ShoppingItem.findOne({_id: req.params.id});
        await ShoppingItem.updateOne({_id: req.params.id}, {done: !_shoppingItem.done});

        res.send({message: "Ok"});
    } catch (e) {
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }
});

router.post("/create", validate([
        body("shopping-list-id"), 
        body("name").isLength({min: 1, max: 150}),
        body("count").isInt({min: 1, max: 999}),
    ]), async (req, res) => {    
    try {
        const jsonData = req.body;
        const loggedID = await getLoggedID(req, res);

        let shoppingList;
        try {
            shoppingList = await ShoppingList.findOne({
                _id: jsonData["shopping-list-id"],
                $or: [{"members":{"$in":loggedID}}, {"owner":loggedID}],
            });
        } catch(e) {
            res.status(409).send({
                errorMessage: "Logged user not member nor user of list or list does not exist",
            });
            return;
        } 

        const _shoppingItem = new ShoppingItem({
            name: jsonData.name,
            done: false,
            count: Number(jsonData.count),
        });

        const newShoppingItem = await _shoppingItem.save();

        await ShoppingList.updateOne({_id: jsonData["shopping-list-id"]}, {shoppingItems: [...shoppingList.shoppingItems, newShoppingItem._id]});

        res.send({message: "Ok"});
    } catch (e) {
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }
});

export default router;