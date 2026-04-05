import { IsBoolean, IsEthereumAddress, IsNotEmpty } from 'class-validator';

export class UpdateWhitelistDto {
  @IsNotEmpty()
  @IsEthereumAddress()
  readonly address: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly status: boolean;
}
