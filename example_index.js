const express = require("express")
const app = express()

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

app.use(express.json())

app.get("/", (request, response) => {
    response.send("<h1>Hello world!</h1>")
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
    console.log(body)
    if (!body.name) {
        return response.status(400).json({
            error: "Content missing"
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
    const maxId = persons.length > 0
        ? Math.max(...persons.map(person => Number(person.id)))
        : 0
    return String(maxId + 1)
}

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)