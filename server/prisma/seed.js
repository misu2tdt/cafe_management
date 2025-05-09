import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.category.createMany({
    data: [
      { name: 'Coffee' },
      { name: 'Tea' },
      { name: 'Dessert' },
      { name: 'Smoothie' },
    ],
  });

  const categoryMap = await prisma.category.findMany();

  const itemsData = [
    { name: 'Cappuccino', category: 'Coffee', basePrice: 45000 },
    { name: 'Espresso', category: 'Coffee', basePrice: 40000 },
    { name: 'Latte', category: 'Coffee', basePrice: 47000 },
    { name: 'Matcha Latte', category: 'Tea', basePrice: 50000 },
    { name: 'Milk Tea', category: 'Tea', basePrice: 43000 },
    { name: 'Cheesecake', category: 'Dessert', basePrice: 55000 },
    { name: 'Tiramisu', category: 'Dessert', basePrice: 56000 },
    { name: 'Strawberry Smoothie', category: 'Smoothie', basePrice: 48000 },
    { name: 'Mango Smoothie', category: 'Smoothie', basePrice: 49000 },
    { name: 'Choco Lava Cake', category: 'Dessert', basePrice: 53000 },
  ];

  for (const item of itemsData) {
    const category = categoryMap.find(c => c.name === item.category);
    const image_filename = item.name.toLowerCase().replace(/ /g, '_') + '.jpg';

    await prisma.menuItem.create({
      data: {
        name: item.name,
        description: `${item.name} Description`,
        price: item.basePrice,
        categoryId: category.id,
        imageURL: image_filename,
      },
    });
  }

  const customers = await Promise.all([
    createUser('Alice', '0900000001', 'alice@example.com', 'CUSTOMER'),
    createUser('Bob', '0900000002', 'bob@example.com', 'CUSTOMER'),
    createUser('Charlie', '0900000003', 'charlie@example.com', 'CUSTOMER'),
    createUser('Diana', '0900000004', 'diana@example.com', 'CUSTOMER'),
  ]);

  const staff = await Promise.all([
    createUser('Eve', '0910000001', 'eve@example.com', 'STAFF', 8000000),
    createUser('Frank', '0910000002', 'frank@example.com', 'STAFF', 8500000),
    createUser('Grace', '0910000003', 'grace@example.com', 'STAFF', 8200000),
  ]);

  await createUser('Henry', '0920000001', 'henry@example.com', 'MANAGER', 15000000);

  const allItems = await prisma.menuItem.findMany();
  for (const customer of customers) {
    const orderCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < orderCount; i++) {
      const selectedStaff = staff[Math.floor(Math.random() * staff.length)];
      const orderMenus = getFixedOrderMenus(allItems);
      const total = orderMenus.reduce((sum, om) => sum + om.price * om.quantity, 0);

      await prisma.order.create({
        data: {
          customerId: customer.id,
          staffId: selectedStaff.id,
          total,
          createdAt: new Date(),
          paymentMethod: i % 2 === 0 ? 'CASH' : 'CARD',
          orderMenus: {
            create: orderMenus,
          },
        },
      });
    }
  }
}

function getFixedOrderMenus(menuItems) {
  const itemCount = Math.floor(Math.random() * 3) + 1;
  const selected = [];

  for (let i = 0; i < itemCount; i++) {
    const item = menuItems[Math.floor(Math.random() * menuItems.length)];
    const sizeIndex = Math.floor(Math.random() * 3);
    const size = ['S', 'M', 'L'][sizeIndex];
    const price = item.price + sizeIndex * 5000;

    selected.push({
      menuItemId: item.id,
      quantity: Math.floor(Math.random() * 2) + 1,
      price,
      size,
      note: Math.random() > 0.7 ? 'No sugar' : null,
      status: ['PENDING', 'PROCESSING', 'DONE'][Math.floor(Math.random() * 3)],
    });
  }

  return selected;
}

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

async function createUser(fullname, phone, email, role, salary = null) {
  const user = await prisma.user.create({
    data: {
      fullname,
      phone,
      email,
      password: await hashPassword('123456'),
      role,
    },
  });

  if (role === 'CUSTOMER') {
    await prisma.customer.create({ data: { id: user.id } });
  } else if (role === 'STAFF') {
    await prisma.staff.create({ data: { id: user.id, salary } });
  } else if (role === 'MANAGER') {
    await prisma.manager.create({ data: { id: user.id, salary } });
  }

  return user;
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
