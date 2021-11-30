import * as helper from '../common/helper';
const url = `https://api.twitter.com/2/users/by`;

const bearerToken = process.env.BEARER_TOKEN;
const jsonPath = './resources/followers.json';

export async function getFollowers() {
    let params = {
        'usernames': 'frenteobreroesp',
        "user.fields": "public_metrics"
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
    var isModified = false;

    var response = await helper.retrieveData(params, options, url, "user");
    if(response && response.length > 0){
        var value = response[0].public_metrics.followers_count;
        if(!newData.find(x => x.date == today)){
            newData.push({
                'date': today,
                'value': value
            });
        }else{
            var index = newData.findIndex(x => x.date == today);
            newData[index].value = value;
            isModified = true;
        }
    }

    if(original.length != newData.length || isModified){
        helper.saveJsonData(jsonPath, newData);
    }

    return newData;
}