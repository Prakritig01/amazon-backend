const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // References the User model
    required: true,
    ref: 'User', // Assuming you have a User model
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId, // References the Product model
        required: true,
        ref: 'Product', // Assuming you have a Product model
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
      },
      new_cost: {
        type: Number,
        required: true,
      },
      selected: {
        type: Boolean,
        default: true, // Indicates if the product is selected in the cart
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now, // Tracks when the cart was created
  },
});

module.exports = mongoose.model('Cart', cartSchema);
