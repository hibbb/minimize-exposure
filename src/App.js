import { publicClient, walletClient } from './utils/client'

async function getSomething() {
  const [accounts] = await walletClient.requestAddresses() 
  console.log(accounts)

  const name = await publicClient.getEnsName({
    address: accounts
  })
  console.log(name)
  
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
