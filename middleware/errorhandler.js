import { response } from "express"

const logError = (err) => {
    console.log("--------------------------------")
    console.log('🚨 Error 🚨')
    console.log('-------------------')
    console.log('Name:', err.name)
    console.log('Status:', err.status)
    console.log('Message:', err.message)
    console.log('-------------------')
    console.log('Stack:')
    console.log(err.stack)
    console.log('-------------------')
    console.log('The above error occurred during the below request:')

}



const errorHandler = (err, req, res, next) => {
 //   logError(err)

    if (err.name === 'InvalidData') {

        return res.status(err.status).json(err.response)

    }

if (err.name === 'ValidationError') {
       const response = {}

       for (const key in err.errors) {
        response[key] = err.errors[key].properties.message
       }
       return res.status(400).json(response)
    }

//unique constaintes (field value already exists)
 if (err.name === 'MongoServerError' && err.code === 11000) {

    const [keyName, keyValue] = Object.entries(err.keyValue)[0]


return res.status(400).json({
    [keyName]: `${keyValue[0].toUpperCase() + keyName.slice(1)} "${keyValue}" already exists`
})

if (err.name === 'Unauthorized') {
return res.status(401).json({message: 'unauthorized'})
    
console.log(err)
 }
    return res.status(500).json({ message: 'Internal Server Error' })


 }
}
export default errorHandler;