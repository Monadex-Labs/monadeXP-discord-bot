const {createPublicClient, createWalletClient, http} = require('viem')
const { privateKeyToAccount } = require('viem/accounts')
const { defineChain } = require('viem')
 
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
      http: ['https://testnet-rpc.monad.xyz/'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://testnet.monadexplorer.com/' },
  },
})

require('dotenv').config()
 
const publicClient = createPublicClient({ 
  chain: monadTestnet,
  transport: http()
})

const account = privateKeyToAccount(process.env.PRIVATE_KEY)

const walletClient = createWalletClient({
  account,
  chain: monadTestnet,
  transport: http()
})


module.exports = {
    publicClient,
    walletClient,
}