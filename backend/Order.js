const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderID: String,
  userName: String,
  item: String,
  price: Number,
  address: String,
  phoneNumber: String
});

const order = mongoose.model('Order', orderSchema);

module.exports = order;