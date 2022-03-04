const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const PORT = process.env.PORT || 8000; 

const app = express(); 

app.listen(PORT, () => console.log(`server running on port ${PORT}`))



const newspapers = [
    {
        name: 'cityam',
        address: 'https://www.cityam.com/london-must-become-a-world-leader-on-climate-change-action/',
        base: ''
    },
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: '',
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change',
        base: 'https://www.telegraph.co.uk',
    },
    {
        name: 'nyt',
        address: 'https://www.nytimes.com/international/section/climate',
        base: '',
    },
    {
        name: 'latimes',
        address: 'https://www.latimes.com/environment',
        base: '',
    },
    {
        name: 'smh',
        address: 'https://www.smh.com.au/environment/climate-change',
        base: 'https://www.smh.com.au',
    },
    {
        name: 'un',
        address: 'https://www.un.org/climatechange',
        base: '',
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.co.uk/news/science_and_environment',
        base: 'https://www.bbc.co.uk',
    },
    {
        name: 'es',
        address: 'https://www.standard.co.uk/topic/climate-change',
        base: 'https://www.standard.co.uk'
    },
    {
        name: 'sun',
        address: 'https://www.thesun.co.uk/topic/climate-change-environment/',
        base: ''
    },
    {
        name: 'dm',
        address: 'https://www.dailymail.co.uk/news/climate_change_global_warming/index.html',
        base: ''
    },
    {
        name: 'nyp',
        address: 'https://nypost.com/tag/climate-change/',
        base: ''
    }
]
const articles = [] //now we have an array full of article urls from the guardian 


newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)

        $('a:contains("climate")', html).each(function () {
                    const title = $(this).text()
                    const url = $(this).attr('href')
                   
                    articles.push({
                        title, 
                        url: newspaper.base + url,
                        source: newspaper.name
                    })
                })

    })
})

app.get('/news', (req, res) => {
    res.json(articles); 
})

app.get('/news/:newspaperId', async (req, res) => {
   //finds which newspaper you mean 
    const newspaperId = req.params.newspaperId 
    
    //how to get the url address of the newspaper in the array if you pass in the id of the newspaper wanted
    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    //now you have the newspaper address/url so you can get all the articles via the same method as before 
    axios.get(newspaperAddress)
    .then(response => {
        const html = response.data 
        const $ = cheerio.load(html)
        const specificArticles = [] //we're gonna push the articles on this specific news site in here about climate 
       
        $('a:contains("climate")', html).each(function () {
            title = $(this).text()
            const url = $(this).attr('href')
            specificArticles.push({
                title,
                url: newspaperBase + url,
                source: newspaperId
            }) 
        })
        res.json(specificArticles);
    }).catch(err => console.log(err))
})