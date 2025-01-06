const { publicClient } = require('./ViemClient')
const { CONTRACT_ADDRESS } = require('./data')
// async function createFaucet(faucetDetails, admin_account_address) {
//    try {
//     const { request } = await publicClient.simulateContract({
//         account : admin_account_address,
//         address: CONTRACT_ADDRESS,
//         abi: wagmiAbi,
//         functionName: 'createFaucet',
//         args: [faucetDetails]
//       })
//       const result = await walletClient.writeContract(request)
      
//       return {
//         success: true,
//         message: 'Faucet created successfully!',
//         result,
//       }
//     } catch (error) {
//         return {
//             success: false,
//             error: error.message || error,
//         }
//    }
// }


module.exports = {
    collectTokensFromFaucet : async function collectTokensFromFaucet(_token, _to) {
      try {
          const { request } = await publicClient.simulateContract({
              account : _to,
              address: CONTRACT_ADDRESS,
              abi: wagmiAbi,
              functionName: 'collectTokensFromFaucet',
              args: [_token, _to]
            })
          await walletClient.writeContract(request)
            
            return {
              success: true,
              message: 'tokens claimed successfully!',
              result,
            }
          } catch (error) {
              return {
                  success: false,
                  error: error.message || error,
              }
         }
  }
}