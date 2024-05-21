import {model, models, Schema} from "mongoose";

const OrderSchema = new Schema({
  line_items:Object,
  address:String,
  paid:Boolean,
  phone:String,
  email:String,
  Void:Boolean,
  delivered:Boolean,
}, {
  timestamps: true,
});

export const Order = models?.Order || model('Order', OrderSchema);