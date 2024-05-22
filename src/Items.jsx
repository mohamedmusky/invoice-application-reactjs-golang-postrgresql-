// ItemComponent.jsx
import React, { useState } from "react";
import { Grid } from "@mui/material";
import { Link } from "react-router-dom";

const ItemComponent = ({ addItem }) => {
  const [formData, setFormData] = useState({
    name: "",
    unitPrice: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = { id: Date.now(), ...formData, quantity: 1 };
    addItem(newItem);
    setFormData({ name: "", unitPrice: "", category: "" });
  };

  return (
    <div>
      <h1>Items</h1>
      <Grid container>
        <Grid item xs={12}>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              placeholder="Unit Price"
              name="unitPrice"
              value={formData.unitPrice}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              placeholder="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
            <button type="submit">Add</button>
          </form>
          <Link to={{ pathname: "/invoice", state: { items: formData } }}>
            <button>Create Invoice</button>
          </Link>
        </Grid>
      </Grid>
    </div>
  );
};

export default ItemComponent;
