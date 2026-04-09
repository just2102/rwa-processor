import {
  IsEthereumAddress,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsPositive,
} from 'class-validator';

export class MintTokensDto {
  @IsNotEmpty()
  @IsEthereumAddress()
  readonly address: string;

  @IsNotEmpty()
  @IsString()
  readonly amount: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly chainId: number;
}
