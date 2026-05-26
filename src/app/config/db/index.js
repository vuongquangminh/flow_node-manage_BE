const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function connect() {
  try {
    await prisma.$connect();
    console.log("connect success");
  } catch (error) {
    console.log("connect false");
    console.log(error);
  }
}

module.exports = { prisma, connect };
