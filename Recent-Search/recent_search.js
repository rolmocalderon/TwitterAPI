require('dotenv').config();
import { retrieveData } from '../common/helper';
const bearerToken = process.env.BEARER_TOKEN;
const endpointUrl = 'https://api.twitter.com/2/tweets/search/recent';

export async function getElements(queryString){
    let params = {
        'max_results': 100,
        'tweet.fields': 'created_at,public_metrics'
    };

    params.query = queryString ? queryString : '("' + process.env.PRINCIPALSEARCH + '" OR @' + process.env.PRINCIPALACCOUNTSEARCH + ') -is:retweet';

    const options = {
        headers: {
            "User-Agent": "v2TweetsJS",
            "authorization": `Bearer ${bearerToken}`
        }
    };

    let tweets = await retrieveData(params, options, endpointUrl, "tweet");

    return tweets;
}