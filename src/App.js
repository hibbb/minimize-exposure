import { useState } from 'react'
import { toHex, fromHex } from 'viem'
import { namehash, normalize } from 'viem/ens'
import { createIdentity } from 'eth-crypto/src/create-identity'
import { encryptWithPublicKey, decryptWithPrivateKey } from 'eth-crypto'
import { abi } from './utils/abi'
import { publicClient, walletClient } from './utils/client'

function App() {

  const [infoValue, setInfoValue] = useState("");
  const [infoSaved, setInfoSaved] = useState(false);
  const [decryptedValue, setDecryptedValue] = useState("");

  const handleChange = (event) => {
    const { value } = event.target;
    setInfoValue(value);
  };

  const createIdentityAndSave = () => {
    const identity = createIdentity()
    window.localStorage.setItem('thirdPartyKeyPair', JSON.stringify(identity))
    return identity
  }
  
  const thirdParty = JSON.parse(window.localStorage.getItem('thirdPartyKeyPair')) ?? createIdentityAndSave()
  const infoKey = "test-key-5"
  
  async function saveInfo(infoKey, infoValue) {
  
    const [account] = await walletClient.requestAddresses() 
    const name = await publicClient.getEnsName({ address: account })
    const node = namehash(name)
    const resolverAddress = await publicClient.getEnsResolver({ name: normalize(name) })
  
    const encryptedValue = await encryptWithPublicKey(thirdParty.publicKey, infoValue)
    const hexedValue = toHex(JSON.stringify(encryptedValue))
    console.log(hexedValue)
  
    const { request } = await publicClient.simulateContract({
      account,
      address: resolverAddress,
      abi: abi,
      functionName: 'setText',
      args: [node, infoKey, hexedValue]
    })
  
    const hash = await walletClient.writeContract(request)
  
    const transaction = await publicClient.waitForTransactionReceipt({ hash: hash })

    if (transaction.status === 'success') {
      setInfoSaved(true)
    }
  }
  
  async function readInfo() {
  
    const [account] = await walletClient.requestAddresses() 
    const name = await publicClient.getEnsName({ address: account })
  
    const hexedValue = await publicClient.getEnsText({
      name: normalize(name),
      key: infoKey,
    })
    console.log(hexedValue)
  
    const encryptedValue = JSON.parse(fromHex(hexedValue, 'string'))
  
    const decryptedValue = await decryptWithPrivateKey(thirdParty.privateKey, encryptedValue)
    console.log(decryptedValue)
    setDecryptedValue(decryptedValue)
  }


  return (
    <div className="app">
      <header className="app-header">
        Minimize Exposure Demo
      </header>
      <div className="app-content">
        <textarea onChange={handleChange} placeholder="Type a piece of information here"></textarea>
        <br />
        <button onClick={() => saveInfo(infoKey, infoValue)}>
          Encrypt Info and Save it in ENS 
        </button>
        <br />
        <br />
        <br />
        <button onClick={() => readInfo()} disabled={!infoSaved}>
          Fetch and Decrypt the Info
        </button>
        <br />
        <textarea value={decryptedValue} disabled></textarea>
      </div>
    </div>
  );
}

export default App;
