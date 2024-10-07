require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const app = express()
const cors = require("cors")
const Contact = require("./models/contact")

morgan.token("reqbody", request => {
    return JSON.stringify(request.body)
})

app.use(express.static("dist"))

const errorHandler = (error, request, response, next) => {
    console.log("----------------------------------")
    console.error("ERROR", error.message)
    console.log("----------------------------------")

    if (error.name === "CastError") {
        return response.status(400).send({error: "malformatted id"})
    } else if (error.name === "ValidationError") {
        return response.status(400).json({error: error.message})
    }

    next(error)
}

app.use(cors())
app.use(express.json())
app.use(morgan(":method :url :status :response-time ms :reqbody"))

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

let persons = []

app.get("/info", (request, response) => {
    response.send(`Puheleinluettelolla on ${persons.length} ihmisen tiedot<br>${Date()}`)
})

app.get("/api/persons", (request, response, next) => {
    Contact.find({})
    .then(contacts => {
        response.json(contacts)
        persons = contacts
    })
    .catch(error => next(error))
})

app.get("/api/persons/:id", (request, response, next) => {
    Contact.findById(request.params.id)
    .then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
    Contact.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.post("/api/persons", (request, response, next) => {
    const body = request.body
    
    const contact = new Contact({
        name: body.name,
        number: body.number,
    })

    contact.save()
    .then(savedContact => {
        response.json(savedContact)
    })
    .catch(error => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
    //const body = request.body
    const {name, number} = request.body

    /*const person = {
        name: body.name,
        number: body.number,
    }*/

    Contact.findByIdAndUpdate(
        request.params.id,
        {name, number},
        {new: true, runValidators: true, context: "query"})
    .then(updatedContact => {
        response.json(updatedContact)
    })
    .catch(error => next(error))
})

app.use(errorHandler)
app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})