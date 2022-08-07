# Group C projet 4 Alyra: DEFI

## 30/07/2022 - Mickael,  Stephane, Nordine

- création du repo BinaryLost/alyra_defi
- création d'un truffle init et commit sur le repo
- partage des infos ( exemple de front, lien d'un smart contract de staking)
- prise du nouveau meet 31/07/2022 9:30

## ...

## Tests unitaires du contrat "Staking"




~/alyra_defi/truffle$ truffle test
Using network 'development'.

Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.
Reward Token Address 0x992055D40Ff2AD47dDfa6cB0A6c8Da67A3efdf2d
Staking Contract Address 0xB99030BECE3bb5cb868dCcf768A8C6c375aD1408


  Contract: Staking
    Stake tokens
      ✔ refuse to stake 0 tokens (1220ms)
      ✔ my staked value (dollars) should be 0 as no token is staked (1250ms)
      ✔ stake LINK tokens (1389ms)
      ✔ total staked value should increase the amount I stake (1291ms)
      ✔ withdraw a part of my deposit (1566ms)
      ✔ withdraw all my deposit & verify my ERC20 balance (1423ms)
    Rewards
      ✔ initial earning is 0 (557ms)
      ✔ stake & earn rewards (1335ms)
      ✔ claim rewards (1638ms)

  9 passing (31s)

___________________________________________________________________________________________________________________________________________
## Utilisation

1. `npm install`
2. `truffle test`
