import { Switch, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import Home from "./components/Home/Home";
import AddProduct from "./components/AddProduct/AddProduct";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import Authenticated from "./components/Authenticated/Authenticated";
import Logout from "./components/Logout/Logout";

function App() {
  return (
    <BrowserRouter>
      <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/addproduct" component={AddProduct} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/product/:productId" component={ProductDetails} />
          <Route exact path="/authenticated" component={Authenticated} />
          <Route exact path="/logout" component={Logout} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;