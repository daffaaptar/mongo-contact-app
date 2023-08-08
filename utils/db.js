const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/contact-app')
    .then(() =>  
  console.log('Connected!'))

  

// const contact1 = new Contact({ 
//     nama: 'Randu Hazel', 
//     nohp: '085426178926', 
//     email: 'randu.hazel.4a@gmail.com', 
// }) 
 
// contact1.save().then((contact) => console.log(contact))

