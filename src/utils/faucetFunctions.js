const { walletClient } = require('./ViemClient')
const { CONTRACT_ADDRESS } = require('./data')
const { FaucetAbi } = require('./abis/tokenFaucetAbi')
const { encodeFunctionData } = require('viem')

module.exports = {
    collectTokensFromFaucet : async function collectTokensFromFaucet(_token, _to) {
      try {
          // Encode the function data directly
          const data = encodeFunctionData({
            abi: FaucetAbi,
            functionName: 'collectTokensFromFaucet',
            args: [_token, _to]
          })

          const req = await walletClient.prepareTransactionRequest({
            data: data, 
            to: CONTRACT_ADDRESS,
            value: 0n
          })

          // Sign the transaction first
          const signature = await walletClient.signTransaction(req)
          
          // Send the signed transaction
          const hash = await walletClient.sendRawTransaction({
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