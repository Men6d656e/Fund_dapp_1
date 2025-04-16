"use client";
import Web3, { utils } from 'web3'
import React, { useEffect, useState } from 'react'
import FunderArtifact from '../../public/contracts/Funder.json';

function Main() {

    const [web3Api, setWeb3api] = useState({
        provider:null,
        web3:null,
        contract:null
    });

    const [account,setAccount] = useState('');
    const [contractBalance, setContractBalance] = useState('');
    const [numOfFunders, setNumOfFunders] = useState('');

    useEffect(()=>{
        const getAccount = async () => {
            const account = await web3Api.web3.eth.getAccounts()
            setAccount(account[0]);              
        }
        web3Api.web3 && getAccount();
    },[web3Api.web3])

    useEffect(() => {
        const loadProvider = async () => {
          let provider = null;
          if (window.ethereum) {
            provider = window.ethereum;
            try {
              await provider.enable();
            } catch (error) {
              console.error("User denied account access", error);
            }
          } else if (window.web3) {
            provider = window.web3.currentProvider;
          } else if (!process.env.production) {
            provider = new Web3.providers.HttpProvider('http://localhost:7545');
          }
    
          if (provider) {
            const web3Instance = new Web3(provider);
            const networkId = await web3Instance.eth.net.getId();
            const deployedNetwork = FunderArtifact.networks[networkId];
            let contractInstance = null;
    
            if (deployedNetwork) {
              contractInstance = new web3Instance.eth.Contract(
                FunderArtifact.abi,
                deployedNetwork.address
              );
            } else {
              console.error('Contract not deployed to the current network.');
            }
    
            setWeb3api({
              web3: web3Instance,
              provider,
              contract: contractInstance,
            });
          }
        };
    
        loadProvider();
      }, []);


      useEffect(() => {
        const loadContractData = async () => {
          if (web3Api.contract) {
            const balance = await web3Api.web3.eth.getBalance(web3Api.contract.options.address);
            setContractBalance(web3Api.web3.utils.fromWei(balance, 'ether'));
    
            const fundersCount = await web3Api.contract.methods.numOfFunders().call();
            setNumOfFunders(fundersCount);
          }
        };
    
        loadContractData();
      }, [web3Api.contract, web3Api.web3]);





    async function connectMetaMAsk() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  }


  const handleTransfer = async () => {
    if (web3Api.contract && account) {
      try {
        // await web3Api.contract.transfer(
        //     from:account,value:
        // )
        const amountToSend = web3Api.web3.utils.toWei('1', 'ether'); // Example amount
        await web3Api.contract.methods.transfer().send({ from: account, value: amountToSend });
        // Optionally update contract balance and funders count after transfer
        const balance = await web3Api.web3.eth.getBalance(web3Api.contract.options.address);
        setContractBalance(web3Api.web3.utils.fromWei(balance, 'ether'));
        const fundersCount = await web3Api.contract.methods.numOfFunders().call();
        setNumOfFunders(fundersCount);
      } catch (error) {
        console.error("Error during transfer:", error);
      }
    } else {
      alert("Please connect to MetaMask and ensure the contract is loaded.");
    }
  };

  const handleWithdraw = async () => {
    if (web3Api.contract && account) {
      try {
        const amountToWithdraw = web3Api.web3.utils.toWei('1', 'ether'); // Example amount
        await web3Api.contract.methods.withdraw(amountToWithdraw).send({ from: account });
        // Optionally update contract balance after withdrawal
        const balance = await web3Api.web3.eth.getBalance(web3Api.contract.options.address);
        setContractBalance(web3Api.web3.utils.fromWei(balance, 'ether'));
      } catch (error) {
        console.error("Error during withdrawal:", error);
      }
    } else {
      alert("Please connect to MetaMask and ensure the contract is loaded.");
    }
  };

  

  return (
    <div className='flex w-full flex-col text-center my-5 justify-center items-center'>
        <div className='bg-purple-600 py-3 font-extrabold w-full text-3xl'>Funding</div>
        <div className='my-5 p-3 rounded-sm bg-zinc-900  py-6 flex gap-5 flex-col w-[600px]'>
            <h1>Balance: {contractBalance && contractBalance} </h1>
            <p>Account: {account ? account : "not connected"}</p>
            <p>Numer of Funders: {numOfFunders && numOfFunders}</p>
        </div>
        <div className='flex gap-10 p-5'>
            <button onClick={connectMetaMAsk} className='bg-green-600 rounded-sm px-5 py-3'>Connect To Metaask</button>
            <button onClick={handleTransfer} className='bg-blue-600 rounded-sm px-5 py-3'>transfer</button>
            <button onClick={handleWithdraw} className='bg-amber-600 rounded-sm px-5 py-3'>widthRaw</button>
        </div>
    </div>
  )
}

export default Main