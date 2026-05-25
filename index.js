
const express = require('express')
const app = express()
const axios = require('axios').default;
const path = require('path');

const base = "https://api.themoviedb.org/3/"
const api_key = "1ea9ed9374402446b6208b59da6ec46a"



app.use(express.static(path.join(__dirname, 'web')));
app.use(express.json())


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'index.html'));
});



app.get('/asterisk', async (req, res)=> {
    res.sendFile(path.join(__dirname, 'web', 'index.html'));
})


app.get('/api/search/:page', async (req, res)=> {
    let url = ''
    if (req.query.search) {
        let query = req.query.search? `&query=${req.query.search}`:'',
        page = req.params.page? `&page=${req.params.page}`:'',
        lang = req.query.lang? `&language=${req.query.lang}`:'',
        year = req.query.year? `&year=${req.query.year}`:'',
        region = req.query.region? `&region=${req.query.region}`:''
        url = `${base}search/movie?api_key=${api_key}${query}${page}${lang}${year}${region}`
    } else {
        let page = req.params.page? `&page=${req.params.page}`:'',
        lang = req.query.lang? `&language=${req.query.lang}`:'',
        year = req.query.year? `&year=${req.query.year}`:'',
        genre = req.query.genre? `&with_genres=${req.query.genre}`:'',
        region = req.query.region? `&region=${req.query.region}`:''
        url = `${base}discover/movie?api_key=${api_key}${page}${lang}${year}${genre}${region}`
    }
    await axios.get(url).then(i => {
        res.status(200).send(i.data.results)
    }).catch(e => res.status(500).send())
})

app.get('/api/movie/:id', async (req, res)=> {
    let url = `${base}movie/${req.params.id}?api_key=${api_key}&append_to_response=videos`    
    await axios.get(url).then(i => {
        let img = `https://image.tmdb.org/t/p/w500${i.data.poster_path}`
        res.status(200).send(i.data)
    }).catch(e => res.status(500).send())
})

app.get('/api/movies/:page', async (req, res)=> {
    let page = req.params.page? `&page=${req.params.page}`:'',
    url = `${base}discover/movie?api_key=${api_key}${page}`
    await axios.get(url).then(i => {
        res.status(200).send(i.data.results)
    }).catch(e => res.status(500).send())
})

app.get('/api/trending/:page', async (req, res)=> {
    let page = req.params.page? `&page=${req.params.page}`:'',
    url = `${base}trending/movie/week?api_key=${api_key}${page}`
    await axios.get(url).then(i => {
        res.status(200).send(i.data.results)
    }).catch(e => res.status(500).send())
})

app.get('/api/countries', async (req, res)=> {
    let url = `${base}configuration/countries?api_key=${api_key}`    
    await axios.get(url).then(i => {
        res.status(200).send(i.data)
    }).catch(e => res.status(500).send())
})

app.get('/api/languages', async (req, res)=> {
    let url = `${base}configuration/languages?api_key=${api_key}`    
    await axios.get(url).then(i => {
        res.status(200).send(i.data)
    }).catch(e => res.status(500).send())
})

app.get('/api/genres', async (req, res)=> {
    let url = `${base}genre/movie/list?api_key=${api_key}`    
    await axios.get(url).then(i => {
        res.status(200).send(i.data)
    }).catch(e => res.status(500).send())
})



if (process.env.NODE_ENV !== 'production') {
  app.listen(3000, () => console.log('Listening on port 3000'));
}
module.exports = app; 

