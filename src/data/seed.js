require("dotenv").config();
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seed() {
  const hashedPassword = await bcrypt.hash("123456", 10);

  // Accounts
  for (const account of [
    { name: "Admin", email: "admin@example.com", password: hashedPassword, role: "admin", status: true },
    { name: "Minh VQ", email: "minhvq.dev@gmail.com", password: hashedPassword, role: "user", status: true },
  ]) {
    await prisma.account.upsert({
      where: { email: account.email },
      update: {},
      create: account,
    });
  }

  // Products
  await prisma.product.createMany({
    data: [
      {
        name: "Túi Tote Canvas",
        price: "350000",
        image: "https://via.placeholder.com/400",
        type_bag: "tote",
        size: ["S", "M", "L"],
        color: [
          { id: 1, name: "Đen", image_color: ["https://via.placeholder.com/200/000000"] },
          { id: 2, name: "Trắng", image_color: ["https://via.placeholder.com/200/ffffff"] },
        ],
        title: "Túi tote vải canvas thời trang",
        rate: "4.8",
        sold: "120",
        dimensions: "35x40cm",
        weight: "300g",
        feature: ["Chống nước nhẹ", "Có khóa kéo", "Nhiều ngăn"],
        composition_maintenance: {
          title: "Chất liệu & Bảo quản",
          composition: ["100% Canvas cotton"],
          entretien: ["Giặt tay", "Không sấy khô"],
        },
        sustainability_guarantee: {
          title: "Bền vững",
          description: "Sản phẩm thân thiện môi trường",
          item: [{ logo: "eco", title: "Eco-friendly", description: "Vật liệu tái chế" }],
        },
      },
      {
        name: "Balo Du Lịch",
        price: "750000",
        image: "https://via.placeholder.com/400",
        type_bag: "backpack",
        size: ["M", "L"],
        color: [{ id: 1, name: "Xanh navy", image_color: ["https://via.placeholder.com/200/001f5b"] }],
        title: "Balo du lịch đa năng chống thấm",
        rate: "4.9",
        sold: "85",
        dimensions: "30x50x20cm",
        weight: "800g",
        feature: ["Chống thấm nước", "Cổng sạc USB", "Ngăn laptop 15 inch"],
        composition_maintenance: {
          title: "Chất liệu & Bảo quản",
          composition: ["Polyester 600D"],
          entretien: ["Lau bằng khăn ẩm", "Không giặt máy"],
        },
        sustainability_guarantee: { title: "Bền vững", description: "Sản phẩm bền lâu dài", item: [] },
      },
    ],
  });

  console.log("Seed data inserted successfully!");
  await prisma.$disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
