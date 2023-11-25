import mongoose from "mongoose";

const Schema = mongoose.Schema;

const shoppingListSchema = new Schema({
    name: {type: String, required: true},
    slug: {type: String, required: true},
    archived: {type: Boolean, required: true},


    // Edges
        members: [{
            type: Schema.Types.ObjectId,
            ref: "member"
        }],
        owner: Schema.Types.ObjectId,
        shoppingItems: [{
            type: Schema.Types.ObjectId,
            ref: "shopping-item"
        }],
    //
}, { timestamps: true });

const ShoppingList = mongoose.model("shopping-list", shoppingListSchema);

export default ShoppingList;