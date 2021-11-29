import * as helper from '../common/helper';
const url = `https://api.twitter.com/2/users/${process.env.USERID}/followers`;
const bearerToken = process.env.BEARER_TOKEN;
const jsonPath = './resources/followers.json';

export async function getFollowers() {
    let params = {
        "max_results": 1000,
        "user.fields": "created_at"
    };

    const options = {
        headers: {
            "User-Agent": "v2FollowersJS",
            "authorization": `Bearer ${bearerToken}`
        }
    };

    console.log("Retrieving followers...");

    var original = JSON.parse(helper.getJsonData(jsonPath));
    var newData = [...original];

    var today = helper.getTodayDate();
    console.log(today)
    if(newData.length === 0 || !newData.find(x => x.date == today)){
        var value = await helper.retrieveData(params, options, url, "user");
        console.log(today)
        newData.push({
            'date': today,
            'value': value.length
        });
    }

    if(original.length != newData.length){
        helper.saveJsonData(jsonPath, newData);
    }

    return newData;
}