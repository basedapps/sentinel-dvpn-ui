import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import QRCode from "react-qr-code";

import balanceIcon from "../../assets/images/balanceIcon.svg";
import acceptedToken from "../../assets/images/acceptedToken.svg";
import APIService from "../../API/APIService";
import {Clipboard} from "ts-clipboard";

const AccountScreen = () => {
  const [balance, setBalance] = useState(0);
  const [convertedBalance, setConvertedBalance] = useState(0.0);
  const [walletAddress, setWalletAddress] = useState("");

  const updateBalance = () => {
    const currentWalletAddress = localStorage.getItem("walletAddress")!;
    const currentBalance = localStorage.getItem("currentBalance") ?? "0";

    setWalletAddress(currentWalletAddress);
    setBalance(Number(currentBalance));

    APIService.getBalance(currentWalletAddress)
      .then((response: any) => {
        response.data.balances.forEach((balance: any) => {
          if (balance.denom == "udvpn") {
            const newBalance = Number(balance.amount) / 1000000;
            localStorage.setItem("currentBalance", String(newBalance));
            setBalance(newBalance);
          }
        });
      })
      .catch((e: Error) => {
        //TODO: Unresolvable error
        console.log(e);
      });
  };

  const copyToClipboard = () => {
    Clipboard.copy(walletAddress);
  }

  useEffect(() => {
    updateBalance();
  }, []);

  return (
    <div className="accountScreenContainer">
      <h1 className="header">Account</h1>
      <div className="balanceBlock">
        <h1>Your Balance</h1>
        <div className="balanceWrapper">
          <div className="mainBalanceWrapper">
            <img src={balanceIcon} />
            <span className="balance">{balance}</span>
            <span className="currency">DVPN</span>
          </div>
          <div className="convertedBalanceWrapper">
            <span>~${convertedBalance}</span>
          </div>
        </div>
      </div>

      <div className="howToDeposit">
        <h1>How to deposit?</h1>
        <p>
          You can deposit DVPN to your wallet from any exchange or wallet. Just
          send them to your wallet address. You can copy your wallet address by
          clicking on the button below or by scanning the QR code.
        </p>
        <div className="tokensAcceptedDiv">
          <section className="tokensAcceptedDivLeft">
            <span>Tokens Accepted</span>
            <section className="tokensAcceptedDivLeftBottom">
              <img src={acceptedToken} />
              <span className="tokenSymbol">DVPN</span>
            </section>
          </section>
          {/* <span className="textHowItWorks">How this works?</span> */}
        </div>
        <div className="qrWrapper">
          <QRCode value={walletAddress} />
          <div className="walletAddressWrapper">
            <span className="title">Wallet Address</span>
            <span className="address">{walletAddress}</span>
          </div>
          <button onClick={copyToClipboard} className="button primary">Copy Address</button>
        </div>
      </div>
    </div>
  );
};

export default AccountScreen;
