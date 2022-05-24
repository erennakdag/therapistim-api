import { PrismaClient, Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { enc, SHA256 } from 'crypto-js';
import axios from 'axios';
const prisma = new PrismaClient();

async function calcLatLong(
  adress: string,
): Promise<{ latitude: number; longitude: number }> {
  const params = {
    access_key: process.env.POSITIONSTACK_ACCESS_KEY,
    query: adress,
  };
  const resp = await axios.get('http://api.positionstack.com/v1/forward', {
    params,
  });
  const data = resp.data.data[0];
  return { latitude: data.latitude, longitude: data.longitude };
}

async function main() {
  for (let i = 0; i < 50; i++) {
    const data = {} as Prisma.TherapistCreateInput;

    const canWriteMedication = Math.random() <= 0.9;
    data.name = (canWriteMedication ? 'Dr. ' : '') + faker.name.findName();
    data.email = faker.internet.email(
      data.name.split(' ')[1],
      data.name.split(' ')[2],
    );
    data.password = SHA256('S.240183a').toString(enc.Hex);
    data.phone = faker.phone.phoneNumber('+49 0### ########');
    data.bio = faker.company.catchPhrase();
    data.adress = [
      'Fürstenwall 75, 40217 Düsseldorf',
      'Lierenfelder Str. 49, 40231 Düsseldorf',
      'Robert-Koch-Straße 14A, 41564 Kaarst',
      'Asselner Hellweg 75, 44319 Dortmund',
    ][Math.floor(Math.random() * 4)];
    data.institutionName = faker.company.companyName();
    data.languages = ['English', 'German'];
    if (Math.random() <= 0.25) {
      data.languages.push('Turkish');
    }
    data.specialties = ['Depression', 'Anxiety', 'PTSD'];
    if (Math.random() <= 0.25) {
      data.specialties.push('Eating Disorders');
    }
    data.canWriteMedication = canWriteMedication;
    data.website = data.email.split('@')[0] + '.com';
    data.acceptsPrivateInsurance = Math.random() <= 0.9;
    const { latitude, longitude } = await calcLatLong(data.adress);
    data.latitude = latitude;
    data.longitude = longitude;

    const result = await prisma.therapist.upsert({
      where: {
        email: data.email,
      },
      create: data,
      update: data,
    });
    console.log(result);
  }
}

// async function main() {
//   await prisma.therapist.deleteMany();
// }

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
