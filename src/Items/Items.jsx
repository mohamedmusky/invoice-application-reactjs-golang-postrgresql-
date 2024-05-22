import React, { useState, useEffect } from "react";
import { Grid, Button } from "@mui/material";
import axios from "axios";
import "./Item.css"; // Import CSS file for styling

const ItemComponent = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    unit_price: "",
    category: "",
    quantity: 1,
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8080/items")
      .then(response => {
        setItems(response.data);
        console.log("Data fetched:", response.data);
      })
      .catch(error => {
        console.error("Error fetching items:", error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.name || !formData.unit_price || !formData.category) {
      console.error("Required fields are missing");
      return;
    }
  
    try {
      if (isEditMode) {
        // Send PUT request to update existing item
        const response = await axios.put(`http://localhost:8080/items/${formData.id}`, formData);
  
        if (response.status === 200) {
          // Fetch the updated list of items
          const updatedItemsResponse = await axios.get("http://localhost:8080/items");
  
          if (updatedItemsResponse.status === 200) {
            // Update the local state with the updated list of items
            setItems(updatedItemsResponse.data);
            setFormData({ name: "", unit_price: "", category: "", quantity: 1 }); // Clear form data
            setIsEditMode(false); // Exit edit mode
          } else {
            console.error(`Error: ${updatedItemsResponse.status} ${updatedItemsResponse.statusText}`);
          }
        } else {
          console.error(`Error: ${response.status} ${response.statusText}`);
        }
      } else {
        // Send POST request to add new item
        const response = await axios.post("http://localhost:8080/items", formData);
  
        if (response.status === 200) {
          // Fetch the updated list of items
          const updatedItemsResponse = await axios.get("http://localhost:8080/items");
  
          if (updatedItemsResponse.status === 200) {
            // Update the local state with the updated list of items
            setItems(updatedItemsResponse.data);
            setFormData({ name: "", unit_price: "", category: "", quantity: 1 }); // Clear form data
          } else {
            console.error(`Error: ${updatedItemsResponse.status} ${updatedItemsResponse.statusText}`);
          }
        } else {
          console.error(`Error: ${response.status} ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  const handleEdit = (item) => {
    setFormData(item);
    setIsEditMode(true);
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8080/items/${id}`)
      .then(() => {
        const updatedItems = items.filter(item => item.id !== id);
        setItems(updatedItems);
      })
      .catch(error => {
        console.error("Error deleting item:", error);
      });
  };

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === "unit_price" || e.target.name === "quantity") {
      value = Number(value);
    }
    setFormData({ ...formData, [e.target.name]: value });
  };

  return (
    <div className="container">
      <h1>Items</h1>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={6}>
          <form onSubmit={handleSubmit} className="form">
           <div><label htmlFor="">Item Name: </label>
            <input
              type="text"
              placeholder="Enter Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            /></div> 

            <div>
              <label htmlFor="">Unit Price:  </label>
            <input
              type="number"
              placeholder="Unit Price"
              name="unit_price"
              value={formData.unit_price}
              onChange={handleChange}
              required
            />
            </div>
           
           <div><label htmlFor="">Category: </label> <input
              type="text"
              placeholder="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            /></div>
           <div><label htmlFor="">Quantity: </label>  <input
              type="number"
              placeholder="Quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            /></div>
          
         <Button type="submit"  variant="contained" sx={{color:"white",backgroundColor:"#00bfff"}}>{isEditMode ? "Update" : "Add Item"}</Button>
          </form>
        </Grid>
      </Grid>
      <div className="table-container" style={{ maxHeight: '317px', overflowY: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th style={{ position: 'sticky', top: 0 }}>Item Name</th>
              <th style={{ position: 'sticky', top: 0 }}>Category</th>
              <th style={{ position: 'sticky', top: 0 }}>Unit Price</th>
              <th style={{ position: 'sticky', top: 0 }}>Quantity</th>
              <th style={{ position: 'sticky', top: 0 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id || index}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>${item.unit_price}</td>
                <td>{item.quantity}</td>
                <td>
          <div >
            <Button onClick={() => handleEdit(item)} variant="contained" color="primary" sx={{height:"23px",width:"15px",fontSize:"10px"}}>Edit</Button>
            <Button onClick={() => handleDelete(item.id)} variant="contained" color="secondary" sx={{height:"23px",width:"15px",fontSize:"10px"}}>Delete</Button>
          </div>
        </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemComponent;
