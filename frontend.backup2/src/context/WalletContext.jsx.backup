import { createContext, useContext, useState, useEffect } from 'react';

const WalletContext = createContext();

const MATIC_CHAIN_ID = '0x61'; // BSC Testnet (for testing)
const MATIC_MAINNET_CHAIN_ID = '0x38'; // BSC Mainnet

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('0');
  const [chainId, setChainId] = useState('');
  const [walletType, setWalletType] = useState(''); // 'metamask' or 'zedpay'

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
          setWalletType('metamask');
          await updateBalance(accounts[0]);
          const chain = await window.ethereum.request({ method: 'eth_chainId' });
          setChainId(chain);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const updateBalance = async (addr) => {
    try {
      const bal = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [addr, 'latest'],
      });
      const balanceInBNB = parseInt(bal, 16) / 1e18;
      setBalance(balanceInBNB.toFixed(4));
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const switchToBNBChain = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: MATIC_CHAIN_ID }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: MATIC_CHAIN_ID,
                chainName: 'Polygon Testnet',
                nativeCurrency: {
                  name: 'tBNB',
                  symbol: 'tBNB',
                  decimals: 18,
                },
                rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
                blockExplorerUrls: ['https://testnet.bscscan.com/'],
              },
            ],
          });
        } catch (addError) {
          throw addError;
        }
      } else {
        throw switchError;
      }
    }
  };

  const connectMetaMask = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const chain = await window.ethereum.request({ method: 'eth_chainId' });
      
      if (chain !== MATIC_CHAIN_ID) {
        await switchToBNBChain();
      }

      setAddress(accounts[0]);
      setIsConnected(true);
      setWalletType('metamask');
      setChainId(chain);
      await updateBalance(accounts[0]);

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    } catch (error) {
      console.error('Error connecting MetaMask:', error);
      alert('Failed to connect MetaMask');
    }
  };

  const connectZedpay = async () => {
    try {
      alert('Zedpay integration coming soon!');
      setIsConnected(true);
      setAddress('0xZEDPAY' + Math.random().toString(36).substring(7));
      setBalance('0.0');
      setWalletType('zedpay');
    } catch (error) {
      console.error('Error connecting Zedpay:', error);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setAddress(accounts[0]);
      updateBalance(accounts[0]);
    }
  };

  const handleChainChanged = (newChainId) => {
    setChainId(newChainId);
    window.location.reload();
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress('');
    setBalance('0');
    setChainId('');
    setWalletType('');
    
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
  };

  const connectWallet = connectMetaMask;

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        balance,
        chainId,
        walletType,
        connectWallet,
        connectMetaMask,
        connectZedpay,
        disconnectWallet,
        switchToBNBChain,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
