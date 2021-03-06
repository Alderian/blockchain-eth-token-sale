import React, { Component } from "react";
import MyToken from "./contracts/MyToken.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import KycContract from "./contracts/KycContract.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { loaded: false, kycAddress: '0x1234...', tokenSaleAddress: null, userTokens: 0 };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();

      this.tokenInstance = new this.web3.eth.Contract(
        MyToken.abi,
        MyToken.networks[this.networkId] && MyToken.networks[this.networkId].address,
      );

      this.tokenSaleInstance = new this.web3.eth.Contract(
        MyTokenSale.abi,
        MyTokenSale.networks[this.networkId] && MyTokenSale.networks[this.networkId].address,
      );
      this.kycInstance = new this.web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[this.networkId] && KycContract.networks[this.networkId].address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.listenToTokenTransfer();
      this.updateTotalSupply();
      this.setState({ loaded: true, tokenSaleAddress: MyTokenSale.networks[this.networkId].address }, this.updateUserTokens);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  updateUserTokens = async () => {
    let userTokens = await this.tokenInstance.methods.balanceOf(this.accounts[0]).call();
    this.setState({ userTokens: userTokens });
  }

  updateTotalSupply = async () => {
    let totalSupply = await this.tokenInstance.methods.totalSupply().call();
    this.setState({ totalSupply: totalSupply });
  }
  listenToTokenTransfer = () => {
    this.tokenInstance.events.Transfer({ to: this.accounts[0] }).on("data", this.updateUserTokens);
  }

  handleBuyTokens = async () => {
    await this.tokenSaleInstance.methods.buyTokens(this.accounts[0]).send({ from: this.accounts[0], value: this.web3.utils.toWei("100", "wei") });
    this.updateTotalSupply();
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  };

  handleKycWhitelisting = async () => {
    await this.kycInstance.methods.setKycCompleted(this.state.kycAddress).send({ from: this.accounts[0] });
    alert("KYC for " + this.state.kycAddress + " is completed");
  };

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>StarDucks Cappucino Token Sale!</h1>
        <h2>Hi {this.accounts[0]}!<br />
          Get your tokens today!</h2>
        <table className="center" style={{ padding: "20px" }}>
          <tr>
            <td style={{ padding: "20px" }}>
              <h2>KYC whitelisting</h2>
              <p>Address to allow: <input type="text" name="kycAddress" value={this.state.kycAddress} onChange={this.handleInputChange} /></p>
              <button type="button" onClick={this.handleKycWhitelisting} >Add to whitelist</button>
            </td>
            <td style={{ padding: "20px" }}>
              <h2>Buy Tokens</h2>
              <p>If you want to buy tokens, send Wei to this address:<br /> {this.state.tokenSaleAddress}</p>
              <button type="button" onClick={this.handleBuyTokens}>Buy 100 tokens</button>
            </td>
          </tr>
        </table>
        <p>You currently have: {this.state.userTokens} CAPPU in you wallet</p>
        <p><strong>Total supply: {this.state.totalSupply}</strong> (minting on every sale!)</p>
      </div>
    );
  }
}

export default App;
