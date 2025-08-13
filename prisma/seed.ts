import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...');
  
  const plans = [
    {
      id: 'plan-starter',
      name: 'Starter',
      price: 49,
      tasks: 500,
      agents: 1,
    },
    {
      id: 'plan-pro',
      name: 'Pro',
      price: 199,
      tasks: 5000,
      agents: 5,
    },
    {
      id: 'plan-enterprise',
      name: 'Enterprise',
      price: null, // Custom pricing
      tasks: -1, // Unlimited
      agents: -1, // Unlimited
    },
  ];

  for (const plan of plans) {
    const existingPlan = await prisma.plan.findUnique({
      where: { id: plan.id },
    });

    if (!existingPlan) {
      await prisma.plan.create({
        data: plan,
      });
      console.log(`Created plan: ${plan.name}`);
    } else {
      console.log(`Plan "${plan.name}" already exists.`);
    }
  }

  // Create a default company, teams, and users for easy testing
  const acmeCompany = await prisma.company.findUnique({ where: { id: 'comp-acme' } });
  if (!acmeCompany) {
      console.log('Creating default company, teams, and users...');
      await prisma.company.create({
          data: {
              id: 'comp-acme',
              name: 'Acme Corp',
              planId: 'plan-pro',
              teams: {
                  create: [
                      { id: 'team-tech', name: 'Technical Support' },
                      { id: 'team-billing', name: 'Billing' },
                  ]
              },
              users: {
                  create: [
                      { id: 'user-alice', name: 'Alice', email: 'alice@acme.com', password: 'password', teamId: 'team-tech' },
                      { id: 'user-bob', name: 'Bob', email: 'bob@acme.com', password: 'password', teamId: 'team-tech' },
                      { id: 'user-charlie', name: 'Charlie', email: 'charlie@acme.com', password: 'password', teamId: 'team-billing' },
                  ]
              }
          }
      });
      console.log('Default data created.');
  } else {
    console.log('Default company "Acme Corp" already exists.');
  }


  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
