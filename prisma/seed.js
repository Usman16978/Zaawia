const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const prompts = [
  { text: 'Aaj jo hua, wo pehli baar nahi tha.', slug: 'aaj-jo-hua', order: 1 },
  { text: 'Mujhe sab se zyada takleef tab hui jab…', slug: 'takleef-tab-hui', order: 2 },
  { text: 'Agar koi mujhe pehle bata deta to…', slug: 'agar-koi-bata-deta', order: 3 },
  { text: 'Jo maine kabhi kisi se nahi kaha.', slug: 'jo-kabhi-nahi-kaha', order: 4 },
  { text: 'Woh ek line jo unse kabhi nahi kahi.', slug: 'ek-line-kabhi-nahi-kahi', order: 5 },
  { text: 'Aaj ka zakhm — aaj kya chubha?', slug: 'aaj-ka-zakhm', order: 6 },
  { text: 'Log samajhte hain hum strong hain…', slug: 'log-samajhte-hain', order: 7 },
  { text: 'Dil ke andar jo hai, woh zubaan pe kabhi nahi aata.', slug: 'dil-ke-andar', order: 8 },
  { text: 'Unse woh baat jo kabhi nahi kahi.', slug: 'unse-woh-baat', order: 9 },
  { text: 'Tum akelay nahi ho.', slug: 'tum-akelay-nahi-ho', order: 10 },
  { text: 'Mere sath bhi aisa hua.', slug: 'mere-sath-bhi', order: 11 },
  { text: 'Aaj ka din — kya hua?', slug: 'aaj-ka-din', order: 12 },
  { text: 'Woh baat jo dil mein reh gayi.', slug: 'woh-baat-dil-mein', order: 13 },
  { text: 'Kabhi kabhi theek hona bhi ek act hota hai.', slug: 'kabhi-kabhi-theek', order: 14 },
  { text: 'Silence peace nahi hoti.', slug: 'silence-peace-nahi', order: 15 },
];

async function main() {
  for (const p of prompts) {
    await prisma.prompt.upsert({
      where: { slug: p.slug },
      update: { text: p.text, order: p.order },
      create: p,
    });
  }
  console.log('Seeded prompts.');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
