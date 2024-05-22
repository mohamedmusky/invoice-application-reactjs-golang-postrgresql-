import React, { useState, useEffect } from 'react';
import './InvoiceList.css';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('http://localhost:8080/invoices');
      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const handleDelete = async (invoiceId) => {
    try {
      const response = await fetch(`http://localhost:8080/invoices/${invoiceId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setInvoices(invoices.filter(invoice => invoice.id !== invoiceId));
      } else {
        console.error('Error deleting invoice:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  return (
    <div className="container">
      <h2>Invoices</h2>
      {invoices.length > 0 ? (
        <div className="table-container" style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Customer Name</th>
                <th>Total Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.id}</td>
                  <td>{invoice.customer_name}</td>
                  <td>{invoice.total_amount}</td>
                  <td>
                    <button onClick={() => handleDelete(invoice.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No invoices available.</p>
      )}
    </div>
  );
};

export default InvoiceList;
