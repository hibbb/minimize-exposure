import { createPublicClient, http } from 'viem'
import { mainnet, goerli } from 'viem/chains'

export const publicClient = createPublicClient({
  chain: goerli,
  transport: http()
})
