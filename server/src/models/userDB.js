import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const UserModel = {
  async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
    });
  },
  async createUser(userData) {
    const data = {
      ...userData,
      role: userData.role || 'CUSTOMER',
      Customer: {
        create: {}
      }
    };

    return await prisma.user.create({
      data,
      include: {
        Customer: true
      }
    });
  },

  async updateUser(id, userData) {
    return await prisma.user.update({
      where: { id },
      data: userData
    });
  },

  async deleteUser(id) {
    return await prisma.user.delete({
      where: { id }
    });
  },

  async getAllUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        fullname: true,
        email: true,
        phone: true,
        role: true
      }
    });
  }
};