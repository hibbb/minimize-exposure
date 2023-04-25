import { publicClient, walletClient } from './utils/client'
import { namehash, normalize } from 'viem/ens'
import { abi } from './utils/abi'

async function getSomething() {
  const [account] = await walletClient.requestAddresses() 
  console.log(account)

  const name = await publicClient.getEnsName({
    address: account
  })
  console.log(name)

  const node = namehash(name)
  console.log(node)

  const { request } = await publicClient.simulateContract({
    account,
    address: '0xd7a4F6473f32aC2Af804B3686AE8F1932bC35750',
    abi: abi,
    functionName: 'setText',
    args: [node, "test-key", "test-value"]
  })

  await walletClient.writeContract(request)  
  console.log("ok")
  
}



function App() {
  return (
    <div className="app">
      <header className="app-header">
        This is Header
      </header>
      <div className="app-content">
        <input id="info" placeholder="Type a piece of information here" />
        <button onClick={() => getSomething()}>
          Then Click This Button
        </button>
      </div>
    </div>
  );
}

export default App;
