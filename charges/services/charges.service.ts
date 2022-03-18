import { Injectable } from '@nestjs/common';
import { ChargeModel } from '../models/charge.model';
import { CreditCardCompanyService } from './credit-card-company.service';
import { CardCompanyEnum } from '../enums/card-company.enum';
import { CreditCardChargeResponseInterface } from '../interfaces/credit-card-charge-response.interface';

@Injectable()
export class ChargesService {

    constructor(private creditCardCompanyService: CreditCardCompanyService,
                ) { }

    async charge(chargeModel: ChargeModel): Promise<CreditCardChargeResponseInterface> {
        switch (chargeModel.creditCardCopmany) {
            case CardCompanyEnum.Visa:
                return await this.creditCardCompanyService.callVisa(chargeModel);
                break;
            case CardCompanyEnum.Mastercard:
                return await this.creditCardCompanyService.callMastercard(chargeModel);
                break;
            default:
                throw new Error(`Credit card company ${chargeModel.creditCardCopmany} currently is not supported!`);
                break;
        }
    }
}
