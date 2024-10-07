const mongoose = require("mongoose")

if (process.argv.length < 3) {
    console.log("-------------------------------------")
    console.log("Invalid arguments: No password")
    console.log("-------------------------------------")
    console.log("Valid arguments:")
    console.log("PASSWORD to see all contacts")
    console.log("PASSWORD NAME NUMBER to add a new contact.")
    console.log("-------------------------------------")
    process.exit(1)
}

const password = process.argv[2]

const url =
`mongodb+srv://basbas:${password}@pbdata.mz4qo.mongodb.net/Phonebook?retryWrites=true&w=majority&appName=PBdata`

mongoose.set("strictQuery", false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Contact = mongoose.model("Contact", contactSchema)

if (process.argv.length === 3) {
    console.log("-------------------------------------")
    console.log("Phonebook:")
    console.log("-------------------------------------")
    Contact.find({}).then(result => {
        result.forEach(contact => {
            console.log(`Name:   ${contact.name}`)
            console.log(`Number: ${contact.number}`)
            console.log("-------------------------------------")
        })
        mongoose.connection.close()
    })
}
else if (process.argv.length < 5) {
    console.log("-------------------------------------")
    console.log("Invalid arguments: No name or number specified")
    console.log("-------------------------------------")
    console.log("Valid arguments:")
    console.log("PASSWORD to see all contacts")
    console.log("PASSWORD NAME NUMBER to add a new contact.")
    console.log("-------------------------------------")
    mongoose.connection.close()
}
else if (process.argv.length === 5){
    const contact = new Contact({
        name: process.argv[3],
        number: process.argv[4],
    })
    
    contact.save().then(result => {
        console.log("-------------------------------------")
        console.log(`New contact saved!`)
        console.log("-------------------------------------")
        console.log(`Name:   ${result.name}`)
        console.log(`Number: ${result.number}`)
        console.log("-------------------------------------")
        mongoose.connection.close()
    })
}