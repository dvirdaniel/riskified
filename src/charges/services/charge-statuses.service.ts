import { Injectable } from '@nestjs/common';
import { ChargeStatusModel } from '../models/charge-status.model';

@Injectable()
export class ChargeStatusesService {

    chargeStatuses: Map<string, Map<string, number>> = new Map<string, Map<string, number>>();

    constructor() { }

    setStatus(merchantIdentifier: string, error: string): void {
        if (this.chargeStatuses.has(merchantIdentifier)) {
            const currMap = this.chargeStatuses.get(merchantIdentifier);
            if (currMap.has(error)) {
                currMap.set(error, currMap.get(error)+1);
            } else {
                currMap.set(error, 1);
            }
        } else {
            const newMap = new Map<string, number>();
            newMap.set(error, 1);
            this.chargeStatuses.set(merchantIdentifier, newMap);
        }
    }

    getAllStatuses(merchantIdentifier: string): ChargeStatusModel[] {
        const data: ChargeStatusModel[] = [];
        const statuses = this.chargeStatuses.get(merchantIdentifier);
        statuses?.forEach( (value, key) => {
            data.push(new ChargeStatusModel(key, value));
        })
        return data;
    }
}
