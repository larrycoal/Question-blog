const express = require('express');
const app = express()
const bodyparser = require('body-parser')
const methodoverride = require('method-override')
const mongoose = require('mongoose')
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
app.use(express.static(__dirname + "/public"));
mongoose.connect('mongodb://heroku_02cn163v:f8ethnlkp0u4c692sego2kc1vq@ds229078.mlab.com:29078/heroku_02cn163v');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(methodoverride('_method'))

app.set('view engine', 'ejs');

const infoSchema = new mongoose.Schema({
    'name': String,
    'created': { type: Date, default: Date.now },
    'title': String,
    'questions': String,
    'answer': [String]
})
const info = mongoose.model('info', infoSchema)


app.get('/', (req, res) => {
    res.redirect('/qBlog')
})
app.get('/qBlog', (req, res) => {
    info.find({}, (err, info) => {
        if (err) {
            console.log('something went wrong')
        } else {

            res.render('qBlog', { info: info })
        }
    })
})
app.get('/qBlog/ask', (req, res) => {
    res.render('ask')
})

app.post('/qBlog', (req, res) => {
    info.create({
        name: req.body.name,
        questions: req.body.question,
        title:req.body.course
    })
    res.redirect('qBlog')

})

app.put('/qBlog/:id', (req, res) => {
    info.findByIdAndUpdate(req.params.id, { $push: { answer: req.body.answer } }, (err, updatedanswer) => {
        if (err) {
            console.log(error)
        } else {
            res.redirect('/')
        }
    })
})




app.listen(process.env.PORT || 3000, () => {
    console.log('server started')
})