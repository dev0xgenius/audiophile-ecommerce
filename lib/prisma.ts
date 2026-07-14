import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

declare let global: {
    prisma: PrismaClient;
};

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = global.prisma ?? new PrismaClient({ adapter });

export { prisma };

global.prisma = prisma;
