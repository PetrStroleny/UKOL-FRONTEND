import express from "express";
import { body } from "express-validator";
import { getLoggedID } from "./utils/middlewares.js";
import { slugify } from "./utils/string.js";
import { validate } from "./validation.js";

import ShoppingItem from "./models/shopping-item.js";
import ShoppingList from "./models/shopping-list.js";
import User from "./models/user.js";

const router = express.Router();

router.delete("/delete/:id",  async (req, res) => {
    try {
        const loggedID = await getLoggedID(req, res);

        let _shoppingList;
        try {
            _shoppingList = await ShoppingList.findOne({_id: req.params.id, owner: loggedID});
            if (!_shoppingList) throw Error("Not found");
        } catch(e) {
            res.status(409).send({
                errorMessage: "Logged user not owner of list or list does not exist",
            });
            return;
        } 

        await ShoppingItem.deleteMany({_id: {"$in":_shoppingList.shoppingItems}})
        await ShoppingList.deleteOne({_id: req.params.id});
        
        res.send({message: "Ok"});
    } catch (e) {
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }
});

router.post("/edit-or-create", validate([
    body("id").notEmpty(), 
    body("name").isLength({min: 1, max: 150}),
]), async (req, res) => {
    try {  
        const jsonData = req.body;
        const slug = slugify(jsonData.name);
        
        const editing = jsonData.id != 0;        

        const nameAlreadyExists = await ShoppingList.exists({id: {$ne: jsonData.id}, slug: slug});

        if (nameAlreadyExists) {
            res.status(400).send({
                errorMessage: "Shopping list with this name already exists",
            });
            return;
        }
        
        const loggedID = await getLoggedID(req, res);

        if (editing) {
            try {
                console
                await ShoppingList.updateOne({_id: jsonData.id, owner: loggedID}, {name: jsonData.name, slug});
            } catch(e) {
                res.status(409).send({
                    errorMessage: "Logged user not owner of list or list does not exist",
                });
                return;
            }
        } else {
            const _shoppingList = new ShoppingList({
                name: jsonData.name,
                slug,
                archived: false,
                owner: loggedID,
            });
            
            await _shoppingList.save();
        }

        res.send({message: "Ok", slug});
    } catch (e) {
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }
});

router.post("/leave/:id", async (req, res) => {    
    try {
        const loggedID = await getLoggedID(req, res);

        let _shoppingList;
        try {
            _shoppingList = await ShoppingList.findOne({_id: req.params.id, members: {"$in":loggedID}});
            if (!_shoppingList) throw Error("Not found");
        } catch(e) {
            res.status(409).send({
                errorMessage: "Logged user not member of list or list does not exist",
            });
            return;
        } 

        await ShoppingList.updateOne({_id: req.params.id}, {members: _shoppingList.members.filter(member => member != loggedID)});

        res.send({message: "Ok"});
    } catch (e) {
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }
});

router.post("/toggle-archived/:id",  async (req, res) => {
    try {
        const loggedID = await getLoggedID(req, res);
        let _shoppingList;
        try {
            _shoppingList = await ShoppingList.findOne({_id: req.params.id, owner: loggedID});
            if (!_shoppingList) throw Error("Not found");
        } catch(e) {
            res.status(409).send({
                errorMessage: "Logged user not owner of list or list does not exist",
            });
            return;
        } 
        await ShoppingList.updateOne({_id: req.params.id}, {archived: !_shoppingList.archived});
        
        res.send({message: "Ok"});
    } catch (e) {
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }
});

router.post("/change-members", validate([
    body("id").notEmpty(), 
    body("members").isArray(),
]), async (req, res) => {
    try {
        const loggedID = await getLoggedID(req, res);
        const jsonData = req.body;
        for (const memberID of jsonData.members) {
            const _user = await User.findOne({_id: memberID});
            
            if (!_user) {
                res.status(404).send({
                    errorMessage: "User not found",
                });
                return;
            } 
        }

        let _shoppingList;
        try {
            _shoppingList = await ShoppingList.findOne({
                _id: jsonData.id, owner: loggedID,
            });
            if (!_shoppingList) throw Error("Not found");
        } catch(e) {
            res.status(409).send({
                errorMessage: "Logged user not owner of list or list does not exist",
            });
            return;
        } 
        await ShoppingList.updateOne({ 
            owner:  loggedID,
            _id: jsonData.id, 
        }, {members: jsonData.members ?? []});

        res.send({message: "Ok"});
    } catch (e) {
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }
});


router.get("/", async (req, res ) => {
    try {
        const loggedID = await getLoggedID(req, res);
        
        const _shoppingLists = await ShoppingList.find({
            $or: [{"members":{"$in":loggedID}}, {"owner":loggedID}],
        });

        res.send(_shoppingLists);
    } catch (e) {
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }
});

router.get("/:slug", async (req, res) => {    
    try {
        const loggedID = await getLoggedID(req, res);
        
        let _shoppingList;
        try {
            _shoppingList = await ShoppingList.findOne({
                slug: req.params.slug, $or: [{"members":{"$in":loggedID}}, 
                {"owner":loggedID}],
            });
            if (!_shoppingList) throw Error("Not found");
        } catch(e) {
            res.status(409).send({
                errorMessage: "Logged user not member nor owner of list or list does not exist",
            });
            return;
        } 

        const _shoppingItems = await ShoppingItem.find({"_id":{"$in":_shoppingList["shoppingItems"]}});
        const _users = await User.find();

        res.send({
            list: _shoppingList, 
            items: _shoppingItems,
            users: _users,
        });
    } catch (e) {
        res.status(500).send({
            errorMessage: "Internal server error",
        });
    }
});

export default router;