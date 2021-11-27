require('dotenv').config();
import express from 'express';
import { getElements } from './Recent-Search/recent_search';
import { getFollowers } from './Follows-Lookup/followers_lookup';
import { getUserTweets, getTopElementsCount } from './User-Tweet-Timeline/user_tweets';

const app = express();

app.get('/getAll', async (req, res) => {
    var array = [];
    try {
        console.log('Buscando tweets en getAll...');
        var queryString = req.query.d;
        array = await getElements(queryString);
        console.log("Total de twits encontrados:", array.length);
    } catch(e) {
        console.log("getAll failed", e);
    }

    return res.json(JSON.stringify(array));
});

app.get('/getTopCounts', async(req, res) => {
    try{
        console.log('Buscando info en getTopCounts...');
        var userTweets = await getUserTweets();
        var elements = getTopElementsCount(userTweets);
        console.log("Info encontrada:", elements);
    }catch(e) {
        console.log("getTopCounts", e);
    }
    
    return res.json(JSON.stringify(elements));
});

app.get('/getFollowers', async(req, res) => {
    try{
        console.log('Buscando data en getFollowers...');
        var followers = await getFollowers();
        console.log("Numero de followers", followers);
    }catch(e) {
        console.log("getFollowers", e);
    }

    return res.json(JSON.stringify(followers));
});

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);