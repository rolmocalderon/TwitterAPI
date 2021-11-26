
export function getTopRetweetsCount(elements) {
    var maxRts = [];
    for(let element of elements){
        let elementRtCount = element.public_metrics.retweet_count;
        if(maxRts.length > 4) {
            if(Math.min(...maxRts) < elementRtCount){
                let index = maxRts.findIndex(x => Math.min(...maxRts) == x);
                maxRts[index] = Number(elementRtCount);
            }
        }else{
            maxRts.push(Number(elementRtCount));
        }
    }

    maxRts.sort(function(a, b) {
      return a < b;
    });

    return maxRts;
}