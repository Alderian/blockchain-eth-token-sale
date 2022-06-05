const Token = artifacts.require("MyToken");

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("Token test", async (accounts) => {

    const [deployerAccount, recipient, anotherAccount] = accounts;

    beforeEach(async () => {
        this.myToken = await Token.new();
    });

    it("all tokens should be in my account", async () => {
        let instance = this.myToken;
        await this.myToken.mint(deployerAccount, new BN(10));
        let totalSupply = await instance.totalSupply();
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
    });

    it("is possible to send tokens between accounts", async () => {
        const sendTokens = 10;
        let instance = this.myToken;
        await instance.mint(deployerAccount, new BN(sendTokens));

        let totalSupply = await instance.totalSupply();
        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);

        expect(instance.transfer(recipient, sendTokens)).to.eventually.be.fulfilled;
        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
        return expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(sendTokens));
    });

    it("is not possible to send more tokens that are available", async () => {
        let instance = this.myToken;
        await instance.mint(deployerAccount, new BN(10));
        let totalSupply = await instance.totalSupply();
        let balanceOfDeployer = await instance.balanceOf(deployerAccount);

        expect(instance.transfer(recipient, new BN(balanceOfDeployer + 1))).to.eventually.be.rejected;
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
    });

});
