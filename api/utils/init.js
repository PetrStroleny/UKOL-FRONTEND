import User from "../models/user.js";
import ShoppingList from "../models/shopping-list.js";
import ShoppingItem from "../models/shopping-item.js";

export async function init() {
    try {
      const users = await User.find();
      const shoppingLists = await ShoppingList.find();
      const shoppingItems = await ShoppingItem.find();
      
      if (users.length != 0 || shoppingLists.length != 0 || shoppingItems.length != 0) return;
      
      let userIDs = [];
      let shoppingItemIDs = [];
      for (const _user of _users) {
        const _newUser = new User(_user);
        userIDs.push(_newUser.id);
        await _newUser.save();
      }

      for (const _shoppingItem of _shoppingItems) {
        const _newShoppingItem = new ShoppingItem(_shoppingItem);
        shoppingItemIDs.push(_newShoppingItem.id);
        await _newShoppingItem.save();
      }
      
      for (let i = 0; i < _shoppingLists.length; i++) {
        let currentShoppingItems = [];
        switch (i) {
          case 0: {
            currentShoppingItems = [shoppingItemIDs[0], shoppingItemIDs[1], shoppingItemIDs[2]]; 
            break;
          };
          case 1: {
            currentShoppingItems = [shoppingItemIDs[3], shoppingItemIDs[4], shoppingItemIDs[5]];
            break;
          };
          case 2: {
            currentShoppingItems = [shoppingItemIDs[6], shoppingItemIDs[7]];
            break;
          };
        }


        const _newShoppingList = new ShoppingList({
          ..._shoppingLists[i], 
          owner: userIDs[0], 
          shoppingItems: currentShoppingItems,
          members: [userIDs[1], userIDs[2]],
        });
        await _newShoppingList.save();
      }
    } catch (e) {
      console.log("Error while initting data");
    }
}

const _users = [
    {"name": "Jaromír", "token": "$2a$12$erYefxNdI/Cu1lVRV6za0.KdWVwgoqNZ79grqSkI6rxO9T5BtiNkC"},
    {"name": "Jan", "token": "$2a$12$mx5Z50J92GuO7iLzeRLEGecz1mb8nvN/YM2Hzv36jZE9zrTIY3FHK"},
    {"name": "Anna", "token": "$2a$12$wAh/R8s46jwhFYqnhod0QuV7c.l95oKmdqLSVGgMYgfChgT.f.U5O"},
];

const _shoppingLists = [
    {   
    "name": "Pondělní oslava", 
    "slug": "pondelni-oslava", 
    "archived": false, 
},
{
    "name": "Úterní oslava", 
    "slug": "uterni-oslava", 
    "archived": true, 
},
{
    "name": "Středeční pivo", 
    "slug": "stredecni-pivo", 
    "archived": true, 
}
];

const _shoppingItems = [
    {"name": "Dort", "done": false, "count": 1},
    {"name": "Svíčky", "done": false, "count": 1},
    {"name": "Džus", "done": false, "count": 1},
    {"name": "Dort", "done": false, "count": 1},
    {"name": "Svíčky", "done": false, "count": 1},
    {"name": "Džus", "done": false, "count": 1},
    {"name": "Pivo", "done": false, "count": 1},
    {"name": "Okurky", "done": false, "count": 2},
];