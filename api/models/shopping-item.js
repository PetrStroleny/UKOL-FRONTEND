import mongoose from "mongoose";

const Schema = mongoose.Schema;

const shoppingItemSchema = new Schema({
    name: {type: String, required: true},
    done: {type: Boolean, required: true},
    count: {type: Number, required: true},
}, { timestamps: true });

const ShoppingItem = mongoose.model("shopping-item", shoppingItemSchema);

export default ShoppingItem;