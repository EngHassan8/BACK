const mongoose = require ("mongoose")

const total = mongoose.Schema({

  Name: {
        type: String,
        description: true
    },
    Email: {
        type: String,
        description: true
    } ,
    Password: {
        type: Number,
        description: true
    },
    Mobile: {
      type: Number,
        description: true
    },

    ID: {
        type: String,
        description: true 
    },
    image: {
        type: String,
        description: true 
    },



})

module.exports = mongoose.model("TotalVotes" , total)