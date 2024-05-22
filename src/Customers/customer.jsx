import React, { useState, useEffect } from "react";
import { Grid, Button } from "@mui/material";
import axios from "axios";
import "./Customer.css";

const CustomerComponent = () => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    mobile_no: "",
    email: "",
    address: "",
    billing_type: ""
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8080/customers")
      .then((response) => {
        setCustomers(response.data);
        console.log("Data fetched:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching customers:", error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.name || !formData.mobile_no || !formData.email || !formData.address || !formData.billing_type) {
      console.error("Required fields are missing");
      return;
    }
  
    try {
      if (isEditMode) {
        // Send PUT request to update existing customer
        const response = await axios.put(`http://localhost:8080/customers/${formData.id}`, formData);
  
        if (response.status === 200) {
          // Fetch the updated list of customers
          const updatedCustomersResponse = await axios.get("http://localhost:8080/customers");
  
          if (updatedCustomersResponse.status === 200) {
            // Update the local state with the updated list of customers
            setCustomers(updatedCustomersResponse.data);
            setFormData({ name: "", mobile_no: "", email: "", address: "", billing_type: "" }); // Clear form data
            setIsEditMode(false); // Exit edit mode
          } else {
            console.error(`Error: ${updatedCustomersResponse.status} ${updatedCustomersResponse.statusText}`);
          }
        } else {
          console.error(`Error: ${response.status} ${response.statusText}`);
        }
      } else {
        // Send POST request to add new customer
        const response = await axios.post("http://localhost:8080/customers", formData);
  
        if (response.status === 200) {
          // Fetch the updated list of customers
          const updatedCustomersResponse = await axios.get("http://localhost:8080/customers");
  
          if (updatedCustomersResponse.status === 200) {
            // Update the local state with the updated list of customers
            setCustomers(updatedCustomersResponse.data);
            setFormData({ name: "", mobile_no: "", email: "", address: "", billing_type: "" }); // Clear form data
          } else {
            console.error(`Error: ${updatedCustomersResponse.status} ${updatedCustomersResponse.statusText}`);
          }
        } else {
          console.error(`Error: ${response.status} ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  const handleEdit = (customer) => {
    setFormData(customer);
    setIsEditMode(true);
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8080/customers/${id}`)
      .then(() => {
        const updatedCustomers = customers.filter(customer => customer.id !== id);
        setCustomers(updatedCustomers);
      })
      .catch(error => {
        console.error("Error deleting customer:", error);
      });
  };

  const handleChange = (e) => {
    let value = e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  return (
    <div className="container">
      <h1>Customers</h1>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={6}>
          <form onSubmit={handleSubmit} className="customer-form">
            <div className="form-row">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                placeholder="Enter Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <label htmlFor="mobile_no">Mobile No:</label>
              <input
                type="text"
                id="mobile_no"
                placeholder="Mobile No"
                name="mobile_no"
                value={formData.mobile_no}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                id="address"
                placeholder="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <label htmlFor="billing_type">Billing Type:</label>
              <input
                type="text"
                id="billing_type"
                placeholder="Billing Type"
                name="billing_type"
                value={formData.billing_type}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" variant="contained" color="primary">{isEditMode ? "Update" : "Add Customers"}</Button>
          </form>
        </Grid>
      </Grid>
      <div className="table-container" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th style={{ position: 'sticky', top: 0 }}>Name</th>
              <th style={{ position: 'sticky', top: 0 }}>Mobile No</th>
              <th style={{ position: 'sticky', top: 0 }}>Email</th>
              <th style={{ position: 'sticky', top: 0 }}>Address</th>
              <th style={{ position: 'sticky', top: 0 }}>Billing Type</th>
              <th style={{ position: 'sticky', top: 0 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={customer.id || index}>
                <td>{customer.name}</td>
                <td>{customer.mobile_no}</td>
                <td>{customer.email}</td>
                <td>{customer.address}</td>
                <td>{customer.billing_type}</td>
                <td>
                  <Button onClick={() => handleEdit(customer)} variant="contained" color="primary" sx={{height:"23px",width:"15px",fontSize:"10px"}}>Edit</Button>
                  <Button onClick={() => handleDelete(customer.id)} variant="contained" color="secondary" sx={{height:"23px",width:"15px",fontSize:"10px"}}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerComponent;
