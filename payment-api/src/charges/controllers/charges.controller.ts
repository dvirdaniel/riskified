import { Body, Controller, Get, Headers, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { ChargesService } from '../services/charges.service';
import { ChargeModel } from '../models/charge.model';
import { ChargeStatusesService } from '../services/charge-statuses.service';
import { CreditCardChargeResponseInterface } from '../interfaces/credit-card-charge-response.interface';

@Controller()
export class ChargesController {

    constructor(private readonly chargesService: ChargesService,
                private readonly chargeStatusesService: ChargeStatusesService) {}

    @Get('/chargeStatuses')
    async chargeStatuses(@Headers() headers, @Req() req, @Res() res) {
        const data = await this.chargeStatusesService.getAllStatuses(headers['merchant-identifier']);
        return res.status(HttpStatus.OK).json(data);
    }

    @Post('charge')
    async charge(@Headers() headers, @Req() req, @Res() res, @Body() chargeModel: ChargeModel) {
        let status = HttpStatus.OK;
        let response: CreditCardChargeResponseInterface = {};
        try {
            response = await this.chargesService.charge(chargeModel);
            if (response?.error) {
                this.chargeStatusesService.setStatus(headers['merchant-identifier'], response.error);
            }
        } catch (error) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return res.status(status).json(response);
    }

}
