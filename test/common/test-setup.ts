import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { SessionFactory } from './sesion-builder';

export const createTestingApp = async () => {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  });
  const app = (await moduleFixture.compile()).createNestApplication();
  await app.init();
  await app.listen(0);
  const sessionFactory = new SessionFactory(app);

  return { sessionFactory, app };
};
