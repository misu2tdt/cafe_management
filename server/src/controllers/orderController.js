import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

const sizeModifiers = {
  "S": 1,   
  "M": 1.2,  
  "L": 1.4   
}

const calculatePriceBySize = async (menuItemId, size) => {
  try {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: menuItemId }
    })
    
    if (!menuItem) throw new Error("Menu item not found")
    
    return Math.round(menuItem.price * sizeModifiers[size])
  } catch (error) {
    console.error("Error calculating price:", error)
    throw error
  }
}


export const createOrderController = async (req, res) => {
  try {
    const {
      paymentMethod,
      items,
      total,
      OrderName 
    } = req.body

    const userId = req.body.userId
    const role = req.body.role

    let customerId = null
    let employeeId = null

    if (role === "CUSTOMER") {
      customerId = userId
    } else if (role === "EMPLOYEE") {
      employeeId = userId
      if (!OrderName) {
        return res.json({success: false, message: "Cần điền tên khách hàng vào"})
      }
    } else {
      return res.json({success: false, message: "Role không phù hợp"})
    }

    // Tạo đơn hàng
    const newOrder = await prisma.order.create({
      data: {
        customerId,
        employeeId,
        OrderName: OrderName || null,
        total,
        paymentMethod,
        status: "PENDING",
        createdAt: new Date()
      },
    })

    const orderItemsData = []
    
    for (const item of items) {
      const calculatedPrice = await calculatePriceBySize(item.menuItemId, item.size)
      
      orderItemsData.push({
        orderId: newOrder.id,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        size: item.size,
        price: calculatedPrice, // Lưu giá theo size vào bảng OrderItem
        note: item.note || null
      })
    }

    await prisma.orderItem.createMany({ data: orderItemsData })

    res.json({success: true, message: "Tạo đơn thành công"})

  } catch (error) {
    console.error("Error creating order:", error)
    res.json({success: false, message: "Tạo đơn thất bại"})
  }
}

export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: { include: { user: true } },
        employee: { include: { user: true } },
      },
    })

    const mappedOrders = orders.map(order => {
      let displayName = "Unknown"

      if (order.customer?.user?.fullname) {
        displayName = order.customer.user.fullname
      } else if (order.OrderName) {
        displayName = order.OrderName
      }

      return {
        id: order.id,
        displayName,
        createdAt: order.createdAt,
        paymentMethod: order.paymentMethod,
        total: order.total,
        status: order.status
      }
    })
    res.status(200).json(mappedOrders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    res.json({success: false, message: "Lấy danh sách đơn thất bại"})
  }
}

export const getOrderByIdController = async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: { menuItem: true },
        },
      },
    })

    if (!order) return res.status(404).json({ error: "Order not found" })

    const items = order.orderItems.map(item => ({
      name: item.menuItem.name,
      quantity: item.quantity,
      size: item.size,
      note: item.note,
      price: item.price || Math.round(item.menuItem.price * sizeModifiers[item.size || "S"]),
      image: item.menuItem.imageURL
    }))

    res.status(200).json({ items })
  } catch (error) {
    console.error("Error fetching order:", error)
    res.json({success: false, message: "Lấy danh sách đơn thất bại"})
  }
}

export const getMyOrdersController = async (req, res) => {
  const role = req.body.role
  const userId = req.body.userId

  if (role !== "CUSTOMER") {
    return res.status(403).json({ error: "Only customers can view their orders." })
  }

  try {
    const orders = await prisma.order.findMany({
      where: { customerId: userId },
      include: {
        employee: { include: { user: true } },
      },
    })

    const mappedOrders = orders.map(order => ({
      id: order.id,
      displayName: order.OrderName || "Bạn",
      createdAt: order.createdAt,
      paymentMethod: order.paymentMethod,
      total: order.total,
      status: order.status
    }))

    res.status(200).json(mappedOrders)
  } catch (error) {
    console.error("Error fetching customer's orders:", error)
    res.status(500).json({ error: "Failed to fetch customer's orders" })
  }
}

export const updateOrderStatusController = async (req, res) => {
  const id = parseInt(req.params.id)
  const { status } = req.body

  try {
    const updated = await prisma.order.update({
      where: { id },
      data: { status },
    })

    if (updated) {
      res.json({ message: "Status updated" })
    } else {
      res.status(404).json({ error: "Order or items not found" })
    }
  } catch (error) {
    console.error("Error updating status:", error)
    res.status(500).json({ error: "Failed to update order status" })
  }
}
