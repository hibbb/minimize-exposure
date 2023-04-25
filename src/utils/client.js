
import { createPublicClient, http, createWalletClient, custom } from 'viem'
import { goerli } from 'viem/chains'

export const publicClient = createPublicClient({
  chain: goerli,
  transport: http()
})

export const walletClient = createWalletClient({
  chain: goerli,
  transport: custom(window.ethereum)
})

