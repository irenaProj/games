import logo from './logo.svg';
import './App.css';
import { test } from './calculators/test';

// URL: https://3000-irenaproj-games-ej6a7rgm5v.app.codeanywhere.com/

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.Edited?
          {test()}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
