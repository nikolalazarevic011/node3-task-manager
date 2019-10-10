// CRUD create delete update delete

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectIT = mongodb.ObjectID
const { MongoClient, ObjectID} = require('mongodb') //! destructioning!!!!! od ovog iznad

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'


MongoClient.connect(connectionURL, { useNewUrlParser:true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database!')
    }

    const db = client.db(databaseName)

    
    // db.collection('users').updateOne({
    //     _id: new ObjectID("5d942b64f7bfda1bfcdf858c")
    // }, {
    //     $set: {
    //         name:'Mike'
    //     }
    // }).then((result) =>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })

 
}) 