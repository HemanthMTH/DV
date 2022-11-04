export class Tweet {
    id: string;
    usedId: string;
    text: string;
    domains: string[];
    location: string;
    conversationId: string;

    constructor(id: string, userId: string, conversationId: string, text: string, domains: string[], location: string){
        this.id = id
        this.usedId = userId
        this.text = text
        this.domains = domains
        this.conversationId = conversationId
        this.location = location
    }
}