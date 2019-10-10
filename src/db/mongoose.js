const mongoose = require ('mongoose')
const validator = require ('validator')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser:true,
    useCreateIndex:true
})

const User = mongoose.model('user', {
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase:true,
        validate(value) {
           if (!validator.isEmail(value)) {
               throw new Error('Email is invalid')
           }
        }
    },
    age: {
        type: Number, 
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error ('Age must be a positive number')
            }
        }
    },
    password: {
        type: String, 
        required: true,
        trim:true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error ('Password cant be "password" ')
            }
        }
    }
})



// const me = new User({
//     name: '   Nikola ',
//     email: 'mike@laza.com    ',
//     password:  'ioiaosoioi'

// })

// me.save().then(()=>{
//     console.log(me)
// }).catch(()=>{
//     console.log('Error', error)
// })


const Task = mongoose.model('Task', {
    description: {
        type: String,
        required:true,
        trim:true,

    },
    compleated: {
        type: Boolean,
        default: false,
    } 
})

const housework = new Task({
    description: '   Vacum',
    
})

housework.save().then(()=>{
    console.log(housework)
}).catch(()=>{
    console.log('Error', error)
})









































