const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        unique: true
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity cannot be negative'],
        default: 0
    },
    expireDate: {
        type: Date,
        required: [true, 'Expiry date is required']
    },
    category: {
        type: String,
        enum: ['Medicine', 'Equipment', 'Supplies', 'Other'],
        default: 'Medicine'
    },
    price: {
        type: Number,
        default: 0
    },
    warningLevel: {
        type: Number,
        default: 10
    },
    status: {
        type: String,
        enum: ['In Stock', 'Low Stock', 'Out of Stock', 'Expired'],
        default: 'In Stock'
    },
    description: {
        type: String,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

// Auto update status based on quantity and expiry
inventorySchema.pre('save', function(next) {
    if (this.quantity <= 0) {
        this.status = 'Out of Stock';
    } else if (this.quantity <= this.warningLevel) {
        this.status = 'Low Stock';
    } else {
        this.status = 'In Stock';
    }
    
    // Check if expired
    if (this.expireDate && new Date(this.expireDate) < new Date()) {
        this.status = 'Expired';
    }
    
    next();
});

module.exports = mongoose.model('Inventory', inventorySchema);
