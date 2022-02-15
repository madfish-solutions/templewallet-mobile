import { Before } from '@wdio/cucumber-framework';

Before(async () => {
  console.log('kekeke');
  // await driver.reset().then(() => console.log('kek3'));
  const contexts = await driver.resetApp();
  console.log('contexts', contexts);

  console.log('kekeke2');
});
