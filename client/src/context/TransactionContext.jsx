import React, {useState, useEffect} from 'react';
import {ethers} from 'ethers';
import {contractAbi, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const transactionsContract = new ethers.Contract(contractAddress,contractAbi,signer);
    return transactionsContract;
}

export const TransactionProvider = ({children}) => {
    const [currentAccount,setCurrentAccount] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'))
    const [formData, setFormData] = useState({
        receiver:'',
        amount:'',
        keyword:'',
        message:''
    })
    const [transactions, setTransactions] = useState([]);
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
                getAllTransactions();
            }else {
                console.log("No accounts found on metamask!")
            }
          } catch (error) {
            console.log(error)
          }
      
    }

    const checkIfTransactionsExist = async () => {
        try {
            const transactionsContract =  getEthereumContract();
            const transactionsCount = await transactionsContract.getTransactionsCount();
            window.localStorage.setItem("transactionsCount",transactionsCount)
        } catch (error) {
            console.log(error)

        }
    }

    const getAllTransactions = async () => {
        try {
            if (ethereum) {
              const transactionsContract = getEthereumContract();
      
              const availableTransactions = await transactionsContract.getAllTransactions();
      
              const structuredTransactions = availableTransactions.map((transaction) => ({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: parseInt(transaction.amount._hex) / (10 ** 18)
              }));
      
              console.log(structuredTransactions);
      
              setTransactions(structuredTransactions);
            } else {
              console.log("Ethereum is not present");
            }
          } catch (error) {
            console.log(error);
          }
        }
      
    useEffect(() => {
         checkConnection()
         checkIfTransactionsExist()
    }, []);

    const sendTransaction =  async() => {
        try {
            if (!ethereum) return alert("Please install MetaMask.");
            const transactionsContract =  getEthereumContract();
            const {receiver, amount, keyword, message} = formData;
            const parsedAmount = ethers.utils.parseEther(amount); 
            //amount has to be converted to hex

            await ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                  from: currentAccount,
                  to: receiver,
                  gas: "0x5208", // transaction fee =21000 Gwei = 0.000021 ETH
                  value: parsedAmount._hex,
                }],
            });
            //the code above only does the transaction 
            //we need to provide the code that will store in the blockchain
            const transactionHash = await transactionsContract.addTransaction(receiver, parsedAmount, message, keyword);

            //a transaction takes time -- we need a loading state
            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`)
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`Success - ${transactionHash.hash}`)

            const transactionsCount = await transactionsContract.getTransactionsCount();
            setTransactionCount(transactionsCount.toNumber());


        } catch (error) {
            console.log(error)
        }
    }

    const connectWallet = async() => {
        try {
            if (!ethereum) return alert("Please install MetaMask.");
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            setCurrentAccount(accounts[0]);

        } catch (error) {
            console.log(error)
            
        }

    }
        
        
    return(
        <TransactionContext.Provider value={{
            connectWallet,
            currentAccount,
            formData,
            transactionCount,
            setFormData,
            handleChange,
            sendTransaction,
            getAllTransactions,
            transactions
        }}>
            {children}
        </TransactionContext.Provider>
    );
};