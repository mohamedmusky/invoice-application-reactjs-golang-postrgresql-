import React, { useState, useEffect } from 'react';
import { Grid, Button } from '@mui/material';
import "./InvoiceComponent.css";

const CreateInvoicePage = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [inputItemValue, setInputItemValue] = useState('');
  const [invoice, setInvoice] = useState(null);
  const [showItemsDropdown, setShowItemsDropdown] = useState(false); // State to control items dropdown visibility

  useEffect(() => {
    fetchCustomers();
    fetchItems();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:8080/customers');
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:8080/items');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleItemSelect = (itemId) => {
    setSelectedItems((prevSelectedItems) => [...prevSelectedItems, itemId]);
    setInputItemValue(''); // Clear input field
    setShowItemsDropdown(false); // Close items dropdown after selection
  };
  
  const handleSubmitInvoice = async () => {
    try {
      // Create the invoice
      const invoiceResponse = await fetch('http://localhost:8080/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: selectedCustomer.id,
        }),
      });
  
      if (!invoiceResponse.ok) {
        throw new Error('Failed to create invoice');
      }
  
      const invoiceData = await invoiceResponse.json();
      setInvoice(invoiceData);
      console.log(invoiceData);
  
      // Update invoice items
      for (const itemId of selectedItems) {
        const itemResponse = await fetch('http://localhost:8080/invoice-items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            invoice_id: invoiceData.id,
            item_id: itemId, // Pass the selected item ID
            quantity: 1, // Assuming quantity is 1 for each selected item
            // You may need to fetch unit price from the items table and calculate total amount here
          }),
        });
  
        if (!itemResponse.ok) {
          throw new Error('Failed to add item to invoice');
        }
      }
    } catch (error) {
      console.error('Error creating invoice item:', error);
    }
  };
  
  return (
    <div className="container">
      <h2>Create Invoice</h2>
      <div className='form'>
        <div className="form-row">
          <label>Select Customer:</label>
          {selectedCustomer ? (
            <input type="text" value={selectedCustomer.name} readOnly />
          ) : (
            <select onChange={(e) => handleCustomerSelect(customers.find((c) => c.id === parseInt(e.target.value)))}>
              <option value="">Select Customer</option>
              {customers && customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="form-row">
          <label>Select Items:</label>
          <input
            type="text"
            placeholder="Select items..."
            value={inputItemValue}
            onClick={() => setShowItemsDropdown(true)} // Open items dropdown on click
            onChange={(e) => setInputItemValue(e.target.value)}
          />
          {showItemsDropdown && ( // Show items dropdown based on state
            <div className="item-dropdown">
              <select
                multiple
                size={5}
                onBlur={() => setShowItemsDropdown(false)} // Close items dropdown on blur
                onChange={(e) => handleItemSelect(parseInt(e.target.value))}
              >
                {items && items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="selected-items">
            <h4>Selected Items:</h4>
            <ul>
              {selectedItems.map(itemId => {
                const selectedItem = items.find(item => item.id === itemId);
                return (
                  <li key={itemId}>
                    {selectedItem.name}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="form-row">
          <Button onClick={handleSubmitInvoice} variant="contained" color="primary">Create Invoice</Button>
        </div>
      </div>
      
      {invoice && (
        <div className="invoice-details">
          <h3>Invoice Created Successfully!</h3>
          <p> ID: {selectedCustomer.id}</p>
          <p>Customer Name: {selectedCustomer.name}</p>
          <p>Email: {selectedCustomer.email}</p>
          <p>Mobile No: {selectedCustomer.mobile_no}</p>
          <p> Address {selectedCustomer.address}</p>
          <h4>Items Selected:</h4>
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((itemId) => {
                const item = items.find((i) => i.id === itemId);
                return (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unit_price}</td>
                    <td>{item.total_amount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CreateInvoicePage;
