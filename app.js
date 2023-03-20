const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const { Configuration, OpenAIApi } = require('openai')

dotenv.config()

const app = express()
const port = process.env.PORT
app.use(morgan('tiny'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.raw())

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

app.post('/question', async (req, res) => {
  const { input } = req.body
  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: input,
      max_tokens: 2048,
      temperature: 1
    })
    res.json({
      message: completion.data.choices[0].text
    })
  } catch (error) {
    res.json({
      error
    })
  }
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
