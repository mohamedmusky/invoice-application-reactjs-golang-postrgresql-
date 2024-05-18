Description

This project is a simple RESTful API built in Go (Golang) using PostgreSQL as the database. It provides endpoints for managing items, customers, invoices, and invoice items.

Navigate to the project directory:


#cd project-directory


Initialize Go Module

#go mod init module_name


Install dependencies:

#go get -u github.com/gorilla/mux
#go get -u github.com/lib/pq


Set up your PostgreSQL database:

Ensure PostgreSQL is installed and running.

Configure the database connection:


	host     = "localhost"
	port     = 5432
	user     = "musky"
	password = "1980"
	dbname   = "my_db3"


API Endpoints

Items
GET /items: Retrieve all items.
POST /items: Create a new item.
PUT /items/{id}: Update an existing item.
DELETE /items/{id}: Delete an item.

Customers
GET /customers: Retrieve all customers.
POST /customers: Create a new customer.
PUT /customers/{id}: Update an existing customer.
DELETE /customers/{id}: Delete a customer.

Invoices
POST /invoices: Create a new invoice.
GET /invoices: Retrieve all invoices.
PUT /invoices/{id}: Update an existing invoice.
DELETE /invoices/{id}: Delete an invoice.

Invoice Items
POST /invoice-items: Create a new invoice item.
GET /invoice-items: Retrieve all invoice items.
PUT /invoice-items/{id}: Update an existing invoice item.
DELETE /invoice-items/{id}: Delete an invoice item.

Testing
Use tools like curl, Postman, or write test cases using Go's testing framework to test each API endpoint.
Ensure all CRUD operations are functioning as expected.










