const port = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const sites = [
    {
        name: 'nytimes',
        address: 'https://www.nytimes.com/section/world'
    },
    {
        name: 'nbcnews',
         address: 'https://www.nbcnews.com/world'
    }, 
    {
        name: 'cnn',
        address: 'https://edition.cnn.com/world'
    },
    {
        name: 'nbcnews',
         address: 'https://www.nbcnews.com/world'
    },
    {
        name: 'cbsnews',
        address: 'https://www.cbsnews.com/world'
    },
    {
        name: 'theguardian',
         address: 'https://www.theguardian.com/international'
    },
    {
        name: 'time',
        address: 'https://time.com'
    }
 
]

const news = []

sites.forEach(site => {
    axios.get(site.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a', html).each(function ( ) {
                if  ( (($(this).attr('href'))?.includes('news')) == true )  {
                  const title = $(this).text()
                  const url = $(this).attr('href')
                  
                  news.push({
                      title,
                      url,
                      source: site.name
                  })
                }
            })
        })
})


app.get('/', (req, res) => {
    res.json('Hello')
})

app.get('/news', (req, res) => {
    res.json(news)
})


app.listen(port, () => {
    console.log('go to 127.0.0.1:8000');
})
