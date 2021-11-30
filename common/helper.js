const needle = require('needle');
const fs = require('fs');
Intl = require("intl")

export async function retrieveData(params, options, url, pageOption){
    let hasNextPage = true;
    let nextToken = null;
    let userTweets = [];

    console.log("Retrieve data...");

    while (hasNextPage) {
        let resp = await getPage(params, options, nextToken, url, pageOption);
        if (resp) {
            if (resp.data) {
                userTweets.push.apply(userTweets, resp.data);
            }
            if (resp.meta && resp.meta.next_token) {
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
        if (resp.statusCode != 200) {
            console.log(`${resp.statusCode} ${resp.statusMessage}:\n${resp.body.title}`);
            return;
        }
        return resp.body;
    } catch (err) {
        throw new Error(`Request failed: ${err}`);
    }
}

/**
 * 
 * @param {string} path string that points to the file
 */
 export function getJsonData(path) {
    return fs.readFileSync(path, 'utf8');
}

export function getTodayDate() {
    var date = new Date();
    var today = new Date(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate()));
    const df = new Intl.DateTimeFormat('es', { year: 'numeric', month: 'numeric', day: 'numeric' });
    return df.format(today);
}

/**
 * 
 * @param {string} path String that points to the file
 * @param {Array} values Array of objects which contains the keys date and value
 */
export function saveJsonData(path, values) {
    fs.writeFile(path, JSON.stringify(values, null, 2), (error) => {
        if (error) {
            console.log('An error has occurred ', error);
            return;
        }

        console.log("Values saved correctyly at" + path);
    });
}