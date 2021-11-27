require('dotenv').config();
import { retrieveData } from '../common/helper';
const url = `https://api.twitter.com/2/users/${process.env.USERID}/tweets`;
const bearerToken = process.env.BEARER_TOKEN;

export async function getUserTweets() {
    let params = {
        "max_results": 100,
        'tweet.fields': 'created_at,public_metrics',
        "expansions": "author_id",
        "exclude": "retweets"
    }

    const options = {
        headers: {
            "User-Agent": "v2UserTweetsJS",
            "authorization": `Bearer ${bearerToken}`
        }
    }

    let userTweets = await retrieveData(params, options, url, "user");

    return userTweets;
}

export function getTopElementsCount(elements) {
    var values = {
      'retweets': getTopCounts(elements, 'retweet_count'),
      'likes': getTopCounts(elements, 'like_count')
    }

    return values;
}

function getTopCounts(elements, metricKey){
  var maxValues = [];
  for(let element of elements){
      let elementRtCount = element.public_metrics[metricKey];
      if(maxValues.length >= process.env.TOPCOUNTS) {
          if(Math.min(...maxValues) < elementRtCount){
              let index = maxValues.findIndex(x => Math.min(...maxValues) == x);
              maxValues[index] = Number(elementRtCount);
          }
      }else{
          maxValues.push(Number(elementRtCount));
      }
  }

  maxValues.sort(function(a, b) {
    return a < b;
  });

  return maxValues;
}