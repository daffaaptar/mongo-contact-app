const mongoose = require('mongoose'); 
const schema = new mongoose.Schema( 
    {  
    nama: { 
        type: String, 
        required: true, 
    }, 
    nohp: { 
        type: String, 
        required: true, 
    }, 
    email: { 
        type: String, 
    }, }); 
const Contact = mongoose.model('Contact', schema); 
 
module.exports = Contact
