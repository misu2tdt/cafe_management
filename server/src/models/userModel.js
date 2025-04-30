import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const UserModel = {
  /**
   * Tìm user theo email
   * @param {string} email Email của user cần tìm
   * @returns {Promise<Object|null>} User object hoặc null nếu không tìm thấy
   */
  async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
    });
  },

  /**
   * Tìm user theo ID
   * @param {number} id ID của user cần tìm
   * @returns {Promise<Object|null>} User object hoặc null nếu không tìm thấy
   */
  async findById(id) {
    return await prisma.user.findUnique({
      where: { id },
    });
  },

  /**
   * Tạo user mới (chỉ dành cho CUSTOMER)
   * @param {Object} userData Dữ liệu user cần tạo
   * @returns {Promise<Object>} User object đã tạo
   */
  async createUser(userData) {
    // Mặc định role là CUSTOMER nếu không được cung cấp
    const data = {
      ...userData,
      role: userData.role || 'CUSTOMER',
      // Tạo bản ghi Customer tương ứng
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

  /**
   * Cập nhật thông tin user
   * @param {number} id ID của user cần cập nhật
   * @param {Object} userData Dữ liệu user cần cập nhật
   * @returns {Promise<Object>} User object đã cập nhật
   */
  async updateUser(id, userData) {
    return await prisma.user.update({
      where: { id },
      data: userData
    });
  },

  /**
   * Xóa user
   * @param {number} id ID của user cần xóa
   * @returns {Promise<Object>} User object đã xóa
   */
  async deleteUser(id) {
    return await prisma.user.delete({
      where: { id }
    });
  },

  /**
   * Lấy danh sách tất cả user
   * @returns {Promise<Array>} Danh sách user
   */
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