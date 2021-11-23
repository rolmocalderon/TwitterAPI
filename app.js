require('dotenv').config();
const needle = require('needle');
import express from 'express';

const bearerToken = process.env.TOKEN;
const endpointUrl = 'https://api.twitter.com/2/tweets/search/recent'

const app = express();

app.get('/getAll', async (req, res) => {
    var array = [];
    try {
        console.log('-----------');
        console.log('Buscando tweets...');
        var response = {};
        do{
            let date = response.data ? response.data[response.data.length - 1].created_at : undefined;
            response = await getRequest(date);
            if(response.data && response.data.length > 0 ){
                
                array = array.concat(response.data);
            }
        }while(response.data && response.data.length > 0)
        console.log("Total de twits encontrados:", array.length);
        console.log('-----------')

    } catch(e) {
        console.log(e);
    }

    return res.json(JSON.stringify(array));
});

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);

async function getRequest(endTime) {

    // Edit query parameters below
    let params = {
        'query': '("Frente Obrero" OR @frenteobreroesp) -is:retweet',
        'max_results': 100,
        'tweet.fields': 'created_at'
    } 

    if(endTime){
        params.end_time = endTime;
    }

    const res = await needle('get', endpointUrl, params, { headers: {
        "authorization": `Bearer ${bearerToken}`
    }})

    if(res.body) {
        return res.body;
    } else {
        throw new Error ('Unsuccessful request')
    }
}