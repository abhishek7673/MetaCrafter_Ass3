import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
    const [ethWallet, setEthWallet] = useState(undefined);
    const [account, setAccount] = useState(undefined);
    const [atm, setATM] = useState(undefined);
    const [balance, setBalance] = useState(undefined);

    const [depositAmount, setDepositAmount] = useState(0);
    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [LastBalance, setLastBalanceAmount] = useState(0);

    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const atmABI = atm_abi.abi;

    const getWallet = async () => {
        if (window.ethereum) {
            setEthWallet(window.ethereum);
        }

        if (ethWallet) {
            const account = await ethWallet.request({ method: "eth_accounts" });
            handleAccount(account);
        }
    };

    const handleAccount = (account) => {
        if (account) {
            console.log("Account connected: ", account);
            setAccount(account);
        } else {
            console.log("No account found");
        }
    };

    const connectAccount = async () => {
        if (!ethWallet) {
            alert("MetaMask wallet is required to connect");
            return;
        }

        const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
        handleAccount(accounts);

        // once wallet is set we can get a reference to our deployed contract
        getATMContract();
    };

    const getATMContract = () => {
        const provider = new ethers.providers.Web3Provider(ethWallet);
        const signer = provider.getSigner();
        const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

        setATM(atmContract);
    };

    const getBalance = async () => {
        if (atm) {
            setBalance((await atm.getBalance()).toNumber());
        }
    };

    const handleDepositAmountChange = (event) => {
        setDepositAmount(parseInt(event.target.value));
    };

    const handleWithdrawAmountChange = (event) => {
        setWithdrawAmount(parseInt(event.target.value));
    };

    const handleLastBalanceAmountChange = (event) => {
        setLastBalanceAmount(parseInt(event.target.value));
    };

    const deposit = async () => {
        if (atm) {
            let tx = await atm.deposit(depositAmount);
            await tx.wait();
            getBalance();
        }
    };

    const withdraw = async () => {
        if (atm) {
            let tx = await atm.withdraw(withdrawAmount);
            await tx.wait();
            getBalance();
        }
    };

    const lastBalance = async () => {
      if (atm) {
        let tx = await atm.lastBalance(lastBalance);
        await tx.wait();
        getBalance();
    }
    }

    const initUser = () => {
        // Check to see if user has Metamask
        if (!ethWallet) {
            return <p>Please install Metamask in order to use this ATM.</p>;
        }

        // Check to see if user is connected. If not, connect to their account
        if (!account) {
            return (
                <button onClick={connectAccount}>Please connect your Metamask wallet</button>
            );
        }

        if (balance == undefined) {
            getBalance();
        }

        return (
            <div>
                <p><b>Your Account</b></p>
                <p>{account}</p>
                <p><b>Your Balance:</b> {balance}</p>

                <div>
                    <label>Deposit Amount: </label>
                    <input type="number" value={depositAmount} onChange={handleDepositAmountChange} />
                    <button onClick={deposit}>Deposit</button>
                </div>
                <p></p>
                <div>
                    <label>Withdraw Amount: </label>
                    <input type="number" value={withdrawAmount} onChange={handleWithdrawAmountChange} />
                    <button onClick={withdraw}>Withdraw</button>
                </div>
                <p></p>
                <div>
                    <label>Last Balance Amount: </label>
                    <input type="number" value={lastBalance} onChange={handleLastBalanceAmountChange} />
                    <button onClick={lastBalance}>Check</button>
                </div>
            </div>
        );
    };

    useEffect(() => {
        getWallet();
    }, []);

    return (
        <main className="container">
                <header>
                    <h1>Welcome to My ATM!</h1>
                </header>
                <div className="centered-container">
                    {initUser()}
                </div>
            <style jsx>{`

                .container {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    text-shadow: 4px 3px 1px rgba(200, 206, 189, 0.72);
                    width: 100vh;
                    background-color: #ff0000;
                    color: green;
                    font-family: sans-serif;
                    border-radius: 1400px;
                    box-shadow: rgba(1, 2, 3, 0.25) 1px 3px 5px, rgb(51, 51, 51) 1px 3px 5px 6px;
                }

                .centered-container {
                    text-align: center;
                    background-color: #00ffff;
                    padding: 30px;
                    border-radius: 20px;
                    box-shadow: rgba(4, 3, 6, 0.45) 3px 6px 20px;
                }



            `}</style>
        </main>
    );
}
