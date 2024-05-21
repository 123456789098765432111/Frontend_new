import {model, models, Schema} from "mongoose";

const OrderSchema = new Schema({
  line_items:Object,
  address:String,
  paid:Boolean,
  phone:String,
  email:String,
}, {
  timestamps: true,
});

export const Order = models?.Order || model('Order', OrderSchema);