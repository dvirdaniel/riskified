import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ChargesController } from './controllers/charges.controller';
import { ChargesService } from './services/charges.service';
import { CreditCardCompanyService } from './services/credit-card-company.service';
import { RetryService } from './services/retry.service';
import { ChargeStatusesService } from './services/charge-statuses.service';
import { MerchantIdentifierMiddleware } from './middleware/merchant-identifier.middleware';

@Module({
    imports: [ HttpModule ],
    controllers: [ChargesController],
    providers: [ChargesService, CreditCardCompanyService, RetryService, ChargeStatusesService],
})
export class ChargesModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(MerchantIdentifierMiddleware)
            .forRoutes(ChargesController);
    }
}
