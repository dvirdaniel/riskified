import { IsEnum, IsNotEmpty, IsNumber, IsString} from 'class-validator';
import { CardCompanyEnum } from '../enums/card-company.enum';

export class ChargeModel {

    @IsNotEmpty()
    @IsString()
    fullName: string;

    @IsNotEmpty()
    @IsString()
    creditCardNumber: string;

    @IsNotEmpty()
    @IsEnum(CardCompanyEnum)
    creditCardCopmany: CardCompanyEnum;

    @IsNotEmpty()
    @IsString()
    expirationData: string;

    @IsNotEmpty()
    @IsString()
    cvv: string;

    @IsNotEmpty()
    @IsNumber()
    amount: number;

}
