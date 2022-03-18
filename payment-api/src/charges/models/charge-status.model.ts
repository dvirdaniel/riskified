export class ChargeStatusModel {
    reason: string;
    count: number;

    constructor(reason: string, count: number) {
        this.reason = reason;
        this.count = count;
    }
}
