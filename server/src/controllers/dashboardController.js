import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export const getReportController = async (req, res) => {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        status: "DONE", // chỉ tính đơn hoàn tất
      },
      include: {
        orderItems: true,
      },
    })

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const totalOrders = orders.length

    const itemStats = {}
    for (const order of orders) {
      for (const item of order.orderItems) {
        const key = item.menuItemId
        itemStats[key] = (itemStats[key] || 0) + item.quantity
      }
    }

    const topItemId = Object.keys(itemStats).reduce((a, b) => itemStats[a] > itemStats[b] ? a : b, null)

    const topItem = topItemId ? await prisma.menuItem.findUnique({ where: { id: parseInt(topItemId) } }) : null

    const customerCount = await prisma.customer.count()

    res.status(200).json({
      totalRevenue,
      totalOrders,
      topMenuItem: topItem ? {
        id: topItem.id,
        name: topItem.name,
        quantity: itemStats[topItemId],
      } : null,
      customerCount,
    })
  } catch (error) {
    console.error("Error generating report:", error)
    res.status(500).json({ error: "Failed to generate report" })
  }
}

export const getDailyRevenueController = async (req, res) => {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)


    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        status: "DONE",
      },
      select: {
        total: true,
        createdAt: true,
      },
    })

    const dailyRevenue = {}
    
    orders.forEach(order => {
      const dateKey = order.createdAt.toISOString().split('T')[0] 
      if (!dailyRevenue[dateKey]) {
        dailyRevenue[dateKey] = 0
      }
      dailyRevenue[dateKey] += order.total
    })

    const dailyRevenueArray = Object.entries(dailyRevenue)
      .map(([date, revenue]) => ({
        date,
        revenue,
        day: new Date(date).getDate()
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))

    res.status(200).json(dailyRevenueArray)
  } catch (error) {
    console.error("Error fetching daily revenue:", error)
    res.status(500).json({ error: "Failed to fetch daily revenue" })
  }
}
