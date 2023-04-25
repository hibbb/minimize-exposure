import { publicClient, walletClient } from './utils/client'
import { namehash, normalize } from 'viem/ens'
import { abi } from './utils/abi'
import { createIdentity } from 'eth-crypto/src/create-identity'
import { encryptWithPublicKey, decryptWithPrivateKey } from 'eth-crypto'
import { useState } from 'react'

const identity = createIdentity();


async function saveInfo(infoKey, infoValue) {

  const [account] = await walletClient.requestAddresses() 

  const name = await publicClient.getEnsName({
    address: account
  })

  const node = namehash(name)

  const resolverAddress = await publicClient.getEnsResolver({
    name: normalize(name),
  })

  const encryptedValue = await encryptWithPublicKey(identity.publicKey, infoValue)

  const { request } = await publicClient.simulateContract({
    account,
    address: resolverAddress,
    abi: abi,
    functionName: 'setText',
    args: [node, infoKey, encryptedValue]
  })

  await walletClient.writeContract(request)  
}

async function test() {
  
  const resolverAddress = await publicClient.getEnsResolver({
    name: normalize("ceshi2.eth"),
  })
  console.log(resolverAddress)

  // const decrypted = await decryptWithPrivateKey(identity.privateKey, encrypted)
  // console.log(decrypted)
  // console.log(msg === decrypted)
}



function App() {
  const [infoValue, setInfoValue] = useState("");

  const handleChange = (event) => {
    const { value } = event.target;
    setInfoValue(value);
  };


  return (
    <div className="app">
      <header className="app-header">
        This is Header
      </header>
      <div className="app-content">
        <input id="info" onChange={handleChange} placeholder="Type a piece of information here" />
        <br />
        <button onClick={() => saveInfo("test2-key", infoValue)}>
          Then Click This Button
        </button>
        <br />
        <button onClick={() => test()}>
          Test Button
        </button>
      </div>
    </div>
  );
}

export default App;
