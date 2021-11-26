require('dotenv').config();
const needle = require('needle');
const bearerToken = process.env.BEARER_TOKEN;

const endpointUrl = 'https://api.twitter.com/2/tweets/search/recent';

export async function getElements(queryString){
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

async function getRequest(endTime, queryString) {
    let params = {
        'max_results': 100,
        'tweet.fields': 'created_at,public_metrics'
    }

    params.query = queryString ? queryString : '("' + process.env.PRINCIPALSEARCH + '" OR @' + process.env.PRINCIPALACCOUNTSEARCH + ') -is:retweet';

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