const Token = artifacts.require("MyToken");
const TokenSale = artifacts.require("MyTokenSale");
const KycContract = artifacts.require("KycContract");

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("TokenSale Test", async (accounts) => {

    const [deployerAccount, recipient, anotherAccount] = accounts;

    beforeEach(async () => {
        this.myToken = await Token.deployed();
    });


    it("Should not have any toens in my deployerAccount", async () => {
        let instance = this.myToken;
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
    });

    it("all tokens should be in the TokenSale Smart Contract by default", async () => {
        let instance = this.myToken;
        let balanceOfTokenSaleSmartContract = await instance.balanceOf(TokenSale.address);
        let totalSupply = await instance.totalSupply();
        return expect(balanceOfTokenSaleSmartContract).to.be.a.bignumber.equal(totalSupply);
    });

    it("should be possible to buy tokens", async () => {
        let tokenInstance = this.myToken;
        let tokenSaleInstance = await TokenSale.deployed();
        let kycContractInstance = await KycContract.deployed();
        let balanceBefore = await tokenInstance.balanceOf(deployerAccount);
        await kycContractInstance.setKycCompleted(deployerAccount, { from: deployerAccount });
        expect(tokenSaleInstance.sendTransaction({ from: deployerAccount, value: web3.utils.toWei("1", "wei") })).to.be.fulfilled;
        return expect(tokenInstance.balanceOf(deployerAccount)).to.eventually.be.bignumber.equal(balanceBefore.add(new BN(1)));
    });

});
