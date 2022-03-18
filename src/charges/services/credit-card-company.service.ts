import { Injectable } from '@nestjs/common';
import { ChargeModel } from '../models/charge.model';
import { VisaChargeRequestInterface } from '../interfaces/visa-charge-request.interface';
import { MastercardChargeRequestInterface } from '../interfaces/mastercard-charge-request.interface';
import { CreditCardChargeResponseInterface } from '../interfaces/credit-card-charge-response.interface';
import { RetryService } from './retry.service';
import { MastercardChargeResponseInterface } from '../interfaces/mastercard-charge-response.interface';
import { VisaChargeResponseInterface } from '../interfaces/visa-charge-response.interface';

@Injectable()
export class CreditCardCompanyService {

    constructor(private readonly retryService: RetryService) { }

    async callVisa(chargeModel: ChargeModel): Promise<CreditCardChargeResponseInterface> {
        const path = 'visa/api/chargeCard';
        const body: VisaChargeRequestInterface = {
            fullName: chargeModel.fullName,
            number: chargeModel.creditCardNumber,
            expiration: chargeModel.expirationData,
            cvv: chargeModel.cvv,
            totalAmount: chargeModel.amount,
        };
        let response: CreditCardChargeResponseInterface = {};
        const result: VisaChargeResponseInterface = await this.retryService.retry(path, body, this.shouldRetryVisa);
        if (result.chargeResult !== 'Success') {
            response.error = result.resultReason;
        }
        return response;
    }

    private shouldRetryVisa(result: any): boolean {
        let shouldRetry = false;
        if (!result.chargeResult) {
            shouldRetry = true;
        }
        return shouldRetry;
    }

    private shouldRetryMastercard(result: any): boolean {
        let shouldRetry = false;
        if (!result.decline_reason) {
            shouldRetry = true;
        }
        return shouldRetry;
    }

    async callMastercard(chargeModel: ChargeModel): Promise<CreditCardChargeResponseInterface> {
        const path = 'mastercard/capture_card';
        const nameParts = chargeModel.fullName.split(' ');
        const body: MastercardChargeRequestInterface = {
            first_name: nameParts[0],
            last_name: nameParts[1],
            card_number: chargeModel.creditCardNumber,
            expiration: chargeModel.expirationData,
            cvv: chargeModel.cvv,
            charge_amount: chargeModel.amount,
        };
        let response: CreditCardChargeResponseInterface = {};
        const result: MastercardChargeResponseInterface = await this.retryService.retry(path, body, this.shouldRetryMastercard);
        if (result.decline_reason) {
            response.error = result.decline_reason;
        }
        return response;
    }
}
