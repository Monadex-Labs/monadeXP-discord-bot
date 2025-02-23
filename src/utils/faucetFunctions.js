const { publicClient, walletClient } = require('./ViemClient')
const { CONTRACT_ADDRESS } = require('./data')
const { FaucetAbi } = require('./abis/tokenFaucetAbi')

module.exports = {
    collectTokensFromFaucet : async function collectTokensFromFaucet(_token, _to) {
      try {
          const { request } = await publicClient.simulateContract({
              account : '0xBC92D00c4EbF690ce3f4188b4De86fC9ea723D0c',
              address: CONTRACT_ADDRESS,
              abi: FaucetAbi,
              functionName: 'collectTokensFromFaucet',
              args: [_token, _to]
            })
          // Sign the transaction first
          const signature = await walletClient.signTransaction({...request, data: request.data,
            to: CONTRACT_ADDRESS})
          
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