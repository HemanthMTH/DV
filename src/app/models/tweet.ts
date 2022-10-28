export class Tweet {
    id: string;
    usedId: string;
    text: string;
    domain: string;

    constructor(id: string, userId: string, text: string, domain: string){
        this.id = id
        this.usedId = userId
        this.text = text
        this.domain = domain
    }
}