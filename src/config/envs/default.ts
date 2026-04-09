import { Hex } from 'viem';

export const config = {
  db: {
    // entities: [`${__dirname}/../../entity/**/*.{js,ts}`],
    // subscribers: [`${__dirname}/../../subscriber/**/*.{js,ts}`],
    // migrations: [`${__dirname}/../../migration/**/*.{js,ts}`],
  },
  blockchain: {
    privateKey: process.env.PRIVATE_KEY as Hex | undefined,
  },
};
