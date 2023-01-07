const express = require('express');
const path = require('path');
const methodOverride = require('method-override')
const CampGround = require('./models/campGround');
const ejsMate = require('ejs-mate');


// Connect DB
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', { useNewUrlParser: true, })
    .then(() => {
        console.log("Connected to MongoDB")
    })
    .catch((err) => {
        console.log("Error");
        console.log(err);
    });
// DB Connect

const app = express();

// set ejsMate as ejs engine
app.engine('ejs', ejsMate);

// allow express routes to parse data from form and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// setting view engine as EJS
app.set('view engine', 'ejs');
app.set('views'), path.join(__dirname, '/views')



// allow forms to send PUT DELETE HTTP Request
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('./home');
})

app.get('/camps', async (req, res) => {
    const camps = await CampGround.find({});
    // console.log(camps);
    res.render('./camps/index', { camps });
})

//remember to add names in input ejs template
app.post('/camps', async (req, res) => {
    const data = req.body;
    const newCamp = new CampGround(req.body);
    newCamp.save();
    console.log(newCamp);
    res.redirect(`/camps/${newCamp._id}`);
})

app.get('/camps/new', (req, res) => {
    res.render('./camps/newCamp');
})

app.get('/camps/:id', async (req, res) => {
    const { id } = req.params;
    const camp = await CampGround.findById(id);
    res.render('./camps/view', { camp });
})

app.patch('/camps/:id', async (req, res) => {
    const { id } = req.params;
    // const camp = await CampGround.findById(id);
    // console.log(camp);
    const camp = await CampGround.findByIdAndUpdate(id, req.body);
    res.redirect(`/camps/${camp._id}`);
})

app.delete('/camps/:id', async (req, res) => {
    const {id} = req.params;
    const deletedCamp = await CampGround.findByIdAndDelete(id);
    console.log(deletedCamp);
    res.redirect('/camps');
})

app.get('/camps/:id/edit', async (req, res) => {
    const { id } = req.params;
    const camp = await CampGround.findById(id);
    console.log(camp);
    res.render('./camps/edit', { camp });
})

app.listen(3000, () => {
    console.log('App Started on Port 3000');
})