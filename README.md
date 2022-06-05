# blockchain-eth-token-sale

## FINAL COURSE ASSIGNMENT

Course: Become An Ethereum Blockchain Developer With One Course. Master Solidity, Web3.JS, Truffle, Metamask, Remix & More!

* Url: https://udemy.com/course/blockchain-developer/
* Teacher: https://udemy.com/user/thomas-wiesner-3/
* Token sale: https://ethereum-blockchain-developer.com/060-tokenization/00-overview/


## Getting started

Copy ```sample.env``` to ```.env``` and fill the needed properties

```
MNEMONIC=YOUR GANACHE/METAMASK MNEMONIC GOES HERE!
INFURA_TOKEN=YOUR INFURA TOKEN HERE!
```

__NEVER COMMIT .env FILE!__


## Dependencies

Run with latest Node 12 LTS -> https://nodejs.org/download/release/latest-erbium/

### Install truffle

```npm install -g truffle```

### get project dependencies installed

Run ```npm install```

Then enter ```client``` directory and run ```npm install```


## Run in local development environment

###  Migrate contracts in develop

Run:

```
$ truffle develop

truffle(develop)> migrate
```

Expected result:
```
Summary
=======
> Total deployments:   4
> Final cost:          0.05717634 ETH
```

__Note:__ Final cost can vary

### Run tests

__Note:__ Ensure ```truffle-config.js``` has the correct developmen ports... check port used when running ```truffle develop``` to adjust the one in ```truffle-config.js```

__Note 2:__ Ensure ```truffle develop``` is running, you will need to open another terminal to run tests

Run ```truffle test```

### Run front end server

Run ```cd client && npm run start```

* This will open browser.. you need metamask installed, you will need to select and connect an account... 
* You will see the Token sale page and you will see the contract address at the buttom that is the same in ```client/src/contracts/MyTokenSale.json ```


## Run with Ganache and run integration test

* You need Ganache installed - https://www.trufflesuite.com/ganache
* You need to configure Ganache network in Metamask

In ```.env``` fill the nemonic properties... best option is use Ganache nemonic and import que keys in metamask

```
MNEMONIC=YOUR GANACHE/METAMASK MNEMONIC GOES HERE!
```

### Running Migrations in Ganache

Run ```truffle migrate --network ganache_local```

* You will need to import primary account to Metamask to whitelist other accounts.
* You can buy/mint tokens with the other accounts (principal account is not alloed)

Then run front server and just try it out


## Publish and run in Rapsten using Infura

You need a Infura account https://infura.io and create a project. Then add your ```project id``` to ```.env``` file

```
INFURA_TOKEN=YOUR INFURA TOKEN HERE!
```

* If you use the same NEMONIC as Ganache, you will use the same accounts.
* You will need to claim Eth tokens using test network faucets.
* You will need Eth in your principal account BEFORE running migrations

Run ```truffle migrate --network ropsten_infura```

## Running tests

Run ```truffle test```
