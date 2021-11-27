const needle = require('needle');

export async function retrieveData(params, options, url, pageOption){
    let hasNextPage = true;
    let nextToken = null;
    let userTweets = [];

    console.log("Retrieve data...");

    while (hasNextPage) {
        let resp = await getPage(params, options, nextToken, url, pageOption);
        if (resp && resp.meta && resp.meta.result_count && resp.meta.result_count > 0) {
            if (resp.data) {
                userTweets.push.apply(userTweets, resp.data);
            }
            if (resp.meta.next_token) {
                nextToken = resp.meta.next_token;
            } else {
                hasNextPage = false;
            }
        } else {
            hasNextPage = false;
        }
    }

    return userTweets;
}

const getPage = async (params, options, nextToken, url, pageOption) => {
    if (nextToken) {
        if(pageOption === "tweet"){
            params.next_token = nextToken;
        }else{
            params.pagination_token = nextToken;
        }
    }

    try {
        const resp = await needle('get', url, params, options);
        console.log(resp);
        if (resp.statusCode != 200) {
            console.log(`${resp.statusCode} ${resp.statusMessage}:\n${resp.body.title}`);
            return;
        }
        return resp.body;
    } catch (err) {
        throw new Error(`Request failed: ${err}`);
    }
}