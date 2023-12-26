const express = require('express');
const app = express();
const PORT = 8000;
const db = require('./models/index');
const multer = require('multer');
const path = require('path');
// const upload = multer({
//     dest: 'uploads/',
// });

// multer 세부 설정
const uploadDetail = multer({
    storage: multer.diskStorage({
        destination(req, file, done){
            done(null, 'static/img');
        },
        filename(req, file, done){
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext)+ext);
        }
    })
})

app.set('view engine', 'ejs');

app.use('/upload', uploadDetail.single('userfile'))
app.use('/static', express.static(__dirname + '/static'));
app.use(express.urlencoded({extended : true}));
app.use(express.json());


const indexRouter = require('./routes/index');
app.use('/', indexRouter);

const bookShelfRouter = require('./routes/bookMain');
app.use('/bookShelf', bookShelfRouter);

// 프로필 사진 업로드
// app.post('/upload', uploadDetail.single('userfile'), (req, res)=>{
//     console.log(req.file);
//     //console.log(req.body);
//     res.send('Upload!');
// })

app.get('*', (req, res) => {
	res.render('404');
})

db.sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`);
    })
}).catch((err) => {
    console.log(err);
})