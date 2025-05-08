import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// POST /api/orders
const createOrderController = async (req, res) => {
  try {
    const {
      customerId,
      staffId,
      paymentMethod,
      transactionDate,
      items, // [{ itemId: 1, quantity: 2, status: 'Pending' }, ...]
      total
    } = req.body;

    // 1. Tạo Order trước
    const newOrder = await prisma.order.create({
      data: {
        customerId,
        staffId,
        total,
        paymentMethod,
        transactionDate: new Date(transactionDate),
      },
    });

    // 2. Tạo từng OrderMenu tương ứng
    const orderItemsData = items.map(item => ({
      orderId: newOrder.id,
      itemId: item.itemId,
      quantity: item.quantity,
      status: item.status,
    }));

    await prisma.orderMenu.createMany({
      data: orderItemsData,
    });

    // 3. Trả kết quả về
    const fullOrder = await prisma.order.findUnique({
      where: { id: newOrder.id },
      include: {
        orderItems: {
          include: {
            MenuItem: true,
          },
        },
        Customer: {
          include: { User: true },
        },
        Staff: {
          include: { User: true },
        },
      },
    });

    res.status(201).json(fullOrder);
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ error: "Failed to create order", details: error.message });
  }
};
const getAllOrdersController = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: { MenuItem: true },
        },
        Customer: { include: { User: true } },
        Staff: { include: { User: true } },
      },
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};
const getOrderByIdController = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: { MenuItem: true },
        },
        Customer: { include: { User: true } },
        Staff: { include: { User: true } },
      },
    });

    if (order) res.status(200).json(order);
    else res.status(404).json({ error: "Order not found" });
  } catch (error) {
    console.error("❌ Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};
const updateOrderStatusController = async (req, res) => {
  const id = parseInt(req.params.id);
  const { newStatus } = req.body;

  try {
    const updated = await prisma.orderMenu.updateMany({
      where: { orderId: id },
      data: { status: newStatus },
    });

    if (updated.count > 0) {
      res.json({ message: "Status updated" });
    } else {
      res.status(404).json({ error: "Order or items not found" });
    }
  } catch (error) {
    console.error("❌ Error updating status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
};
const deleteOrderController = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    // Xoá trước các item con
    await prisma.orderMenu.deleteMany({
      where: { orderId: id },
    });

    // Sau đó xoá đơn hàng
    await prisma.order.delete({
      where: { id },
    });

    res.json({ message: "Order deleted" });
  } catch (error) {
    console.error("❌ Error deleting order:", error);
    res.status(500).json({ error: "Failed to delete order" });
  }
};

export {
  createOrderController,
  getAllOrdersController,
  getOrderByIdController,
  updateOrderStatusController,
  deleteOrderController,
};
