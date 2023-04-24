import { publicClient } from './utils/client'

async function getSomething() {  
  const output = await publicClient.getBlockNumber()
  console.log(output)
}

function App() {
  return (
    <div className="app">
      <header className="app-header">
        This is Header
      </header>
      <div className="app-content">
        <button onClick={() => getSomething()}>
          Click This Button
        </button>
      </div>
    </div>
  );
}

export default App;
