const {createPublicClient, createWalletClient, http} = require('viem')
const { privateKeyToAccount } = require('viem/accounts')
const { defineChain } = require('viem')
require('dotenv').config()
 
const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://monad-testnet.g.alchemy.com/v2/UPvS8k1BQcIWyOVbVf_wjgvnq40gwz3x'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://testnet.monadexplorer.com/' },
  },
})

 
const publicClient = createPublicClient({ 
  chain: monadTestnet,
  transport: http('https://monad-testnet.g.alchemy.com/v2/UPvS8k1BQcIWyOVbVf_wjgvnq40gwz3x')
})

const account = privateKeyToAccount(process.env.PRIVATE_KEY)

const walletClient = createWalletClient({
  account,
  chain: monadTestnet,
  transport: http('https://monad-testnet.g.alchemy.com/v2/UPvS8k1BQcIWyOVbVf_wjgvnq40gwz3x')
})


module.exports = {
    publicClient,
    walletClient,
}