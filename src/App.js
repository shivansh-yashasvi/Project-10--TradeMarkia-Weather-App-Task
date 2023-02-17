import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Main } from "./pages/app/index";
import "@fortawesome/fontawesome-free/css/all.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <Main />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
