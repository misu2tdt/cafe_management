import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const UserModel = {
  async findbyEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
    });
  },

  async findbyPass(password) {
    return await prisma.user.findUnique({
      where: { password },
    });
  },

  async createUser(userData) {
    return await prisma.user.create({
      data: userData,
    });
  },

  
}