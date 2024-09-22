import './App.scss';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import {GameTab} from "./view/gameTab";
import {data} from "./data"


// URL: https://3000-irenaproj-games-ej6a7rgm5v.app.codeanywhere.com/

function App() {
  return (
    <div className="App">
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
        crossorigin="anonymous"
      />
      <Tabs
        defaultActiveKey="pb"
        id="games"
        className="mb-3"
      >
        <Tab eventKey="pb" title="PB">
          <GameTab key="pb" data={data.pb}/>
        </Tab>
        <Tab eventKey="sl" title="SL">
          <GameTab key="sl" data={data.sl}/>
        </Tab>
        <Tab eventKey="ol" title="OL">
          <GameTab key="ol" data={data.ol}/>
        </Tab>
        {/* <Tab eventKey="profile" title="Profile">
          Tab content for Profile
        </Tab>
        <Tab eventKey="contact" title="Contact" disabled>
          Tab content for Contact
        </Tab> */}
      </Tabs>
    </div>
  );
}

export default App;
