require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT
const fruits = require('./fruits.json')
const logger = require("./logger.js")

app.use(express.json())
app.use(logger)

app.get("/", (req, res) => {
    res.send("Welcome to the Fruit API!")
})

app.get("/fruits", (req, res) => {
    res.send(fruits)
})

app.get("/fruits/:name", (req, res) => {
    const name = req.params.name.toLowerCase()
    const ff = fruits.filter((f) => {
        return f.name.toLowerCase() == name
    })
    ff.length === 0 ? res.status(404).send("The fruit does not exist") : res.send(ff[0])
})

app.post("/fruits", (req, res) => {
    if (!req.body || !req.body.name) {
        return res.status(400).send("Fruit name is required")
    }
    try {
        const fruit = fruits.find((fruit) => {
            return fruit.name.toLowerCase() === req.body.name.toLowerCase()
        })
        console.log(fruit)
        if (fruit != undefined) {
            res.status(409).send("That fruit exists")
        }
        const ids = fruits.map((fruit) => fruit.id)
        let maxId = Math.max(...ids)
        req.body.id = maxId + 1
        fruits.push(req.body)
        res.send("Fruit Created")
    }
    catch (e) {
        console.error(e)
        res.status(500).send("An error has happened")
    }

})

app.patch("/fruits/:name", (req, res) => {
    const fruit = fruits.find(fruit => fruit.name.toLowerCase() === req.params.name.toLowerCase())
    const newFruitName = req.body.name
    if (fruit == undefined) {
        res.status(404).send("No fruit by that name")
    }
    else {
        fruit.name = newFruitName
        res.status(200).send(fruit)
    }
})

app.delete("/fruits/:name", (req, res) => {
    const name = req.params.name.toLowerCase()
    const fruitIndex = fruits.findIndex((fruit) => fruit.name.toLowerCase() === name)
    if (fruitIndex == -1) {
        res.status(404).send("No fruit by that name")
    }
    else {
        fruits.splice(fruitIndex, 1)
        res.sendStatus(204)
    }
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})