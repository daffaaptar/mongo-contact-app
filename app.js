const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

require('./utils/db')
const Contact = require('./model/contact')

const app = express()
const port = 3000

app.set('view engine','ejs')

//Built-in  Middleware
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

//flash
app.use(cookieParser('secret'));
app.use(session({
  cookie:{ maxAge:6000},
  secret: 'secret',
  resave: true,
  saveUninitialized: true,

}));
app.use(flash());


//Home
app.get('/', (req, res) => {
  
    const mahasiswa = [
        {
            nama: 'Daffa Apta Pratama',
            email: 'daffa@gmail.com',
        },
        {
            nama: 'Galung Ramadun',
            email: 'galung@gmail.com',
        },
        {
            nama: 'Riki Maulani',
            email: 'iki@gmail.com',
        },
    ]
    res.render('index', { 
        nama: 'Daffa Apta Pratama', 
        title: 'Halaman Utama',
        mahasiswa,
    })
})

//About
app.get('/about', (req, res) => {
    res.render('about', { title: 'About'})
})

//Contact
app.get('/contact', async (req, res) => {

    const contacts = await Contact.find()
    res.render('contact', { title: 'Contact',
    contacts,
    msg: req.flash('msg'),
})
})
app.get('/contact/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama })
    res.render('detail', { title: 'Contact',
    contact,
})
})


app.listen(port, () => {
    console.log(`Mongo Contact App | listening at http://localhost:${port}`)
})