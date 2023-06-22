const express = require('express');
const NewsItem = require('./models/newsItem');
const axios = require('axios');
const xml2js = require('xml2js');
const mongoose = require('mongoose');
const cors=require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

const url='mongodb+srv://sankar:sankar@cluster0.xg5jwpa.mongodb.net/';
const db=async ()=>{
    try{
        await mongoose.connect(url);
        console.log("database connected");
    }
    catch(err){
        console.log(err);
    }
}

db();

app.get('/api/news', async(req, res) => {
  const rssFeedUrl = 'https://feeds.feedburner.com/ndtvnews-top-stories';
  
  axios.get(rssFeedUrl)
    .then(response => {
      const parser = new xml2js.Parser();
      parser.parseString(response.data, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Error parsing RSS feed data' });
        } else {
          const items = result.rss.channel[0].item;
          const newsList = items.map(item => ({
            title: item.title[0],
            description: item.description[0],
            image: item.enclosure?.[0].$.url
          }));
          res.json(newsList);
        }
      });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Error fetching news data' });
    });
});



app.post('/api/favorites', (req, res) => {
  try{
    const favorite=new NewsItem(req.body);
    favorite.save();
    res.json(favorite);
  }
  catch{
    console.log(err);
  }
});

app.get('/api/favorites', async (req, res) => {
  try{
    const favorites=await NewsItem.find();
    res.json(favorites);
  }
  catch(err){
    console.log(err);
  }
});
  