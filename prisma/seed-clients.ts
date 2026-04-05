import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const sessions = await prisma.session.findMany({
    include: { pricingTiers: true },
    orderBy: { startDate: "asc" },
  });

  if (sessions.length === 0) {
    console.error("No sessions found — run the main seed first.");
    return;
  }

  const getEarlyBirdTier = (session: (typeof sessions)[0]) =>
    session.pricingTiers.find((t) => t.tierType === "EARLY_BIRD") ??
    session.pricingTiers.find((t) => t.tierType === "STANDARD");

  const getStandardTier = (session: (typeof sessions)[0]) =>
    session.pricingTiers.find((t) => t.tierType === "STANDARD");

  const clients = [
    // Session 1 — 3 registrations
    {
      session: sessions[0],
      parentName: "Мария Петрова",
      email: "m.petrova@gmail.com",
      phone: "0887123456",
      attribution: "Instagram",
      status: "DEPOSIT_PAID" as const,
      paymentMethod: "STRIPE" as const,
      flowType: "B" as const,
      tier: getEarlyBirdTier(sessions[0]),
      submittedAt: new Date("2026-03-10T14:23:00"),
      children: [
        { firstName: "Калин", lastName: "Петров", dob: "2017-05-12" },
      ],
    },
    {
      session: sessions[0],
      parentName: "Георги Иванов",
      email: "g.ivanov@abv.bg",
      phone: "0899234567",
      attribution: "Препоръка от приятел",
      status: "FORM_SUBMITTED" as const,
      paymentMethod: "BANK_TRANSFER" as const,
      flowType: "A" as const,
      tier: getEarlyBirdTier(sessions[0]),
      submittedAt: new Date("2026-03-12T09:45:00"),
      children: [
        { firstName: "Ивана", lastName: "Иванова", dob: "2016-08-22" },
        { firstName: "Никола", lastName: "Иванов", dob: "2019-03-07" },
      ],
    },
    {
      session: sessions[0],
      parentName: "Анна Димитрова",
      email: "anna.dim@gmail.com",
      phone: "0876345678",
      attribution: "Facebook",
      status: "UNFINISHED" as const,
      paymentMethod: undefined,
      flowType: "B" as const,
      tier: getEarlyBirdTier(sessions[0]),
      submittedAt: undefined,
      children: [
        { firstName: "Борис", lastName: "Димитров", dob: "2015-11-30" },
      ],
    },
    // Session 2 — 2 registrations
    {
      session: sessions[1],
      parentName: "Петър Стефанов",
      email: "p.stefanov@yahoo.com",
      phone: "0888456789",
      attribution: "Google Search",
      status: "DEPOSIT_PAID" as const,
      paymentMethod: "BANK_TRANSFER" as const,
      flowType: "A" as const,
      tier: getEarlyBirdTier(sessions[1]),
      submittedAt: new Date("2026-03-08T16:10:00"),
      children: [
        { firstName: "Елена", lastName: "Стефанова", dob: "2018-02-14" },
      ],
    },
    {
      session: sessions[1],
      parentName: "Светлана Тодорова",
      email: "s.todorova@gmail.com",
      phone: "0892567890",
      attribution: "Instagram",
      status: "CONTRACT_SENT" as const,
      paymentMethod: "STRIPE" as const,
      flowType: "B" as const,
      tier: getStandardTier(sessions[1]),
      submittedAt: new Date("2026-03-20T11:30:00"),
      children: [
        { firstName: "Михаил", lastName: "Тодоров", dob: "2016-06-18" },
      ],
    },
    // Session 3 — 2 registrations
    {
      session: sessions[2],
      parentName: "Красимира Николова",
      email: "k.nikolova@abv.bg",
      phone: "0878678901",
      attribution: "Препоръка от учител",
      status: "DEPOSIT_PAID" as const,
      paymentMethod: "STRIPE" as const,
      flowType: "B" as const,
      tier: getEarlyBirdTier(sessions[2]),
      submittedAt: new Date("2026-03-15T10:05:00"),
      children: [
        { firstName: "Александра", lastName: "Николова", dob: "2014-09-03" },
        { firstName: "Виктор", lastName: "Николов", dob: "2012-12-25" },
      ],
    },
    {
      session: sessions[2],
      parentName: "Иван Георгиев",
      email: "i.georgiev@gmail.com",
      phone: "0895789012",
      attribution: "Facebook",
      status: "PAID_IN_FULL" as const,
      paymentMethod: "BANK_TRANSFER" as const,
      flowType: "A" as const,
      tier: getEarlyBirdTier(sessions[2]),
      submittedAt: new Date("2026-03-01T08:20:00"),
      children: [
        { firstName: "Радослав", lastName: "Георгиев", dob: "2013-04-17" },
      ],
    },
    // Session 4 — 1 registration
    {
      session: sessions[3],
      parentName: "Елена Маринова",
      email: "e.marinova@gmail.com",
      phone: "0886890123",
      attribution: "Instagram",
      status: "FORM_SUBMITTED" as const,
      paymentMethod: "BANK_TRANSFER" as const,
      flowType: "A" as const,
      tier: getEarlyBirdTier(sessions[3]),
      submittedAt: new Date("2026-03-25T13:45:00"),
      children: [
        { firstName: "Теодора", lastName: "Маринова", dob: "2015-07-08" },
      ],
    },
    // Plein Air — 1 registration
    {
      session: sessions[5],
      parentName: "Владимир Костов",
      email: "v.kostov@abv.bg",
      phone: "0897901234",
      attribution: "Препоръка от приятел",
      status: "DEPOSIT_PAID" as const,
      paymentMethod: "STRIPE" as const,
      flowType: "B" as const,
      tier: getEarlyBirdTier(sessions[5]),
      submittedAt: new Date("2026-03-18T09:00:00"),
      children: [
        { firstName: "Симона", lastName: "Костова", dob: "2010-01-20" },
      ],
    },
  ];

  console.log("Seeding sample clients...");

  for (const c of clients) {
    const tier = c.tier;
    const childCount = c.children.length;
    let total = tier ? tier.price * childCount : 650 * childCount;
    if (childCount >= 2) total = tier!.price * 1 + tier!.price * (childCount - 1) * 0.94;

    const reg = await prisma.registration.create({
      data: {
        sessionId: c.session.id,
        flowType: c.flowType,
        status: c.status,
        parentName: c.parentName,
        email: c.email,
        phone: c.phone,
        attribution: c.attribution,
        paymentMethod: c.paymentMethod ?? null,
        priceTierId: tier?.id ?? null,
        totalAmount: Math.round(total * 100) / 100,
        lastStepReached: c.status === "UNFINISHED" ? 1 : c.status === "FORM_SUBMITTED" ? 2 : 5,
        submittedAt: c.submittedAt ?? null,
        children: {
          create: c.children.map((ch) => ({
            firstName: ch.firstName,
            lastName: ch.lastName,
            dateOfBirth: new Date(ch.dob),
          })),
        },
      },
    });

    // Update session spotsTaken for confirmed registrations
    if (c.status !== "UNFINISHED") {
      await prisma.session.update({
        where: { id: c.session.id },
        data: {
          spotsTaken: { increment: c.children.length },
          lastBookingAt: c.submittedAt ?? new Date(),
        },
      });
    }

    console.log(`  ✓ ${c.parentName} → ${c.session.slug} (${c.status})`);
  }

  console.log("\n✅ Sample clients seeded!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
