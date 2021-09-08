import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Helmet from "react-helmet";

import "../../assets/stylesheets/main.css";
import "./Home.css";

const BACKEND_URI = "http://localhost:5000"

export default function Home() {
  const history = useHistory();

  const loginButtonRef = useRef();

  const addProductButtonRef = useRef();

  const [products, setProducts] = useState([]);

  const [loginStatus, setLoginStatus] = useState("Log In");

  const ProductCard = ({ productInfo }) => (
    <Link
      to={`/product/${productInfo._id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="product">
        <img src={productInfo.coverImage} className="productImage" alt="" />
        <div className="productDetails">
          <div className="name">
            {productInfo.title.length > 17
              ? productInfo.title.slice(0, 17) + "..."
              : productInfo.title}
          </div>
          <div className="price">₹{productInfo.price}</div>
        </div>
      </div>
    </Link>
  );

  useEffect(() => {
    axios
      .get(`${BACKEND_URI}/products/20`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response.data);
        }
      });

    var token = "";
    token = localStorage.getItem("token");

    if (token) {
      axios
        .get(`${BACKEND_URI}/users/user`, {
          headers: {
            "X-Auth-Token": token
          }
        })
        .then((res) => {
          setLoginStatus("Logout");
          loginButtonRef.current.style.display = "block";
          if (res.data.email === "kumarpintu1713122@gmail.com") {
            addProductButtonRef.current.style.display = "block";
          }
        })
        .catch((err) => {
          console.log(err);
          loginButtonRef.current.style.display = "block";
        });
    } else {
      loginButtonRef.current.style.display = "block";
    }
  }, []);

  function handleUserLogin() {
    if (loginStatus === "Log In") {
      history.push("/login");
    } else if (loginStatus === "Logout") {
      console.log("logging out");
      localStorage.removeItem("token");
      history.push("/logout");
    }
  }

  function searchForProducts(query) {
    axios
      .get(`/products/search/${query}`)
      .then((res) => {
        console.log(res.data);
        setProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <Helmet>
        <title>Shopping</title>
        <meta name="description" content="Shop for your daily products" />
      </Helmet>
      <div className="container" style={{ maxWidth: "1000px" }}>
        <div className="headerBar">
          <div className="titleBar">
            <div className="titleText">Shopping</div>
            <div className="titleBarButtons">
              <button
                className="loginButton"
                onClick={() => history.push("/addproduct")}
                ref={addProductButtonRef}
                style={{ marginRight: ".5em", display: "none" }}
              >
                Add Product
              </button>
              <button
                className="loginButton"
                onClick={handleUserLogin}
                ref={loginButtonRef}
                style={{ display: "none" }}
              >
                {loginStatus}
              </button>
            </div>
          </div>
          <input
            type="text"
            className="textInput"
            id="searchBox"
            placeholder="Search for products"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                searchForProducts(e.target.value);
              }
            }}
          />
        </div>
        <div className="wrapper">
          {products.map((product) => (
            <ProductCard key={product.title} productInfo={product} />
          ))}
        </div>
      </div>
    </>
  );
}
