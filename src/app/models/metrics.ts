export class Metric {
    fake_follower: number;
    financial: number;
    overall: number;
    self_declared: number;
    spammer: number

    constructor(fake_follower: number,
        financial: number,
        overall: number,
        self_declared: number,
        spammer: number){
        this.fake_follower = fake_follower
        this.financial = financial
        this.overall = overall
        this.self_declared = self_declared
        this.spammer = spammer
    }
}