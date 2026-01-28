import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

const permissions = [
  {
    code: "money_in.read",
    category: "Money-in",
    description: "View Money-in products",
  },
  {
    code: "money_in.write",
    category: "Money-in",
    description: "Manage Money-in products",
  },

  {
    code: "money_out.read",
    category: "Money-out",
    description: "View Money-out products",
  },
  {
    code: "money_out.write",
    category: "Money-out",
    description: "Manage Money-out products",
  },

  { code: "balance.read", category: "Balance", description: "View Balance" },

  { code: "report.read", category: "Report", description: "View Reports" },
  { code: "report.write", category: "Report", description: "Manage Reports" },

  {
    code: "transaction.read",
    category: "Transaction",
    description: "View Transactions",
  },

  // xenPlatform Account
  {
    code: "xenplatform.account.read",
    category: "xenPlatform Account",
    description: "View Accounts",
  },
  {
    code: "xenplatform.account.write",
    category: "xenPlatform Account",
    description: "Manage Accounts",
  },

  // xenPlatform Account Holder
  {
    code: "xenplatform.account_holder.read",
    category: "xenPlatform Account Holder",
    description: "View Account Holders",
  },
  {
    code: "xenplatform.account_holder.write",
    category: "xenPlatform Account Holder",
    description: "Manage Account Holders",
  },

  // xenPlatform Split Payment
  {
    code: "xenplatform.split_payment.read",
    category: "xenPlatform Split Payment",
    description: "View Split Payments",
  },
  {
    code: "xenplatform.split_payment.write",
    category: "xenPlatform Split Payment",
    description: "Manage Split Payments",
  },

  // xenShield Assessment
  {
    code: "xenshield.assessment.read",
    category: "xenShield Assessment",
    description: "View Assessments",
  },
  {
    code: "xenshield.assessment.write",
    category: "xenShield Assessment",
    description: "Manage Assessments",
  },

  // xenShield Identity
  {
    code: "xenshield.identity.read",
    category: "xenShield Identity",
    description: "View Identity Proofing",
  },
  {
    code: "xenshield.identity.write",
    category: "xenShield Identity",
    description: "Manage Identity Proofing",
  },
];

async function main() {
  console.log("Start seeding permissions...");

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { code: perm.code },
      update: {
        category: perm.category,
        description: perm.description,
      },
      create: perm,
    });
  }

  console.log("Permissions seeded.");

  const adminRole = await prisma.role.upsert({
    where: { name: "Admin" },
    update: {},
    create: {
      name: "Admin",
      description: "Default Admin Role with full access",
      permissions: {
        connect: permissions.map((p) => ({ code: p.code })),
      },
    },
  });

  console.log("Admin role created:", adminRole.name);

  const courts = [
    { name: "Arethusa", description: "Standard Pilates Studio" },
    { name: "Leander", description: "Premium Suite with Garden View" },
    { name: "Galatea", description: "Private Couple's Studio" },
  ];

  for (const court of courts) {
    await prisma.court.upsert({
      where: { name: court.name },
      update: { description: court.description },
      create: court,
    });
  }
  console.log("Courts seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
