import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation, useHistory } from "react-router-dom";
import Helmet from "react-helmet";

import Cart from "../Cart/Cart";

import "../../assets/stylesheets/main.css"; 
import "./ProductDetails.css";

const BACKEND_URI = "https://kumarpintu-product-manager.herokuapp.com"

export default function ProductDetails() {
  var productId = useLocation().pathname.replace(/\/*.*\//, "");
  var history = useHistory();

  const [authorized, setAuthorized] = useState(false);
  const [userId, setUserId] = useState("");

  const [productDetails, setProductDetails] = useState({
    title: "",
    price: 0,
    description: "",
    coverImage: "",
    seoTitle: "",
    seoDescription: ""
  });

  const cartPanelRef = useRef();

  function fetchData() {
    setTimeout(() => {
      if (!(productId === "undefined")) {
        axios
          .get(`${BACKEND_URI}/products/details/${productId}`)
          .then((res) => {
            console.log(res.data);
            setProductDetails(res.data);
          })
          .catch((err) => {
            if (err.response) {
              console.log(err.response.data);
            }
          });
      } else {
        fetchData();
      }
    }, 50);
  }

  function setAuthorizationStatus() {
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
          setAuthorized(true);
          console.log(res.data);
          setUserId(res.data._id);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  useEffect(() => {
    if (productDetails.title === "") {
      setAuthorizationStatus();
      fetchData();
    }
  });

  function toggleCartPanel() {
    if (authorized) {
      const cartPanel = cartPanelRef.current;
      cartPanel.style.display = "block";
    } else {
      history.push("/login");
      alert("You need to login first!");
    }
  }

  function addProductToCart() {
    if (authorized) {
      var token = "";
      token = localStorage.getItem("token");

      if (token) {
        const cartEntry = {
          user: userId,
          products: [
            `${productDetails.title}||${productDetails.price}||${productDetails.coverImage}`
          ]
        };

        axios
          .post(`${BACKEND_URI}/cart/add`, cartEntry, {
            headers: {
              "X-Auth-Token": token
            }
          })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
            alert("failed to add!");
          });
      }
    } else {
      history.push("/login");
      alert("You need to login first!");
    }
  }

  return (
    <>
      <Helmet>
        <title>{productDetails.seoTitle}</title>
        <meta name="description" content={productDetails.seoDescription} />
      </Helmet>
      <div className="topBar">
        <button id="homeLink" onClick={() => history.push("/")}></button>
        <button id="toggleCartPanel" onClick={toggleCartPanel}></button>
      </div>
      <div id="cartPanelDiv" className="cartPanel" ref={cartPanelRef}>
        <Cart />
      </div>
      <div className="productArea">
        <div className="productDetailsSection">
          <div className="imageSection">
            <img
              src={productDetails.coverImage}
              className="productImage"
              alt=""
            />
          </div>
          <div className="descriptionSection">
            <div className="infoSection">
              <div className="productTitle">{productDetails.title}</div>
              <div className="productPrice">₹ {productDetails.price}</div>
              <div
                className="productDescription"
                dangerouslySetInnerHTML={{ __html: productDetails.description }}
              ></div>
            </div>
            <div className="productVariantsSection"></div>
            <div className="checkoutControlsSection">
              <button
                className="loginButton"
                id="addToCartButton"
                onClick={addProductToCart}
              >
                ADD TO CART
              </button>
              <button
                className="loginButton"
                id="buyNowButton"
                onClick={addProductToCart}
              >
                BUY NOW
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
