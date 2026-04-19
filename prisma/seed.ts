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

  // Testimonials — реални мнения от родители и ученици
  await prisma.testimonial.deleteMany({});
  await prisma.testimonial.createMany({
    data: [
      // ── Родители ──
      {
        sessionId: "session-1",
        parentName: "Родител на участничка",
        sessionYear: 2024,
        quote: `За поредна година се доверяваме на фондация "Мечта в джоба" и за пореден път сме очаровани! Това е лагерът, който дъщеря ми чака с нетърпение през цялата година и за който разказва на приятели месеци след това.`,
        rating: 5,
        featured: true,
      },
      {
        sessionId: "session-2",
        parentName: "Родител на участничка",
        sessionYear: 2024,
        quote: "Изключителна организация, топла храна и прекрасно отношение от страна на екипа. Ако търсите място, където детето ви да се чувства едновременно в безопасност, свободно и вдъхновено – това е! Препоръчваме с две ръце!",
        rating: 5,
        featured: true,
      },
      {
        sessionId: "session-3",
        parentName: "Родител на участник",
        sessionYear: 2024,
        quote: "Изключително съм признателна за личната грижа и внимание! Сигурна съм, че е била проявена не само към моето дете, но и към всички останали. Дъщеря ми се върна заредена с енергия, положителни емоции и с нови приятелства!",
        rating: 5,
        featured: true,
      },
      {
        parentName: "Родител",
        sessionYear: 2024,
        quote: "Прекрасни сте! Това й била най-хубавата ваканция! Даже, когато отидела в университет, щяла да се връща специално за тези събития.",
        rating: 5,
        featured: true,
      },
      {
        parentName: "Родител",
        sessionYear: 2024,
        quote: "Престоят на глемпинг добавя вълшебно усещане за приключение и истинска връзка с природата, а в творческите ателиета под открито небе децата творят с цялата палитра от техники и материали — графика, живопис, пластични форми и лендарт.",
        rating: 5,
        featured: true,
      },
      {
        parentName: "Родител на участник",
        sessionYear: 2024,
        quote: "Благодаря за грижите и прекрасното отношение към моето дете! Моето дете има желание за по-дълги пленери.",
        rating: 5,
        featured: false,
      },
      // ── Ученици ──
      {
        parentName: "Ученичка от ателието",
        sessionYear: 2024,
        quote: `Фондация "Мечта в джоба" стана част от живота ми много спонтанно. Това е място като никое друго — сплотено и комфортно, място, в което лесно се влюбваш. "Мечта в джоба" е от тези неща, които не очакваш да срещнеш, но когато това се случи, знаеш, че не искаш да си тръгнеш…`,
        rating: 5,
        featured: true,
      },
      {
        parentName: "Ученик от ателието",
        sessionYear: 2024,
        quote: `Ателието ме накара да вярвам дори и в невъзможното. Севи ме научи да рисувам и запали искрата в мен, а ателието я доразпали и ми показа как мога да развихря въображението си и да творя с размах. Ако някой ме попита бих ли го избрал пак — отговорът ми категорично е "да"!`,
        rating: 5,
        featured: true,
      },
      {
        parentName: "Ученичка от ателието",
        sessionYear: 2024,
        quote: `За мен това ателие е много ценно. Тук една прекрасна жена ми помогна не само да се подготвя за бъдещото ми кандидатстване, а и ми беше приятел. За една прекарана година тук успях да придобия умения за три в училище. Севда беше до мен дори и от 280 км разстояние. Тук аз се смях, запознах се с нови хора, плаках от време на време, но най-вече рисувах. Благодаря.`,
        rating: 5,
        featured: true,
      },
      {
        parentName: "Ученичка от ателието",
        sessionYear: 2024,
        quote: `За мен това ателие се превърна в моето "вкъщи" — обичам го, защото е пълно с уют и любов. Можеш да бъдеш точно такъв какъвто си, без да бъдеш осъждан. Севда ми показа, че мога да мина през всичко, независимо от обстоятелствата. Тя повярва в мен и аз успях и постигнах своите цели.`,
        rating: 5,
        featured: true,
      },
      {
        parentName: "Ученичка от ателието",
        sessionYear: 2024,
        quote: `За мен срещата ми с "Мечта в джоба" е безценна — отваря се пространство, което подкрепя, изслушва и насърчава младите хора. Севи ни насърчава за смелост, отговорност, автентичност. "Мечта в джоба" е място с притегателно въздействие — тук се осъществяват полети!`,
        rating: 5,
        featured: true,
      },
      {
        parentName: "Ученичка от ателието",
        sessionYear: 2024,
        quote: `Много се радвам, че попаднах на Севи и нейното ателие. Това е място, винаги изпълнено със смях и позитивност. Севи е много добър учител и се усеща повече като приятел. Това е пространство, в което всеки се чувства чут и разбран — място, където мнението и чувствата ти са важни.`,
        rating: 5,
        featured: true,
      },
      {
        parentName: "Ученик от ателието",
        sessionYear: 2024,
        quote: `Ателието е удобно и приятно място за работа. Приятно е да си заобиколен от хора със същото хоби и страст за изкуството. Преподавателите са много добри — когато направиш грешка, ти обясняват откъде произлиза проблемът. От откакто ходя съм се подобрила много и съм научила нови техники. Като цяло е много яко.`,
        rating: 5,
        featured: false,
      },
      {
        parentName: "Ученик от ателието",
        sessionYear: 2024,
        quote: `Студиото е място, където мога да се концентрирам и да катализирам енергията си. Научавам много — не само от преподавателите, но и от другите ученици. Ходя там само от месец, но вече ми се е превърнало в рутина и винаги очаквам с нетърпение неделята.`,
        rating: 5,
        featured: false,
      },
      {
        parentName: "Ученик от ателието",
        sessionYear: 2024,
        quote: `За мен това място е много хубаво, защото ми позволи да разширя и надградя знанията си. Преди рисуването ми беше хоби на аматьорско ниво, но за няколко месеца станах по-добър отколкото очаквах. Севда ми помогна и с кандидатстването в чужбина, за което не мога да съм по-благодарен.`,
        rating: 5,
        featured: false,
      },
      {
        parentName: "Ученичка от ателието",
        sessionYear: 2024,
        quote: `Пространство, изпълнено с уют и усещане за общност. Място на приемане, където можеш спокойно да споделиш идеите си. Втори дом — място, в което съм свободна да бъда себе си.`,
        rating: 5,
        featured: false,
      },
      {
        parentName: "Ученичка от ателието",
        sessionYear: 2024,
        quote: `Мястото, което ме научи, че това да греша е първата ми стъпка към перфектното. Научи ме, че няма как да не сгрешиш, когато искаш да стигнеш далеч.`,
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
