export class OrganicMetric {
    impression_count: number;
    like_count: number;
    reply_count: number;
    retweet_count: number;
    url_link_clicks: number;
    user_profile_clicks: number;

    constructor(impression_count: number,
        like_count: number,
        reply_count: number,
        retweet_count: number,
        url_link_clicks: number,
        user_profile_clicks: number){
            this.impression_count = impression_count
            this.like_count = like_count
            this.reply_count = reply_count
            this.retweet_count = retweet_count
            this.url_link_clicks = url_link_clicks,
            this.user_profile_clicks = user_profile_clicks
    }
}