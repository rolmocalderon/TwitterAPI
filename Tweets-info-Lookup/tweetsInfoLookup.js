
require('dotenv').config();

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