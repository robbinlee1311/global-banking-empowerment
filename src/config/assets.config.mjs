import fs from 'fs-extra';

try {
  fs.copySync('./src/assets', './dist/assets');
  fs.copySync(
    './src/assets/img/AdminLTELogo.png',
    './dist/assets/img/GlobalBankingEmpowermentLogo.png'
  );
  fs.copySync(
    './src/assets/img/AdminLTEFullLogo.png',
    './dist/assets/img/GlobalBankingEmpowermentFullLogo.png'
  );
  console.log('Assets copy success!');
} catch (error) {
  console.error(error);
}

