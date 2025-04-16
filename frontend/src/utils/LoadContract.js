// import contract from '@truffle'

// export const loadContract = async (name,provider) => {
//     const response = await fetch(`/contracts/${name}.json`)
//     const Artifact = await response.json();
//     const _contract = contract(Artifact);
//     _contract.setProvider(provider);
//     const deployedContract = await _contract.deployed();
//     return deployedContract
// }


import Web3 from 'web3';
import FunderArtifact from '../../public/contracts/Funder.json'; // Adjust path if needed


const getContractInstance = async (web3) => {
    if (!web3) {
      return null;
    }
  
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = FunderArtifact.networks[networkId];
  
    if (deployedNetwork) {
      const instance = new web3.eth.Contract(
        FunderArtifact.abi,
        deployedNetwork.address
      );
      return instance;
    } else {
      console.error('Contract not deployed to the current network.');
      return null;
    }
  };
  
  export {  getContractInstance };