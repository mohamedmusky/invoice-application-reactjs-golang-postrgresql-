package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"

	_ "github.com/lib/pq"
)

const (
	host     = "localhost"
	port     = 5432
	user     = "musky"
	password = "1980"
	dbname   = "my_db3"
)

var db *sql.DB // Declare a global variable for the database connection

type Item struct {
	ID        int     `json:"id"`
	Name      string  `json:"name"`
	UnitPrice float64 `json:"unit_price"`
	Category  string  `json:"category"`
	Quantity  int     `json:"quantity"`
}

type Customer struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	MobileNo    string `json:"mobile_no"`
	Email       string `json:"email"`
	Address     string `json:"address"`
	BillingType string `json:"billing_type"`
}

type Invoice struct {
	ID           int       `json:"id"`
	CustomerID   int       `json:"customer_id"`
	InvoiceDate  time.Time `json:"invoice_date"`
	TotalAmount  float64   `json:"total_amount"`
	CustomerName string    `json:"customer_name"`
	// Add other relevant fields here
}

type InvoiceItem struct {
	ID          int     `json:"id"`
	InvoiceID   int     `json:"invoice_id"`
	ItemID      int     `json:"item_id"`
	Quantity    int     `json:"quantity"`
	UnitPrice   float64 `json:"unit_price"`
	TotalAmount float64 `json:"total_amount"`
	// Add other relevant fields here
}

type PostgresItemModel struct {
	DB *sql.DB
}

// Define the PostgresCustomerModel struct
type PostgresCustomerModel struct {
	DB *sql.DB
}

type PostgresInvoiceModel struct {
	DB *sql.DB
}

type PostgresInvoiceItemModel struct {
	DB *sql.DB
}

func (m *PostgresItemModel) GetAll() ([]*Item, error) {
	rows, err := m.DB.Query("SELECT id, name, unit_price, category, quantity FROM items")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := []*Item{}
	for rows.Next() {
		item := &Item{}
		err := rows.Scan(&item.ID, &item.Name, &item.UnitPrice, &item.Category, &item.Quantity)
		if err != nil {
			return nil, err
		}
		items = append(items, item)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return items, nil
}

func (m *PostgresItemModel) Insert(item *Item) (int, error) {
	stmt := `INSERT INTO items (name, unit_price, category, quantity) VALUES($1, $2, $3, $4) RETURNING id`
	var id int
	err := m.DB.QueryRow(stmt, item.Name, item.UnitPrice, item.Category, item.Quantity).Scan(&id)
	if err != nil {
		return 0, err
	}
	return id, nil
}

func (m *PostgresItemModel) Delete(id int) error {
	stmt := `DELETE FROM items WHERE id = $1`
	_, err := m.DB.Exec(stmt, id)
	return err
}

func (m *PostgresItemModel) Update(item *Item) error {
	stmt := `UPDATE items SET name = $1, unit_price = $2, category = $3, quantity = $4 WHERE id = $5`
	_, err := m.DB.Exec(stmt, item.Name, item.UnitPrice, item.Category, item.Quantity, item.ID)
	return err
}

//models for cutomers

func (m *PostgresCustomerModel) GetAll() ([]*Customer, error) {
	rows, err := m.DB.Query("SELECT id, name, mobile_no, email, address, billing_type FROM customers")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	customers := []*Customer{}
	for rows.Next() {
		customer := &Customer{}
		err := rows.Scan(&customer.ID, &customer.Name, &customer.MobileNo, &customer.Email, &customer.Address, &customer.BillingType)
		if err != nil {
			return nil, err
		}
		customers = append(customers, customer)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return customers, nil
}

// Implement the Insert method for customers
func (m *PostgresCustomerModel) Insert(customer *Customer) (int, error) {
	stmt := `INSERT INTO customers (name, mobile_no, email, address, billing_type) VALUES($1, $2, $3, $4, $5) RETURNING id`
	var id int
	err := m.DB.QueryRow(stmt, customer.Name, customer.MobileNo, customer.Email, customer.Address, customer.BillingType).Scan(&id)
	if err != nil {
		return 0, err
	}
	return id, nil
}

// Implement the Delete method for customers
func (m *PostgresCustomerModel) Delete(id int) error {
	stmt := `DELETE FROM customers WHERE id = $1`
	_, err := m.DB.Exec(stmt, id)
	return err
}

// Implement the Update method for customers
func (m *PostgresCustomerModel) Update(customer *Customer) error {
	stmt := `UPDATE customers SET name = $1, mobile_no = $2, email = $3, address = $4, billing_type = $5 WHERE id = $6`
	_, err := m.DB.Exec(stmt, customer.Name, customer.MobileNo, customer.Email, customer.Address, customer.BillingType, customer.ID)
	return err
}

//invoice crud

func (m *PostgresInvoiceModel) Create(invoice *Invoice) (int, error) {
	stmt := `INSERT INTO invoices (customer_id, invoice_date, total_amount) VALUES($1, $2, $3) RETURNING id`
	var id int
	err := m.DB.QueryRow(stmt, invoice.CustomerID, invoice.InvoiceDate, invoice.TotalAmount).Scan(&id)
	if err != nil {
		return 0, err
	}

	return id, nil
}

func (m *PostgresInvoiceModel) GetAll() ([]*Invoice, error) {
	rows, err := m.DB.Query("SELECT id, customer_id, invoice_date, total_amount FROM invoices")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	invoices := []*Invoice{}
	for rows.Next() {
		invoice := &Invoice{}
		err := rows.Scan(&invoice.ID, &invoice.CustomerID, &invoice.InvoiceDate, &invoice.TotalAmount)
		if err != nil {
			return nil, err
		}
		invoices = append(invoices, invoice)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return invoices, nil
}

func (m *PostgresInvoiceModel) Update(invoice *Invoice) error {
	stmt := `UPDATE invoices SET customer_id = $1, invoice_date = $2, total_amount = $3 WHERE id = $4`
	_, err := m.DB.Exec(stmt, invoice.CustomerID, invoice.InvoiceDate, invoice.TotalAmount, invoice.ID)
	return err
}

func (m *PostgresInvoiceModel) Delete(id int) error {
	stmt := `DELETE FROM invoices WHERE id = $1`
	_, err := m.DB.Exec(stmt, id)
	return err
}

func (m *PostgresInvoiceItemModel) Create(invoiceItem *InvoiceItem) (int, error) {
	stmt := `INSERT INTO invoice_items (invoice_id, item_id, quantity, unit_price, total_amount) VALUES($1, $2, $3, $4, $5) RETURNING id`
	var id int
	err := m.DB.QueryRow(stmt, invoiceItem.InvoiceID, invoiceItem.ItemID, invoiceItem.Quantity, invoiceItem.UnitPrice, invoiceItem.TotalAmount).Scan(&id)
	if err != nil {
		return 0, err
	}
	return id, nil
}

func (m *PostgresInvoiceItemModel) GetAll() ([]*InvoiceItem, error) {
	rows, err := m.DB.Query("SELECT id, invoice_id, item_id, quantity, unit_price, total_amount FROM invoice_items")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	invoiceItems := []*InvoiceItem{}
	for rows.Next() {
		invoiceItem := &InvoiceItem{}
		err := rows.Scan(&invoiceItem.ID, &invoiceItem.InvoiceID, &invoiceItem.ItemID, &invoiceItem.Quantity, &invoiceItem.UnitPrice, &invoiceItem.TotalAmount)
		if err != nil {
			return nil, err
		}
		invoiceItems = append(invoiceItems, invoiceItem)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return invoiceItems, nil
}

func (m *PostgresInvoiceItemModel) Update(invoiceItem *InvoiceItem) error {
	stmt := `UPDATE invoice_items SET invoice_id = $1, item_id = $2, quantity = $3, unit_price = $4, total_amount = $5 WHERE id = $6`
	_, err := m.DB.Exec(stmt, invoiceItem.InvoiceID, invoiceItem.ItemID, invoiceItem.Quantity, invoiceItem.UnitPrice, invoiceItem.TotalAmount, invoiceItem.ID)
	return err
}

func (m *PostgresInvoiceItemModel) Delete(id int) error {
	stmt := `DELETE FROM invoice_items WHERE id = $1`
	_, err := m.DB.Exec(stmt, id)
	return err
}

//handlers for item

func (m *PostgresItemModel) handleGetAll(w http.ResponseWriter, r *http.Request) {
	items, err := m.GetAll()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(items)
}

func (m *PostgresItemModel) handleInsert(w http.ResponseWriter, r *http.Request) {
	var item Item
	err := json.NewDecoder(r.Body).Decode(&item)
	if err != nil {
		http.Error(w, "Error decoding JSON: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Validate input data
	if item.Name == "" || item.Category == "" || item.UnitPrice <= 0 || item.Quantity <= 0 {
		http.Error(w, "Invalid item data", http.StatusBadRequest)
		return
	}

	id, err := m.Insert(&item)
	if err != nil {
		http.Error(w, "Error inserting item into database: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Return the ID of the inserted item
	json.NewEncoder(w).Encode(id)
}

func (m *PostgresItemModel) handleDelete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = m.Delete(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (m *PostgresItemModel) handleUpdate(w http.ResponseWriter, r *http.Request) {
	var item Item
	err := json.NewDecoder(r.Body).Decode(&item)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = m.Update(&item)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// handlers for customers
func (m *PostgresCustomerModel) handleGetAll(w http.ResponseWriter, r *http.Request) {
	customers, err := m.GetAll()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(customers)
}

// Implement the handleInsert method for customers
func (m *PostgresCustomerModel) handleInsert(w http.ResponseWriter, r *http.Request) {
	var customer Customer
	err := json.NewDecoder(r.Body).Decode(&customer)
	if err != nil {
		http.Error(w, "Error decoding JSON: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Validate input data
	if customer.Name == "" || customer.MobileNo == "" || customer.Email == "" || customer.Address == "" || customer.BillingType == "" {
		http.Error(w, "Invalid customer data", http.StatusBadRequest)
		return
	}

	id, err := m.Insert(&customer)
	if err != nil {
		http.Error(w, "Error inserting customer into database: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Return the ID of the inserted customer
	json.NewEncoder(w).Encode(id)
}

// Implement the handleDelete method for customers
func (m *PostgresCustomerModel) handleDelete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = m.Delete(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// Implement the handleUpdate method for customers
func (m *PostgresCustomerModel) handleUpdate(w http.ResponseWriter, r *http.Request) {
	var customer Customer
	err := json.NewDecoder(r.Body).Decode(&customer)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = m.Update(&customer)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// handlers for invoices
func (m *PostgresInvoiceModel) handleCreate(w http.ResponseWriter, r *http.Request) {
	var invoice Invoice
	err := json.NewDecoder(r.Body).Decode(&invoice)
	if err != nil {
		http.Error(w, "Error decoding JSON: "+err.Error(), http.StatusBadRequest)
		return
	}

	id, err := m.Create(&invoice)
	if err != nil {
		http.Error(w, "Error creating invoice: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Return the ID of the created invoice
	json.NewEncoder(w).Encode(id)
}

func (m *PostgresInvoiceModel) handleGetAll(w http.ResponseWriter, r *http.Request) {
	rows, err := m.DB.Query("SELECT i.id, i.customer_id, c.name as customer_name, i.invoice_date, i.total_amount FROM invoices i JOIN customers c ON i.customer_id = c.id")
	if err != nil {
		http.Error(w, "Error fetching invoices: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	invoices := []*Invoice{}
	for rows.Next() {
		invoice := &Invoice{}
		err := rows.Scan(&invoice.ID, &invoice.CustomerID, &invoice.CustomerName, &invoice.InvoiceDate, &invoice.TotalAmount)
		if err != nil {
			http.Error(w, "Error scanning invoices: "+err.Error(), http.StatusInternalServerError)
			return
		}
		invoices = append(invoices, invoice)
	}

	if err = rows.Err(); err != nil {
		http.Error(w, "Error iterating over rows: "+err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(invoices)
}

func (m *PostgresInvoiceModel) handleUpdate(w http.ResponseWriter, r *http.Request) {
	var invoice Invoice
	err := json.NewDecoder(r.Body).Decode(&invoice)
	if err != nil {
		http.Error(w, "Error decoding JSON: "+err.Error(), http.StatusBadRequest)
		return
	}

	err = m.Update(&invoice)
	if err != nil {
		http.Error(w, "Error updating invoice: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (m *PostgresInvoiceModel) handleDelete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = m.Delete(id)
	if err != nil {
		http.Error(w, "Error deleting invoice: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (m *PostgresInvoiceItemModel) handleCreate(w http.ResponseWriter, r *http.Request) {
	var invoiceItem InvoiceItem
	err := json.NewDecoder(r.Body).Decode(&invoiceItem)
	if err != nil {
		http.Error(w, "Error decoding JSON: "+err.Error(), http.StatusBadRequest)
		return
	}

	id, err := m.Create(&invoiceItem)
	if err != nil {
		http.Error(w, "Error creating invoice item: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Return the ID of the created invoice item
	json.NewEncoder(w).Encode(id)
}

func (m *PostgresInvoiceItemModel) handleGetAll(w http.ResponseWriter, r *http.Request) {
	invoiceItems, err := m.GetAll()
	if err != nil {
		http.Error(w, "Error fetching invoice items: "+err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(invoiceItems)
}

func (m *PostgresInvoiceItemModel) handleUpdate(w http.ResponseWriter, r *http.Request) {
	var invoiceItem InvoiceItem
	err := json.NewDecoder(r.Body).Decode(&invoiceItem)
	if err != nil {
		http.Error(w, "Error decoding JSON: "+err.Error(), http.StatusBadRequest)
		return
	}

	err = m.Update(&invoiceItem)
	if err != nil {
		http.Error(w, "Error updating invoice item: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (m *PostgresInvoiceItemModel) handleDelete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = m.Delete(id)
	if err != nil {
		http.Error(w, "Error deleting invoice item: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func main() {
	// Create the connection string
	psqlconn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	// Open the database connection
	var err error
	db, err = sql.Open("postgres", psqlconn)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	// Test the connection
	err = db.Ping()
	if err != nil {
		panic(err)
	}
	fmt.Println("Connected to database successfully!")

	// Call your functions here
	router := mux.NewRouter()
	model := &PostgresItemModel{DB: db}
	customerModel := &PostgresCustomerModel{DB: db}

	// Register your routes
	router.HandleFunc("/items", model.handleGetAll).Methods("GET", "OPTIONS")
	router.HandleFunc("/items", model.handleInsert).Methods("POST", "OPTIONS")
	router.HandleFunc("/items/{id}", model.handleDelete).Methods("DELETE", "OPTIONS")
	router.HandleFunc("/items/{id}", model.handleUpdate).Methods("PUT", "OPTIONS")

	//cutomer routes
	router.HandleFunc("/customers", customerModel.handleGetAll).Methods("GET", "OPTIONS")
	router.HandleFunc("/customers", customerModel.handleInsert).Methods("POST", "OPTIONS")
	router.HandleFunc("/customers/{id}", customerModel.handleDelete).Methods("DELETE", "OPTIONS")
	router.HandleFunc("/customers/{id}", customerModel.handleUpdate).Methods("PUT", "OPTIONS")

	//invoices routes
	invoiceModel := &PostgresInvoiceModel{DB: db}
	router.HandleFunc("/invoices", invoiceModel.handleCreate).Methods("POST", "OPTIONS")
	router.HandleFunc("/invoices", invoiceModel.handleGetAll).Methods("GET", "OPTIONS")
	router.HandleFunc("/invoices/{id}", invoiceModel.handleUpdate).Methods("PUT", "OPTIONS")
	router.HandleFunc("/invoices/{id}", invoiceModel.handleDelete).Methods("DELETE", "OPTIONS")

	// Invoice Item routes
	invoiceItemModel := &PostgresInvoiceItemModel{DB: db}
	router.HandleFunc("/invoice-items", invoiceItemModel.handleCreate).Methods("POST", "OPTIONS")
	router.HandleFunc("/invoice-items", invoiceItemModel.handleGetAll).Methods("GET", "OPTIONS")
	router.HandleFunc("/invoice-items/{id}", invoiceItemModel.handleUpdate).Methods("PUT", "OPTIONS")
	router.HandleFunc("/invoice-items/{id}", invoiceItemModel.handleDelete).Methods("DELETE", "OPTIONS")

	// Apply CORS middleware to all routes
	router.Use(corsMiddleware)

	// Start the server
	log.Fatal(http.ListenAndServe(":8080", router))
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
