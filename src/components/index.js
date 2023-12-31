
import React, { useState, useEffect } from "react";

export default function ShoppingComponent() {
  const [categories, setCategories] = useState([]); // Use `useState` instead of `useEffect` for initializing state
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const[itemsCount, setItemsCount] = useState([0]);
  const [totalPrice, setTotalPrice] = useState(0);
  function getCartItemsCountItems(){
      setItemsCount(cartItems.length);
  }
  function loadCategories() {
    fetch("http://fakestoreapi.com/products/categories")
      .then((response) => response.json())
      .then((data) => {
        data.unshift("All");
        setCategories(data);
      });
  }
  
  function HandlecategoryChange(e) {
        if(e.target.value === 'All'){
             LoadProducts('http://fakestoreapi.com/products');
        }
        else{
            LoadProducts(`http://fakestoreapi.com/products/category/${e.target.value}`)
        }
  }
  function LoadProducts(url){
      fetch(url)
      .then(response => response.json())
      .then(data=>{ 
             setProducts(data)
      })
  } 

  // Add a function to handle item removal from the cart
function handleRemoveFromCart(itemId) {
  // Find the index of the item to be removed
  const itemIndex = cartItems.findIndex((item) => item.id === itemId);

  if (itemIndex !== -1) {
    // Create a copy of the current cart items array
    const updatedCart = [...cartItems];

    // Remove the item from the copy of the cart
    const removedItem = updatedCart.splice(itemIndex, 1)[0];

    // Update the cart items state
    setCartItems(updatedCart);

    // Update the items count state
    setItemsCount((prevCount) => prevCount - 1);

    // Update the total price state
    setTotalPrice((prevTotalPrice) => prevTotalPrice - removedItem.price);
  }
}


  function HandleAddToCart(e){
    alert("item added to cart");
      fetch(`http://fakestoreapi.com/products/${e.target.id}`)
      .then(response=> response.json())
      .then(data=>{
          cartItems.push(data);
          getCartItemsCountItems();
          setTotalPrice((prevTotalPrice) => prevTotalPrice + data.price);
      })
  }
  useEffect(() => {
    loadCategories();
    LoadProducts('http://fakestoreapi.com/products');
  }, [cartItems.length]); // Empty dependency array to run the effect only once

  return (
    <div className="container-fluid">
      <header className="bg-primary text-white text-center p-2">
        <h1>
          <span className="bi bi-cart"></span>Shopping Home
        </h1>
      </header>
      <section className="row mt-3">
        <nav className="col-2">
          <div>
            <label className="p-2">Select category</label>
            <div>
              <select className="form-select" onChange={HandlecategoryChange}>

                {/* Map over the categories and create options */}
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </nav>
        <main className="col-6 d-flex flex-wrap overflow-auto" style={{height:'600px'}}>
            {
                products.map(product =>
                        <div id={product.id} className="card m-2 p-2" style={{width:'200px'}}>
                              <div>
                                <img src={product.image} className="card-img-top" style={{ width:80, height:100}} />
                              </div>
                              <div className="card-header d-flex flex-wrap overflow-hidden" style={{height:'160px'}}>
                                  <p>{product.title}</p>
                              </div>
                              <div key={product} className="card-body overflow-buttom">
                                  <dl>
                                      <dt>Price</dt>
                                      <dd>{product.price}</dd>
                                      <dt>Rating</dt>
                                      <dd>
                                              <span className="bi bi-star-fill text-success"> </span>
                                              {product.rating.rate} <span>[{product.rating.rate}] </span>
                                      </dd>
                                   </dl>
                                </div>
                                <div className="card-footer">
                                    <button id={product.id}  onClick={HandleAddToCart} onChange={HandleAddToCart}  className="btn btn-warning w-100">
                                    <span className="bi bi-cart4"></span>Add to cart</button> 
                                </div>
                        </div>
                    )
            }
        </main>
        <aside className="col-4 mt-3">
             <button className="btn btn-warning w-100">
                 <span className="bi bi-cart4">[{itemsCount}] Your cart itmes</span>
             </button>
             <table className="table table-hover">
                  <thead col-12>
                      <tr>
                        <th className="col-4">Title</th>
                        <th className="col-4">Price</th>
                        <th className="col-4">Preview</th>
                      </tr>
                  </thead>
                  <tbody>
                       {
                           cartItems.map(item =>
                                <tr key={item.id}>
                                   <td>{item.title}</td>
                                   <td>{item.price}</td>
                                   <td>
                                      <img src={item.image} width="50" height="50" />  
                                   </td>
                                   <td>
                                   <button className="btn btn-warning" onClick={() => handleRemoveFromCart(item.id)}>
                                       <span className="bi bi-trash" />
                                    </button>
                                   </td>
                                </tr>
                            )
                       }
                  </tbody>
                  <tfoot>
                       <tr>
                           <td>total items in cart  [{itemsCount}]</td>
                           <td>Total = &#8377;{totalPrice.toFixed(2)}</td>
                       </tr>
                  </tfoot>
             </table>
        </aside>
      </section>
    </div>
  );
}