require('dotenv').config();
const needle = require('needle');
import express from 'express';
import { getTopRetweetsCount } from './Retweets-Lookup/retweeted_by'

const bearerToken = process.env.TOKEN;
const endpointUrl = 'https://api.twitter.com/2/tweets/search/recent';
const app = express();

app.get('/getAll', async (req, res) => {
    var array = [];
    try {
        console.log('-----------');
        console.log('Buscando tweets...');
        var queryString = req.query.d;
        array = getElements(queryString);
        console.log("Total de twits encontrados:", array.length);
        console.log('-----------')

    } catch(e) {
        console.log(e);
    }

    return res.json(JSON.stringify(array));
});

app.get('/getRt', async(req, res) => {
    let queryString = 'from:frenteobreroesp';
    var elements = await getElements(queryString);
    var rt = getTopRetweetsCount(elements);

    console.log('rt', rt);
    return res.json(JSON.stringify(elements));
});

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);

async function getRequest(endTime, queryString) {
    let params = {
        'max_results': 100,
        'tweet.fields': 'created_at,public_metrics'
    } 

    if(queryString){
        params.query = queryString;
    }else{
        params.query = '("' + process.env.PRINCIPALSEARCH + '" OR @' + process.env.PRINCIPALACCOUNTSEARCH + ') -is:retweet';
    }

    if(endTime){
        params.end_time = endTime;
    }

    const res = await needle('get', endpointUrl, params, { headers: {
        "authorization": `Bearer ${bearerToken}`
    }});

    if(res.body) {
        return res.body;
    } else {
        throw new Error ('Unsuccessful request');
    }
}

async function getElements(queryString){
    var response = {};
    var elements = [];
    do{
        let date = response.data ? response.data[response.data.length - 1].created_at : undefined;
        response = await getRequest(date, queryString);
        if(response.data && response.data.length > 0 ){
            
            elements = elements.concat(response.data);
        }
    }while(response.data && response.data.length > 0);

    return elements;
}