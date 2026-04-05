import "dotenv/config";
import { PrismaClient, FlowType, SessionStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.adminUser.upsert({
    where: { email: "admin@dreaminmypocket.org" },
    update: {},
    create: {
      email: "admin@dreaminmypocket.org",
      password: hashedPassword,
      name: "Администратор",
      role: "admin",
    },
  });

  // Trainers
  const trainer1 = await prisma.trainer.upsert({
    where: { id: "trainer-1" },
    update: {},
    create: {
      id: "trainer-1",
      name: "Мария Николова",
      title: "Художник и педагог",
      bio: "Магистър по живопис от Националната художествена академия. 8 години опит в работата с деца. Практикуващ художник с участия в над 15 изложби.",
      credentials: "НХА, магистър живопис, 8 г. опит",
      personalStatement: "Вярвам, че всяко дете носи в себе си уникален художник. Моята роля е да му дам инструментите да го открие.",
      photoUrl: "/images/trainer-maria.jpg",
    },
  });

  const trainer2 = await prisma.trainer.upsert({
    where: { id: "trainer-2" },
    update: {},
    create: {
      id: "trainer-2",
      name: "Петър Стоянов",
      title: "Скулптор и арт педагог",
      bio: "Магистър по скулптура. Специализира работа с глина и природни материали. Разработва уникални STEAM програми, обединяващи изкуство и наука.",
      credentials: "НХА, магистър скулптура, STEAM сертификат",
      personalStatement: "Глината учи търпение. Когато дете оформя нещо с ръцете си, то учи на концентрация и увереност.",
      photoUrl: "/images/trainer-petar.jpg",
    },
  });

  const trainer3 = await prisma.trainer.upsert({
    where: { id: "trainer-3" },
    update: {},
    create: {
      id: "trainer-3",
      name: "Елена Иванова",
      title: "Художник и илюстратор",
      bio: "Магистър по графичен дизайн и илюстрация. Работи с деца от 6 години. Автор на две детски книги с илюстрации.",
      credentials: "НБУ, магистър илюстрация, 6 г. опит",
      personalStatement: "Рисуването е език. Искам децата да го говорят с увереност и радост.",
      photoUrl: "/images/trainer-elena.jpg",
    },
  });

  // Sessions
  const now = new Date();
  const earlyBirdDeadline = new Date("2026-04-25");

  const sessions = [
    {
      id: "session-1",
      slug: "session-1",
      name: "Творчески лагер — Сесия 1",
      tagline: "Първата седмица на вдъхновение",
      description: `Отваряме лятото с Творчески лагер Сесия 1 — седем дни на откривания, творчество и нови приятелства за деца на 7–10 години.

Сесия 1 е специално разработена за по-малките деца, с акцент върху изграждане на увереност чрез творчество. Децата изследват живопис, работа с глина, природни материали и STEAM проекти в атмосфера на игра и откривания.

Всеки ден е различен: сутринта започва с творчески ателие, следобедите са за природни разходки и STEAM експерименти, а вечерите — за истории край огъня и наблюдение на звездите.

Завършваме с Ден на родителите — момент, в който семействата виждат цялото творчество и чуват историите за седмицата.`,
      status: SessionStatus.ACTIVE,
      flowType: FlowType.B,
      startDate: new Date("2026-05-31"),
      endDate: new Date("2026-06-06"),
      minAge: 7,
      maxAge: 10,
      capacity: 28,
      spotsTaken: 14,
      confirmedThreshold: 16,
      homepageVisible: true,
      displayOrder: 1,
      lastBookingAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      viewersNow: 4,
    },
    {
      id: "session-2",
      slug: "session-2",
      name: "Творчески лагер — Сесия 2",
      tagline: "Изкуство, природа, приятелство",
      description: `Сесия 2 продължава традицията на Творческия лагер с нови теми и проекти за деца на 7–10 години.

Тази сесия поставя специален акцент върху работата с различни материали — от акварел и акрил до рециклирани материали и природни намерки. Децата работят в малки групи, като всяка работилница завършва с общ проект.

Специална изненада тази сесия: atelié под открито небе край езерото, вечерно наблюдение на звездите с телескоп, и workshop по печатарство.`,
      status: SessionStatus.ACTIVE,
      flowType: FlowType.B,
      startDate: new Date("2026-06-07"),
      endDate: new Date("2026-06-13"),
      minAge: 7,
      maxAge: 10,
      capacity: 28,
      spotsTaken: 9,
      confirmedThreshold: 16,
      homepageVisible: true,
      displayOrder: 2,
      lastBookingAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      viewersNow: 2,
    },
    {
      id: "session-3",
      slug: "session-3",
      name: "Творчески лагер — Сесия 3",
      tagline: "За по-смелите изследователи",
      description: `Сесия 3 е за деца на 7–14 години — по-разнообразна по теми и по-дълбока по съдържание.

Разширеният възрастов диапазон носи специална динамика: по-малките деца учат от по-големите, а по-големите развиват умения за лидерство и менторство. Проектите тази сесия включват мащабни инсталации, групови скулптури и дигитално изкуство.

STEAM програмата включва физически експерименти с цвят и светлина, строителни проекти с природни материали и workshop по анимация.`,
      status: SessionStatus.ACTIVE,
      flowType: FlowType.B,
      startDate: new Date("2026-06-14"),
      endDate: new Date("2026-06-20"),
      minAge: 7,
      maxAge: 14,
      capacity: 28,
      spotsTaken: 22,
      confirmedThreshold: 16,
      homepageVisible: true,
      displayOrder: 3,
      lastBookingAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      viewersNow: 7,
    },
    {
      id: "session-4",
      slug: "session-4",
      name: "Творчески лагер — Сесия 4",
      tagline: "Лятото в разгара си",
      description: `Сесия 4 се провежда в разгара на лятото — дълги дни, топли вечери и неизчерпаема творческа енергия за деца на 7–14 години.

Темата на тази сесия е "Стихиите" — вода, огън, земя и въздух като вдъхновение за изкуство. Децата създават инсталации вдъхновени от природата, правят природни бои и строят скулптури от намерени материали.

Специална програма за по-големите деца (11–14 г.): въведение в уличното изкуство и муралистиката — от концепция до изпълнение на голям формат.`,
      status: SessionStatus.ACTIVE,
      flowType: FlowType.B,
      startDate: new Date("2026-06-21"),
      endDate: new Date("2026-06-27"),
      minAge: 7,
      maxAge: 14,
      capacity: 28,
      spotsTaken: 6,
      confirmedThreshold: 16,
      homepageVisible: true,
      displayOrder: 4,
      lastBookingAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      viewersNow: 1,
    },
    {
      id: "session-5",
      slug: "session-5",
      name: "Творчески лагер — Сесия 5",
      tagline: "Финалният акорд на лятото",
      description: `Сесия 5 е последната от Creative Camp поредицата — завършването на лятото с грандиозен финал за деца на 7–14 години.

Тази сесия е особено специална: децата работят по цяла седмица върху един голям колективен проект, който се представя пред родителите в Деня на таланта. Темата се обявява в последния момент — за максимален елемент на изненада.

Очаквайте: открит пленер, вечерно ателие при свещи, workshop по ферментация и натурална боя, и заключителна изложба под небето.`,
      status: SessionStatus.ACTIVE,
      flowType: FlowType.B,
      startDate: new Date("2026-06-28"),
      endDate: new Date("2026-07-04"),
      minAge: 7,
      maxAge: 14,
      capacity: 28,
      spotsTaken: 3,
      confirmedThreshold: 16,
      homepageVisible: true,
      displayOrder: 5,
      lastBookingAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      viewersNow: 3,
    },
    {
      id: "plein-air",
      slug: "plein-air",
      name: "Пленер програма 2026",
      tagline: "Две седмици сред природата за сериозни художници",
      description: `Пленерът е 14-дневна интензивна програма за тийнейджъри на 14–18 години, посветени на изкуството.

Работейки заедно с практикуващи художници в живописния пейзаж около Глемпинг Столът, участниците развиват собствен художествен стил, учат техники на живопис на открито и изграждат творческа идентичност.

Програмата включва: ежедневни пленерни сесии, критически анализ на работи, посещения на галерии и ателиета, финална изложба и портфолио изграждане за кандидати в художествени училища и академии.

Броят на участниците е строго ограничен до 12 за максимален индивидуален подход.`,
      status: SessionStatus.ACTIVE,
      flowType: FlowType.B,
      startDate: new Date("2026-07-05"),
      endDate: new Date("2026-07-18"),
      minAge: 14,
      maxAge: 18,
      capacity: 12,
      spotsTaken: 5,
      confirmedThreshold: 8,
      homepageVisible: true,
      displayOrder: 6,
      lastBookingAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      viewersNow: 2,
    },
  ];

  for (const sessionData of sessions) {
    await prisma.session.upsert({
      where: { id: sessionData.id },
      update: sessionData,
      create: {
        ...sessionData,
        schedule: {
          days: [
            {
              day: 1,
              theme: "Пристигане и откривания",
              morning: "Настаняване в глемпинг тентовете, опознавателни игри",
              afternoon: "Обиколка на ателиетата, избор на материали",
              evening: "Разговор край огъня, представяне на програмата",
            },
            {
              day: 2,
              theme: "Цветът и светлината",
              morning: "Ателие по акварел — небе, вода, природа",
              afternoon: "STEAM: физика на цвета и светлината",
              evening: "Наблюдение на звездите с телескоп",
            },
            {
              day: 3,
              theme: "Земята под ръцете ни",
              morning: "Работа с глина — моделиране на свободна тема",
              afternoon: "Събиране на природни материали, колаж",
              evening: "Кино под открито небе",
            },
            {
              day: 4,
              theme: "Голямото ателие",
              morning: "Свободно творчество — всяко дете избира своя проект",
              afternoon: "Групов проект: мурал на открито",
              evening: "Талантшоу: дечата представят своите проекти",
            },
            {
              day: 5,
              theme: "Природата е ателие",
              morning: "Пленер: рисуване сред природата",
              afternoon: "STEAM: изграждане на конструкции от природни материали",
              evening: "Вечерен поход, разказване на истории",
            },
            {
              day: 6,
              theme: "Финалният проект",
              morning: "Финализиране на личните творби",
              afternoon: "Инсталиране на изложбата",
              evening: "Прощална вечеря, музика и танци",
            },
            {
              day: 7,
              theme: "Денят на родителите — Празникът на таланта",
              morning: "Последна закуска заедно, финални акорди",
              afternoon: "Пристигане на семействата, изложба, представяне",
              evening: "Сбогуване — до следващото лято",
            },
          ],
        },
      },
    });
  }

  // Link trainers to sessions
  for (const sessionId of ["session-1", "session-2", "session-3", "session-4", "session-5"]) {
    for (const trainerId of ["trainer-1", "trainer-2", "trainer-3"]) {
      await prisma.sessionTrainer.upsert({
        where: { sessionId_trainerId: { sessionId, trainerId } },
        update: {},
        create: { sessionId, trainerId },
      });
    }
  }
  for (const trainerId of ["trainer-1", "trainer-3"]) {
    await prisma.sessionTrainer.upsert({
      where: { sessionId_trainerId: { sessionId: "plein-air", trainerId } },
      update: {},
      create: { sessionId: "plein-air", trainerId },
    });
  }

  // Pricing tiers for each session
  const regularSessions = ["session-1", "session-2", "session-3", "session-4", "session-5"];
  for (const sessionId of regularSessions) {
    await prisma.pricingTier.deleteMany({ where: { sessionId } });
    await prisma.pricingTier.createMany({
      data: [
        {
          sessionId,
          tierType: "EARLY_BIRD",
          price: 650,
          label: "Ранна птичка",
          badgeText: "Най-добра цена",
          activeUntil: earlyBirdDeadline,
          isActive: true,
        },
        {
          sessionId,
          tierType: "STANDARD",
          price: 715,
          label: "Стандартна цена",
          isActive: true,
        },
        {
          sessionId,
          tierType: "LAST_MINUTE",
          price: 790,
          label: "Last Minute",
          badgeText: "Цената расте",
          activateWhenSpotsBelow: 8,
          isActive: false,
        },
      ],
    });
  }

  // Plein Air pricing
  await prisma.pricingTier.deleteMany({ where: { sessionId: "plein-air" } });
  await prisma.pricingTier.createMany({
    data: [
      {
        sessionId: "plein-air",
        tierType: "EARLY_BIRD",
        price: 1150,
        label: "Ранна птичка",
        badgeText: "Най-добра цена",
        activeUntil: earlyBirdDeadline,
        isActive: true,
      },
      {
        sessionId: "plein-air",
        tierType: "STANDARD",
        price: 1325,
        label: "Стандартна цена",
        isActive: true,
      },
    ],
  });

  // Testimonials
  await prisma.testimonial.deleteMany({});
  await prisma.testimonial.createMany({
    data: [
      {
        sessionId: "session-1",
        parentName: "Десислава Маринова",
        childAge: 9,
        sessionYear: 2025,
        quote: "Дъщеря ми се върна различна. По-уверена, по-открита, с нова страст към рисуването. Тя буквално броеше дните до следващото лято.",
        rating: 5,
        featured: true,
      },
      {
        sessionId: "session-2",
        parentName: "Иван и Мила Петрови",
        childAge: 8,
        sessionYear: 2025,
        quote: "Организацията е на ниво. Имахме достъп до организаторите по всяко време — това дава невероятно спокойствие. Синът ни се влюби в скулптурата.",
        rating: 5,
        featured: true,
      },
      {
        sessionId: "session-3",
        parentName: "Теодора Колева",
        childAge: 12,
        sessionYear: 2025,
        quote: "Не е просто лагер — това е изживяване. Децата работят с истински художници-педагози. Видях как дъщеря ми се развива пред очите ни за само 7 дни.",
        rating: 5,
        featured: true,
      },
      {
        parentName: "Николай Станчев",
        childAge: 10,
        sessionYear: 2025,
        quote: "Глемпингът е невероятен. Синът ми никога не е спал в палатка преди, но беше толкова уютно, че не искаше да си тръгне. Определено ще се върнем!",
        rating: 5,
        featured: false,
      },
      {
        parentName: "Антония Георгиева",
        childAge: 7,
        sessionYear: 2025,
        quote: "За нас беше първото пъти далеч от родителите. Бях притеснена, но екипът беше изключително внимателен. Дъщеря ми се прибра с нова картина и нови приятели.",
        rating: 5,
        featured: false,
      },
    ],
  });

  console.log("✅ Database seeded successfully!");
  console.log("Admin login: admin@dreaminmypocket.org / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
