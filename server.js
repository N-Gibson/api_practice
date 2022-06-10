const express = require('express')
const app = express()
const cors = require('cors')
// const Redis = require('redis')
const port = 3000

// const client = Redis.createClient()

const data = require('./data.json')

app.use(cors({
    allowedOrigins: ['localhost:3000']
}))
app.use(express.json());
app.locals.data = data
app.locals.title = 'Recipe sample data';

app.listen(port, () => {
    console.log(`${app.locals.title} is running on port: ${port}`)
})

app.get('/', async (request, response) => {
    // const { name } = request.params
    // const recipes = await redisMiddleware(`data.recipes.name=${name}`, () => {
    //     return app.locals.data
    // })

    // response.json(recipes)
    return response.json(app.locals.data)
})

app.get('/recipes/details/:name', (request, response) => {
    const { name } = request.params

    if (!app.locals.data.recipes.find(recipe => recipe.name === name)) {
        return response.status(200).json({
            message: `No recipe with name: ${name} found.`
        })
    }

    response.status(200).json(app.locals.data.recipes.filter(recipe => recipe.name === name))
})

app.post('/new_recipe', (request, response) => {
    const newRecipe = request.body
    const requiredParameters = ['name', 'ingredients', 'instructions']
    requiredParameters.forEach(requiredParameter => {
        if ( !requiredParameter ) {
            return response.status(422).json({
            message: 'You are missing a required parameter.'
        })
    }
    })

    app.locals.data.recipes = [ ...app.locals.data.recipes, { ...newRecipe} ]

    response.status(201).json(app.locals.data)
})

app.put('/put_recipe/', (request, response) => {
    const recipeUpdate = request.body

    i = app.locals.data.recipes.findIndex(recipe => recipe.name === recipeUpdate.name)
    app.locals.data.recipes.splice(i, 1, recipeUpdate)

    response.status(204).json(app.locals.data)
})

app.delete('/delete_recipe/:name', (request, response) => {
    const { name } = request.params
    const match = app.locals.data.recipes.find(recipe => recipe.name === name)
    console.log(match)
    if (!match) {
        return response.status(404).json({
            message: `No recipe with name: ${name} found.`
        })
    }

    app.locals.data.recipes = app.locals.data.recipes.filter(recipe => recipe.name !== name)
    response.status(200).json(app.locals.data)
})

// function redisMiddleware() {
//     return new Promise((resolve, reject) => {
//         redisClient.get(key, async (error, data) => {
//             if (error) return reject(error)
//             if (data != null) return JSON.parse(data)
//             const newData = await cb()
//             redisClient.setex(key, 3600, newData)
//         })
//     })
// }