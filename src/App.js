import './App.scss';
import Nav from 'react-bootstrap/Nav';
import { Routes, Route, Outlet, Link } from "react-router-dom";
import { Game } from "./view/game";
import { data } from "./data"


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
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Game key="pb" data={data.pb} />} />
          <Route path="sl" element={<Game key="sl" data={data.sl} />} />
          <Route path="ol" element={<Game key="ol" data={data.ol} />} />

          {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
          <Route path="*" element={<Game key="pb" data={data.pb} />} />
        </Route>
      </Routes>
    </div>
  );
}

function Layout() {
  return (
    <div>
      {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}
      <Nav activeKey="/">
        <Nav.Item>
          <Nav.Link href="/">PB</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/sl">SL</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/ol">OL</Nav.Link>
        </Nav.Item>
      </Nav>

      <hr />

      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      <Outlet />
    </div>
  );
}


// function Layout() {
//   return (
//     <div>
//       {/* A "layout route" is a good place to put markup you want to
//           share across all the pages on your site, like navigation. */}
//       <nav>
//         <ul>
//           <li>
//             <Link to="/">PB</Link>
//           </li>
//           <li>
//             <Link to="/about">SL</Link>
//           </li>
//           <li>
//             <Link to="/dashboard">OL</Link>
//           </li>
//         </ul>
//       </nav>

//       <hr />

//       {/* An <Outlet> renders whatever child route is currently active,
//           so you can think about this <Outlet> as a placeholder for
//           the child routes we defined above. */}
//       <Outlet />
//     </div>
//   );
// }

export default App;
