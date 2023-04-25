
import { createPublicClient, http, createWalletClient, custom } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet, goerli } from 'viem/chains'

export const publicClient = createPublicClient({
  chain: goerli,
  transport: http()
})

export const walletClient = createWalletClient({
  chain: goerli,
  transport: custom(window.ethereum)
})

// JSON-RPC Account
// export const [account] = await walletClient.getAddresses()
// Local Account
// export const account = privateKeyToAccount('0x...')

