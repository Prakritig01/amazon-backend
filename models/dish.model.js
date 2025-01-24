const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
    name :{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true,
        validate : {
            validator : (price)=>{
                if(price < 0){
                    return false;
                }
                return true;
            },
            message : 'Price should be a positive number'
        }
    },
    description:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    inStock:{
        type: Boolean,
        default: true
    },
    category:{
        type: String,
        required: true,
        enum: ['veg', 'non-veg']
    },
    counter : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Counter',
        required: true,
    }
})

const Dish = mongoose.model('Dish', dishSchema);

module.exports = Dish;