import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Starting seed process...');
    
    // Hàm mã hóa mật khẩu
    const hashPassword = async (password) => {
      const salt = await bcrypt.genSalt(10);
      return bcrypt.hash(password, salt);
    };

    console.log('Creating users...');
    // Insert nhiều Users cùng lúc với mật khẩu đã mã hóa
    const [customerUser, staffUser, managerUser] = await Promise.all([
      prisma.user.create({
        data: {
          fullname: 'Nguyễn Văn A',
          phone: '0123456789',
          email: 'a@example.com',
          password: await hashPassword('pass123'),
          role: 'CUSTOMER',
          Customer: { create: {} },
        },
      }),
      prisma.user.create({
        data: {
          fullname: 'Trần Thị B',
          phone: '0987654321',
          email: 'b@example.com',
          password: await hashPassword('pass456'),
          role: 'STAFF',
          Staff: { create: { salary: 8000000 } },
        },
      }),
      prisma.user.create({
        data: {
          fullname: 'Lê Văn C',
          phone: '0111222333',
          email: 'c@example.com',
          password: await hashPassword('pass789'),
          role: 'MANAGER',
          Manager: { create: { salary: 12000000 } },
        },
      }),
    ]);
    console.log('✅ Users created successfully!');

    console.log('Creating menu items...');
    // Insert nhiều MenuItem nhanh bằng createMany
    await prisma.menuItem.createMany({
      data: [
        {
          name: 'Cà phê sữa',
          description: 'Cà phê pha với sữa đặc',
          price: 25000,
          quantity: 100,
        },
        {
          name: 'Trà đào',
          description: 'Trà đào mát lạnh',
          price: 30000,
          quantity: 80,
        },
      ],
      skipDuplicates: true,
    });
    console.log('✅ Menu items created successfully!');

    // Lấy menu items đã tạo
    const [coffee, tea] = await prisma.menuItem.findMany({
      where: { name: { in: ['Cà phê sữa', 'Trà đào'] } },
    });

    if (!coffee || !tea) {
      throw new Error('Failed to find created menu items!');
    }

    console.log('Creating order...');
    // Tạo đơn hàng và orderItems cùng lúc
    const order = await prisma.order.create({
      data: {
        customerId: customerUser.id,
        staffId: staffUser.id,
        total: 55000,
        paymentMethod: 'CASH',
        transactionDate: new Date(),
        orderItems: {
          create: [
            { itemId: coffee.id, status: 'DONE', quantity: 1 },
            { itemId: tea.id, status: 'DONE', quantity: 1 },
          ],
        },
      },
    });
    console.log(`✅ Order created with ID: ${order.id}`);

    console.log('Creating inventory...');
    // Tạo inventory
    const inventory = await prisma.inventory.create({
      data: {
        ingredientId: 1, // Lưu ý: Ở đây có thể cần tạo bảng Ingredients trước
        name: 'Sữa đặc',
        quantity: 50,
        reorderLevel: 10,
      },
    });
    console.log(`✅ Inventory created with ID: ${inventory.id}`);

    console.log('Creating report...');
    // Tạo report
    const report = await prisma.report.create({
      data: {
        managerId: managerUser.id,
        inventoryId: inventory.id,
      },
    });
    console.log(`✅ Report created with ID: ${report.id}`);

    console.log('🌱 Seed completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Failed to seed database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });