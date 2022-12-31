const port = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const sites = [
    {
        name: 'nytimes',
        address: 'https://www.nytimes.com/section/world',
        base: 'https://www.nytimes.com'
    },
    {
        name: 'nbcnews',
        address: 'https://www.nbcnews.com/world',
        base: ''
    },
    {
        name: 'cnn',
        address: 'https://edition.cnn.com/world',
        base: ''
    },
    {
        name: 'nbcnews',
        address: 'https://www.nbcnews.com/world',
        base: ''
    },
    {
        name: 'cbsnews',
        address: 'https://www.cbsnews.com/world',
        base: ''
    },
    {
        name: 'theguardian',
        address: 'https://www.theguardian.com/international',
        base: ''
    },
    {
        name: 'time',
        address: 'https://time.com',
        base: ''
    },
    {
        name: 'latime',
        address: 'https://www.latimes.com/world-nation',
        base: ''
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/news/',
        base: 'https://www.telegraph.co.uk'
    },
    {
        name: 'eveningstandard',
        address: 'https://www.standard.co.uk/news/world',
        base: 'https://www.standard.co.uk'
    },
    {
        name: 'dailymail',
        address: 'https://www.dailymail.co.uk/news/worldnews/index.html',
        base: ''
    },
    {
        name: 'nypost',
        address: 'https://nypost.com/news/',
        base: ''
    },
    {
        name: 'thesun',
        address: 'https://www.thesun.co.uk/news/',
        base: ''
    }
]

const news = []

sites.forEach(site => {
    axios.get(site.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a', html).each(function() {
                if (((($(this).attr('href'))?.includes('news')) == true) || ((($(this).attr('href'))?.includes('world')) == true)) {
                    const title = $(this).text()
                    const url = $(this).attr('href')

                    news.push({
                        title,
                        url: site.base + url,
                        source: site.name
                    })
                }
            })
        })
})



app.get('/', (req, res) => {
    res.json(news)
})

app.get('/:siteId', (req, res) => {
    const siteId = req.params.siteId
    const siteAdress = sites.filter(site => site.name == siteId).address
    const siteBase = sites.filter(site => site.source == siteId).base

    axios.get(siteAdress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificSite = []

            $('a', html).each(function() {

                if (((($(this).attr('href'))?.includes('news')) == true) || ((($(this).attr('href'))?.includes('world')) == true)) {
                    const title = $(this).text()
                    const url = $(this).attr('href')
                    specificSite.push({
                        title,
                        url: siteBase + url,
                        source: siteId
                    })
                }
            })
            res.json(specificSite)
        }).catch(err => console.log(err))
})


app.listen(port, () => {
    console.log('go to http://127.0.0.1:8000');
})
