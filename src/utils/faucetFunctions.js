const { publicClient, walletClient } = require('./ViemClient')
const { CONTRACT_ADDRESS } = require('./data')
const { FaucetAbi } = require('./abis/tokenFaucetAbi')

module.exports = {
    collectTokensFromFaucet : async function collectTokensFromFaucet(_token, _to) {
      try {
          const { request } = await publicClient.simulateContract({
              account : _to,
              address: CONTRACT_ADDRESS,
              abi: FaucetAbi,
              functionName: 'collectTokensFromFaucet',
              args: [_token, _to]
            })

          // Sign the transaction first
          const signature = await walletClient.signTransaction(request)
          
          // Send the signed transaction
          const hash = await publicClient.sendRawTransaction({
              serializedTransaction: signature
          })
            
            return {
              success: true,
              message: 'Tokens claimed successfully!',
              hash,
            }
          } catch (error) {
              return {
                  success: false,
                  error: error.message || error,
              }
         }
  }
}