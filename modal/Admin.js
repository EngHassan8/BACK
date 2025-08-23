

const mongoose = require ("mongoose")

const Mamule = mongoose.Schema({

        Email:{
            type: String,
            required: true

        },
        
        
        Password:{
            type: Number,
            required: true
        }

})

module.exports = mongoose.model("Admin", Mamule)