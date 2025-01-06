const {createPublicClient, http} = require('viem')
const {baseSepolia}  =  require('viem/chains')
 
const publicClient = createPublicClient({ 
  chain: baseSepolia,
  transport: http()
})

module.exports = {
    publicClient, 
}