from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  
# Configure MySQL connection
db_config = {
    'user': 'root',           # Replace with your MySQL username
    'password': 'root',       # Replace with your MySQL password
    'host': 'localhost',      # Replace with your MySQL host
    'database': 'onlinestore' # Replace with your MySQL database name
}

# Establish a database connection
con = mysql.connector.connect(**db_config)
res = con.cursor()

# Helper functions
def customer_sign_up(first_name, city, state):
    try:
        qry = "INSERT INTO customers (customer_name, city, state) VALUES (%s, %s, %s)"
        val = (first_name, city, state)
        res.execute(qry, val)
        con.commit()

        qry = "SELECT customer_id FROM customers WHERE customer_name = %s"
        val = (first_name,)
        res.execute(qry, val)
        result = res.fetchone()
        return {"success": True, "customer_id": result[0]}
    except Exception as e:
        print(f"Error in customer_sign_up: {e}")
        return {"success": False, "error": str(e)}

def customer_log_in(customer_id):
    try:
        qry = "SELECT customer_name FROM customers WHERE customer_id = %s"
        val = (customer_id,)
        res.execute(qry, val)
        result = res.fetchone()
        if result:
            return {"success": True, "customer_name": result[0]}
        else:
            return {"success": False, "error": "Customer ID not found"}
    except Exception as e:
        print(f"Error in customer_log_in: {e}")
        return {"success": False, "error": str(e)}

def get_products():
    try:
        qry = "SELECT * FROM products"
        res.execute(qry)
        result = res.fetchall()
        columns = ['product_id', 'price', 'product_name', 'product_quantity']
        products = [dict(zip(columns, row)) for row in result]
        return {"success": True, "products": products}
    except Exception as e:
        print(f"Error in get_products: {e}")
        return {"success": False, "error": str(e)}

def add_order(customer_id, product_id, quantity):
    try:
        quantity = int(quantity)
        qry = "SELECT * FROM products WHERE product_id = %s"
        val = (product_id,)
        res.execute(qry, val)
        result = res.fetchone()
        if result:
            price = result[1]
            product_name = result[2]
            product_quantity = result[3]

            if product_quantity >= quantity:
                total_spend = price * quantity
                
                qry = "INSERT INTO orders (customer_id, product_name, product_id, quantity, total_spend) VALUES (%s, %s, %s, %s, %s)"
                val = (customer_id, product_name, product_id, quantity, total_spend)
                res.execute(qry, val)
                con.commit()

                qry = "SELECT LAST_INSERT_ID()"
                res.execute(qry)
                order_id = res.fetchone()[0]

                new_stock = product_quantity - quantity
                qry = "UPDATE products SET product_quantity = %s WHERE product_id = %s"
                val = (new_stock, product_id)
                res.execute(qry, val)
                con.commit()

                return {"success": True, "order_id": order_id}
            else:
                return {"success": False, "error": "Insufficient stock"}
        else:
            return {"success": False, "error": "Product not found"}
    except Exception as e:
        print(f"Error in add_order: {e}")
        return {"success": False, "error": str(e)}

def cancel_order(order_id):
    try:
        qry = "SELECT quantity, product_id FROM orders WHERE order_id = %s"
        val = (order_id,)
        res.execute(qry, val)
        result = res.fetchone()
        if result:
            quantity = result[0]
            product_id = result[1]

            qry = "SELECT product_quantity FROM products WHERE product_id = %s"
            val = (product_id,)
            res.execute(qry, val)
            stock = res.fetchone()[0]

            new_stock = stock + quantity
            qry = "UPDATE products SET product_quantity = %s WHERE product_id = %s"
            val = (new_stock, product_id)
            res.execute(qry, val)
            con.commit()

            qry = "DELETE FROM orders WHERE order_id = %s"
            val = (order_id,)
            res.execute(qry, val)
            con.commit()
            return {"success": True}
        else:
            return {"success": False, "error": "Order not found"}
    except Exception as e:
        print(f"Error in cancel_order: {e}")
        return {"success": False, "error": str(e)}

def get_order_details(order_id):
    try:
        qry = "SELECT product_id, product_name, quantity, total_spend FROM orders WHERE order_id = %s"
        val = (order_id,)
        res.execute(qry, val)
        result = res.fetchone()
        if result:
            return {
                "success": True,
                "product_id": result[0],
                "product_name": result[1],
                "quantity": result[2],
                "total_spend": result[3]
            }
        else:
            return {"success": False, "error": "Order not found"}
    except Exception as e:
        print(f"Error in get_order_details: {e}")
        return {"success": False, "error": str(e)}

def employee_log_in(employee_name, employee_password):
    try:
        qry = "SELECT employee_id FROM employees WHERE employee_name = %s AND employee_password = %s"
        val = (employee_name, employee_password)
        res.execute(qry, val)
        result = res.fetchone()
        if result:
            return {"success": True, "employee_id": result[0]}
        else:
            return {"success": False, "error": "Invalid employee credentials"}
    except Exception as e:
        print(f"Error in employee_log_in: {e}")
        return {"success": False, "error": str(e)}

def add_product(product_name, price, quantity):
    try:
        qry = "INSERT INTO products (product_name, price, product_quantity) VALUES (%s, %s, %s)"
        val = (product_name, price, quantity)
        res.execute(qry, val)
        con.commit()
        return {"success": True}
    except Exception as e:
        print(f"Error in add_product: {e}")
        return {"success": False, "error": str(e)}

# Flask routes
@app.route('/customer/signup', methods=['POST'])
def signup_customer():
    data = request.get_json()
    first_name = data.get('first_name')
    city = data.get('city')
    state = data.get('state')
    
    if not first_name or not city or not state:
        return jsonify({"error": "All fields are required"}), 400

    result = customer_sign_up(first_name, city, state)
    if result["success"]:
        return jsonify({"message": "Registered successfully", "customer_id": result["customer_id"]}), 201
    else:
        return jsonify({"error": result["error"]}), 500

@app.route('/customer/login', methods=['POST'])
def login_customer():
    data = request.get_json()
    customer_id = data.get('customer_id')
    
    if not customer_id:
        return jsonify({"error": "Customer ID is required"}), 400
    
    result = customer_log_in(customer_id)
    if result["success"]:
        return jsonify({"message": f"Welcome {result['customer_name']}"})
    else:
        return jsonify({"error": result["error"]}), 404

@app.route('/products', methods=['GET'])
def get_products_route():
    result = get_products()
    if result["success"]:
        return jsonify(result["products"]), 200
    else:
        return jsonify({"error": result["error"]}), 500

@app.route('/order', methods=['POST'])
def place_order():
    data = request.get_json()
    customer_id = data.get('customer_id')
    product_id = data.get('product_id')
    quantity = data.get('quantity')

    if not customer_id or not product_id or not quantity:
        return jsonify({"error": "All fields are required"}), 400

    result = add_order(customer_id, product_id, quantity)
    if result["success"]:
        return jsonify({"message": "Order placed successfully", "order_id": result["order_id"]}), 201
    else:
        return jsonify({"error": result["error"]}), 400

@app.route('/order/cancel', methods=['POST'])
def cancel_order_route():
    data = request.get_json()
    order_id = data.get('order_id')
    customer_id = data.get('customer_id')
    if not order_id or not customer_id:
        return jsonify({"error": "Order ID and Customer ID are required"}), 400

    result = cancel_order(order_id)
    if result["success"]:
        return jsonify({"message": "Order canceled successfully"}), 200
    else:
        return jsonify({"error": result["error"]}), 400

@app.route('/order/details', methods=['POST'])
def order_details_route():
    data = request.get_json()
    order_id = data.get('order_id')
    if not order_id:
        return jsonify({"error": "Order ID is required"}), 400

    result = get_order_details(order_id)
    if result["success"]:
        return jsonify(result), 200
    else:
        return jsonify({"error": result["error"]}), 404

@app.route('/employee/login', methods=['POST'])
def login_employee():
    data = request.get_json()
    employee_name = data.get('employee_name')
    employee_password = data.get('employee_password')

    if not employee_name or not employee_password:
        return jsonify({"error": "Employee name and password are required"}), 400

    result = employee_log_in(employee_name, employee_password)
    if result["success"]:
        return jsonify({"message": f"Welcome employee {employee_name}", "employee_id": result["employee_id"]})
    else:
        return jsonify({"error": result["error"]}), 401

@app.route('/product/add', methods=['POST'])
def add_product_route():
    data = request.get_json()
    product_name = data.get('product_name')
    price = data.get('price')
    quantity = data.get('quantity')
    
    if not product_name or not price or not quantity:
        return jsonify({"error": "All fields are required"}), 400

    result = add_product(product_name, price, quantity)
    if result["success"]:
        return jsonify({"message": "Product added successfully"}), 201
    else:
        return jsonify({"error": result["error"]}), 500

if __name__ == '__main__':
    app.run(debug=True)
