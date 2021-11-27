require('dotenv').config();
import { retrieveData } from '../common/helper';
const url = `https://api.twitter.com/2/users/${process.env.USERID}/followers`;
const bearerToken = process.env.BEARER_TOKEN;

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
    let users = await retrieveData(params, options, url, "user");

    return users.length;
}