import { Injectable } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { AxiosRequestConfig } from "axios";

const MAX_RETRY_ATTEMPT_COUNT = 3;

@Injectable()
export class RetryService {

    constructor(private readonly httpService: HttpService) { }

    private async callCompanyApi(path: string, body: object) {
        const method = 'POST';
        const url = `https://interview.riskxint.com/${path}`;
        const config: AxiosRequestConfig = {
            headers: {
                'identifier': 'dvir',
                'Content-Type': 'application/json',
            },
        };
        return await this.httpService.post(url, body, config).toPromise().then( value => {
            return value.data;
        }).catch( reason => {
            return reason.response?.data;
        });
    }

    async retry(path: string, body: object, shouldRetry: (result: any) => boolean) {
        let values;
        let retry = true;
        let attemptCount: number = 1;
        while (attemptCount <= MAX_RETRY_ATTEMPT_COUNT && retry) {
            const waitTimeInSeconds = Math.pow(attemptCount, 2) * 1000;
            values = await Promise.all([
                this.callCompanyApi(path, body),
                this.timeout(waitTimeInSeconds)
            ]);
            retry = shouldRetry(values[0]);
            attemptCount++;
        }

        if (attemptCount > MAX_RETRY_ATTEMPT_COUNT) {
            return {};
        } else {
            return values[0];
        }
    }

    private timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
