const express = require("express")
const morgan = require("morgan")
const app = express()
const cors = require("cors")

morgan.token("reqbody", request => {
    return JSON.stringify(request.body)
})

app.use(cors())
app.use(express.json())
app.use(morgan(":method :url :status :response-time ms :reqbody"))

let persons = [
    {
      name: "Arto Hellas",
      number: "040-123456",
      id: "1"
    },
    {
      name: "Ada Lovelace",
      number: "39-44-5323523",
      id: "2"
    },
    {
      name: "Dan Abramov",
      number: "12-43-234345",
      id: "3"
    },
    {
      name: "Mary Poppendieck",
      number: "39-23-6423122",
      id: "4"
    },
    {
      name: "Pasi Parviainen",
      number: "0440413674",
      id: "5"
    },
    {
      id: "6",
      name: "Veli Parviainen",
      number: "0404136742"
    },
    {
      id: "7",
      name: "Henna Kemppainen",
      number: "0452770088"
    }
]

app.get("/", (request, response) => {
    response.send("<h1>Puhelinluettelo</h1>")
})

app.get("/info", (request, response) => {
    response.send(`Puheleinluettelolla on ${persons.length} ihmisen tiedot<br>${Date()}`)
})

app.get("/api/persons", (request, response) => {
    response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete("/api/persons/:id", (request, response) => {
    const id= request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post("/api/persons", (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: "Nimi puttuu"
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: "Numero puuttuu"
        })
    } else if (body.name.toLowerCase() === persons.map(person => person.name.toLowerCase())) {
        return response.status(400).json({
            error: "Nimi on jo puhelinluettelossa"
        })
    } else if (body.number === persons.map(person => person.number)) {
        return response.status(400).json({
            error: "Numero on jo puhelinluettelossa"
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)
    response.json(person)
})

const generateId = () => {
    return String(Math.round(Math.random() * 100000))
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})