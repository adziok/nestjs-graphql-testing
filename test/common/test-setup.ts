import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { SessionFactory } from './sesion-builder';

export const createTestingApp = async () => {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  });
  const app = (await moduleFixture.compile()).createNestApplication();
  const sessionFactory = new SessionFactory(app);
  await app.init();

  return { sessionFactory, app };
};
