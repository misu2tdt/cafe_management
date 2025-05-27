import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  await prisma.category.createMany({
    data: [
      { name: 'Cà phê' },
      { name: 'Trà trái cây' },
      { name: 'Macchiato & Matcha' },
      { name: 'Trà sữa' },
      { name: 'Đá xay' },
      { name: 'Nước ép' }
    ],
  })

  const categoryMap = await prisma.category.findMany()

  const itemsData = [
    // Cà phê
    { name: 'Cà phê đá', category: 'Cà phê', basePrice: 30000, description: 'Cà phê đen truyền thống, đậm vị và sảng khoái.', imageURL: 'Cà phê đá.jpg' },
    { name: 'Cà phê sữa', category: 'Cà phê', basePrice: 35000, description: 'Kết hợp cà phê đen cùng sữa đặc thơm béo.', imageURL: 'Cà phê sữa.jpg' },
    { name: 'Cà phê muối', category: 'Cà phê', basePrice: 40000, description: 'Hương vị độc đáo với lớp muối mặn nhẹ quyện vị cà phê.', imageURL: 'Cà phê muối.jpg' },

    // Trà trái cây
    { name: 'Trà lài cam dâu', category: 'Trà trái cây', basePrice: 45000, description: 'Hương vị dịu nhẹ từ trà lài kết hợp vị ngọt thanh cam và dâu.', imageURL: 'Trà lài cam dâu.jpg' },
    { name: 'Trà lài cam hạt chia', category: 'Trà trái cây', basePrice: 47000, description: 'Trà lài mát lành với cam tươi và hạt chia bổ dưỡng.', imageURL: 'Trà lài cam hạt chia.jpg' },
    { name: 'Trà lài dâu tằm', category: 'Trà trái cây', basePrice: 47000, description: 'Sự hòa quyện của trà lài cùng vị chua ngọt của dâu tằm.', imageURL: 'Trà lài dâu tằm.jpg' },
    { name: 'Trà vải lá dứa', category: 'Trà trái cây', basePrice: 48000, description: 'Vị thanh mát của vải kết hợp cùng hương thơm lá dứa.', imageURL: 'Trà vải lá dứa.jpg' },

    // Macchiato & Matcha
    { name: 'Oolong macchiato', category: 'Macchiato & Matcha', basePrice: 49000, description: 'Trà oolong đậm vị phủ lớp kem macchiato béo mịn.', imageURL: 'Oolong macchiato.jpg' },
    { name: 'Matcha latte', category: 'Macchiato & Matcha', basePrice: 50000, description: 'Vị trà xanh matcha Nhật Bản hoà quyện cùng sữa tươi.', imageURL: 'Matcha Latte.jpg' },
    { name: 'Matcha sữa tươi', category: 'Macchiato & Matcha', basePrice: 52000, description: 'Trà matcha nguyên chất kết hợp sữa tươi thơm ngon.', imageURL: 'Matcha sữa tươi.jpg' },

    // Trà sữa
    { name: 'Trà sữa gạo rang', category: 'Trà sữa', basePrice: 45000, description: 'Vị béo nhẹ, thơm đặc trưng từ gạo rang và sữa.', imageURL: 'Trà sữa gạo rang.jpg' },
    { name: 'Trà sữa truyền thống', category: 'Trà sữa', basePrice: 43000, description: 'Hương vị quen thuộc từ trà đen và sữa đặc.', imageURL: 'Trà sữa truyền thống.jpg' },
    { name: 'Trà sữa lài', category: 'Trà sữa', basePrice: 44000, description: 'Trà lài thơm dịu hoà quyện với sữa béo ngậy.', imageURL: 'Trà sữa lài.jpg' },
    { name: 'Trà Oolong sữa', category: 'Trà sữa', basePrice: 46000, description: 'Trà oolong đậm vị cùng sữa tạo nên thức uống đầy năng lượng.', imageURL: 'Trà Oolong sữa.jpg' },

    // Đá xay
    { name: 'Ổi hồng muối ớt đá xay', category: 'Đá xay', basePrice: 49000, description: 'Vị chua ngọt của ổi hồng kết hợp chút cay nhẹ từ muối ớt.', imageURL: 'Ổi hồng muối ớt đã xay.jpg' },
    { name: 'Sữa chua xoài', category: 'Đá xay', basePrice: 48000, description: 'Sữa chua kết hợp xoài chín tạo cảm giác mát lạnh và bổ dưỡng.', imageURL: 'Sữa chua xoài.jpg' },
    { name: 'Sữa chua Hibicus', category: 'Đá xay', basePrice: 49000, description: 'Hương vị mới lạ từ hibicus và sữa chua lên men.', imageURL: 'Sữa chua hibicus.jpg' },

    // Nước ép
    { name: 'Ép cam lê', category: 'Nước ép', basePrice: 50000, description: 'Sự kết hợp hoàn hảo giữa cam mọng nước và lê ngọt thanh.', imageURL: 'Ép_cam_lê.jpg' },
    { name: 'Ép táo nho', category: 'Nước ép', basePrice: 50000, description: 'Nước ép táo kết hợp nho mang lại vị ngọt tự nhiên.', imageURL: 'Ép_táo_nho.jpg' },
    { name: 'Ép sơri ổi', category: 'Nước ép', basePrice: 51000, description: 'Sơri và ổi hoà quyện tạo nên ly nước ép độc đáo, hấp dẫn.', imageURL: 'Ép_sơri_ổi.jpg' },
    { name: 'Ép dưa hấu', category: 'Nước ép', basePrice: 45000, description: 'Dưa hấu đỏ mọng ép tươi mang lại cảm giác sảng khoái.', imageURL: 'Ép_dưa hấu.jpg' },
  ]

  for (const item of itemsData) {
    const category = categoryMap.find(c => c.name === item.category)
    await prisma.menuItem.create({
      data: {
        name: item.name,
        description: item.description,
        price: item.basePrice,
        categoryId: category.id,
        imageURL: item.imageURL,
      },
    })
  }

  const customers = await Promise.all([
    createUser('Nguyễn Thị Mai', '0900000001', 'mainguyen@gmail.com', 'CUSTOMER'),
    createUser('Trần Văn Hùng', '0900000002', 'hungtran@gmail.com', 'CUSTOMER'),
    createUser('Lê Thanh Tùng', '0900000003', 'tunle@gmail.com', 'CUSTOMER'),
    createUser('Phạm Mỹ Linh', '0900000004', 'linhpham@gmail.com', 'CUSTOMER'),
  ])

  const employees = await Promise.all([
    createUser('Hoàng Đức', '0910000001', 'duchoang@gmail.com', 'EMPLOYEE', 7000000),
    createUser('Vũ Thị Hạnh', '0910000002', 'hanhvu@gmail.com', 'EMPLOYEE', 7500000),
    createUser('Ngô Minh Tuấn', '0910000003', 'tuanngo@gmail.com', 'EMPLOYEE', 7200000),
    createUser('Bùi Ngọc Hà', '0910000004', 'habui@gmail.com', 'EMPLOYEE', 7100000),
    createUser('Đặng Quốc Anh', '0910000005', 'anhdang@gmail.com', 'EMPLOYEE', 7300000),
  ])

  await createUser('Lâm Thị Thu', '0920000001', 'thulam@gmail.com', 'MANAGER', 12500000)
}

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

async function createUser(fullname, phone, email, role, salary = null) {
  const user = await prisma.user.create({
    data: {
      fullname,
      phone,
      email,
      password: await hashPassword('123456'),
      role,
    },
  })

  if (role === 'CUSTOMER') {
    await prisma.customer.create({ data: { id: user.id } })
  } else if (role === 'EMPLOYEE') {
    await prisma.employee.create({ data: { id: user.id, salary } })
  } else if (role === 'MANAGER') {
    await prisma.manager.create({ data: { id: user.id, salary } })
  }

  return user
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
