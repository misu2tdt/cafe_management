// Sample in-memory order data (mock database)
let orders = [
  { id: 1, items: ["Tra sua", "Com tam"], status: "Cho xac nhan", total: 105000 },
];

// Get all orders
function getAllOrders() {
  return orders;
}

// Get a single order by ID
function getOrderById(id) {
  return orders.find(order => order.id === id);
}

// Create new order
function createOrder(orderData) {
  const newOrder = {
    id: Date.now(), // Use timestamp for simplicity
    ...orderData,
  };
  orders.push(newOrder);
  return newOrder;
}

// Update order status by ID
function updateOrderStatus(id, newStatus) {
  const order = orders.find(o => o.id === id);
  if (order) {
    order.status = newStatus;
    return true;
  }
  return false;
}

// Delete an order by ID
function deleteOrder(id) {
  const index = orders.findIndex(o => o.id === id);
  if (index !== -1) {
    orders.splice(index, 1);
    return true;
  }
  return false;
}

export {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};
