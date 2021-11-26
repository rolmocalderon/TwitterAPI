require('dotenv').config();
import express from 'express';
import { getTopElementsCount } from './Tweets-info-Lookup/tweetsInfoLookup'
import { getElements } from './Recent-Search/recent_search'

const app = express();

app.get('/getAll', async (req, res) => {
    var array = [];
    try {
        console.log('Buscando tweets en getAll...');
        var queryString = req.query.d;
        array = await getElements(queryString);
        console.log("Total de twits encontrados:", array.length);
    } catch(e) {
        console.log(e);
    }

    return res.json(JSON.stringify(array));
});

app.get('/getTopCounts', async(req, res) => {
    try{
        console.log('Buscando info en getTopCounts...');
        let queryString = 'from:frenteobreroesp';
        var elements = await getElements(queryString);
        var elements = getTopElementsCount(elements);
        console.log("Info encontrada:", elements.length);
    }catch(e){
        console.log(e);
    }
    
    return res.json(JSON.stringify(elements));
});

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);