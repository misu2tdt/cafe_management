import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const MenuModel = {
  async createItem(itemData) {
    return await prisma.menuItem.create({
      data: itemData,
    })
  },

  async getAllItems() {
    return await prisma.menuItem.findMany()
  },

  async updateItem(id, itemData) {
    return await prisma.menuItem.update({
      where: { id: Number(id) }, 
      data: itemData,
    })
  },

  async deleteItem(id) {
    return await prisma.menuItem.delete({
      where: { id: Number(id) }, 
    })
  },
}
