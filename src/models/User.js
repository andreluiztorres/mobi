const mongoose = require('mongoose')

const User = mongoose.model('User', {
    name: String,
    email: String,
    password: String,
    confirmPassword: String,    
    telephones: [{
        number: Number,
        area_code: Number,  
    }],  
    created_at: Date,
    modified_at: Date,  
})

module.exports = User