import express from 'express';
import process from 'process';
import ejs from 'ejs';
const app = express()
const port = 3000

app.set('views', process.cwd() + '/dist')
app.engine('html', ejs.renderFile)
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index.html', { ENDPOINT: process.env.ENDPOINT })
})

app.use(express.static('dist'))

app.listen(port, () => {
  console.log(`web app listening on port ${port}, with endpoint ${process.env.ENDPOINT}`)
})