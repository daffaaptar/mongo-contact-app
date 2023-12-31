const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const { body, validationResult, check } = require('express-validator')
const methodOverride = require('method-override')

require('./utils/db')
const Contact = require('./model/contact')

const app = express()
const port = 3000

//override
app.use(methodOverride('_method'))

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

// from add data
app.get('/contact/add', (req, res) => {
    res.render('add-contact',{
        title: 'Form Tambah Data Contact'
    })
})

//proses add data  
app.post('/contact', [  
    body('nama').custom( async (value) => {  
      const duplikat = await Contact.findOne({nama: value});  
      if(duplikat) {  
        throw new Error('Nama contact sudah digunakan!');  
      }  
      return true;  
    }),  
    check('email', 'Email tidak valid!').isEmail(),  
    check('noHP', 'No HP tidak valid!!').isMobilePhone('id-ID'), 
    ], (req, res) => {  
     const errors = validationResult(req);  
     if(!errors.isEmpty()) {  
      // return  res.status(404).json({ errors: errors.array() });  
     res.render('add-contact', {  
      title: 'Form Tambah Data Contact',  
      layout: 'layouts/main-layout',  
      errors: errors.array(),  
     })  
    }else{ 
      Contact.insertMany(req.body) .then(function (error) { 
        //kirimkan flash masage 
      req.flash('msg', 'Data Contact Berhasil Ditambahkan!'); 
      res.redirect('/contact')  
        }) 
    } 
  } 
  );
  
  // delete kontak
// app.get('/contact/delete/:nama', async (req, res) => {
//     const contact = await Contact.findOne({ nama:req.params.nama })

// //jika kontak tdk ada
// if(!contact) {
//    res.status(404)
//    res.send('<h1>404</h1>')
// } else {
//     Contact.deleteOne({ _id: contact._id}).then((result) =>{
//         req.flash('msg', 'Data Contact Berhasil Dihapus!');
//           res.redirect('/contact') 
//     })
// }
// })
app.delete('/contact', (req, res) => {
        Contact.deleteOne({ nama: req.body.nama }).then((result) => {
        req.flash('msg', 'Data Contact Berhasil Dihapus!');
          res.redirect('/contact') 
        })
})

//form ubah data
app.get('/contact/edit/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama })
    res.render('edit-contact',{
        title: 'Form Edit Data Contact',
       
        contact,
    })
})

//proses ubah data 
app.put(
    '/contact', 
    [ 
    body('nama').custom(async (value, {req}) => { 
      const duplikat = await Contact.findOne({nama: value})
      if(value !== req.body.oldNama && duplikat) { 
        throw new Error('Nama contact sudah digunakan!'); 
      } 
      return true; 
    }), 
    check('email', 'Email tidak valid!').isEmail(), 
    check('noHP', 'No HP tidak valid!!').isMobilePhone('id-ID'),
    ], (req, res) => { 
     const errors = validationResult(req); 
     if(!errors.isEmpty()) { 
      // return  res.status(404).json({ errors: errors.array() }); 
     res.render('edit-contact', { 
      title: 'Form Edit Data Contact', 
      layout: 'layouts/main-layout', 
      errors: errors.array(), 
      contact: req.body,
     }) 
    }else{
      Contact.updateOne({ _id: req.body._id },
        {
            $set: {
                nama: req.body.nama,
                email: req.body.email,
                nohp: req.body.nohp,
            },
        }
        ).then((result) => {
            //kirimkan flash masage
            req.flash('msg', 'Data Contact Berhasil Diubah!');
            res.redirect('/contact') 
        })
    }
  });

//detail
app.get('/contact/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama })
    res.render('detail', { title: 'Contact',
    contact,
})
})


app.listen(port, () => {
    console.log(`Mongo Contact App | listening at http://localhost:${port}`)
})