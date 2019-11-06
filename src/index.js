const express = require('express')
require('./db/mongoose') //! ne treba nam nista odatle, zovemo ga samo da bi se connect na database
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT 

// const multer = require('multer')
// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {
//         if(!file.originalname.match(/\.(doc|docx)$/)) { //regular expression-gleda dal se zavrsavaju documenti sa ovim nastavcima
//             return cb(new Error ('Please upload Word document'))
//         }

//         cb(undefined, true)
//     }
// })
// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// }, (error, req, res, next) => { //! da bi eror u postmanu bio json type a ne html
//     res.status(400).send({error: error.message})
// })


app.use(express.json()) //?da moze iz postaman body da cita json
app.use(userRouter) //! mora ovo da bi mogao da korisits router, kad ga require gore!!!!
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

