import fs from 'fs';
import path from 'path';

const FILE_LOCATION = path.join(__dirname, '../file.csv');

export const createCsvFile = (data: string) => fs.writeFileSync(FILE_LOCATION, data, 'utf8');
