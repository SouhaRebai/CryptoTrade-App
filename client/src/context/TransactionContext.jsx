import React, {useState, useEffect} from 'react';
import {ethers} from 'ethers';
import {contractAbi, contractAddress } from '../utils/constants';
const { ethereum } = window;

export const TransactionContext = React.createContext();

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionsContract = new ethers.Contract(contractAddress,contractAbi,signer);
    console.log({provider,signer,transactionContract})
    return transactionsContract;
}

export const TransactionProvider = ({children}) => {
    const [currentAccount,setCurrentAccount] = useState('')
    const [formData, setFormData] = useState({
        receiver:'',
        amount:'',
        keyword:'',
        message:''
    })

    const handleChange = (e,name) => {
        //update the state dynamically 
        //it is important that the name in the input tag matches the name in the state !!!
        setFormData((prevState) => ({...prevState, [name]: e.target.value}))
    }

    const checkConnection = async () => {
          try {
            if (!ethereum) return alert("Please install MetaMask.");
            const accounts = await ethereum.request({ method: "eth_accounts" });

            if(accounts.length){
                setCurrentAccount(accounts[0])
                //getAllTransactions
            }else {
                console.log("No accounts found on metamask!")
            }
          } catch (error) {
            console.log(error)
            throw new Error("No ethereum object.")
          }
      
        }
    useEffect(() => {
         checkConnection()
    }, []);

    const sendTransaction = async () => {
        try {
            if (!ethereum) return alert("Please install MetaMask.");
             getEthereumContract();
            const {receiver, amount, keyword, message} = formData;
        } catch (error) {
            console.log(error)
            throw new Error("No ethereum object.")
        }
    }

    const connectWallet = async() => {
        try {
            if (!ethereum) return alert("Please install MetaMask.");
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            setCurrentAccount(accounts[0]);

        } catch (error) {
            console.log(error)
            throw new Error("No ethereum object.")
            
        }

    }
        
        
    return(
        <TransactionContext.Provider value={{
            connectWallet,
            currentAccount,
            formData,
            setFormData,
            handleChange,
            sendTransaction
        }}>
            {children}
        </TransactionContext.Provider>
    );
};