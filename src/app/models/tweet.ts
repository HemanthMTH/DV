import { OrganicMetric } from "./organic-metrics";

export class Tweet {
    id: string;
    usedId: string;
    text: string;
    domains: string[];
    location: string;
    conversationId: string;
    createdDate: Date;
    organicMetrics: OrganicMetric;

    constructor(id: string, userId: string, 
        conversationId: string, text: string, 
        domains: string[], location: string, createdDate: Date,
        organicMetrics: OrganicMetric){
        this.id = id
        this.usedId = userId
        this.text = text
        this.domains = domains
        this.conversationId = conversationId
        this.location = location
        this.createdDate = createdDate
        this.organicMetrics = organicMetrics
    }
}