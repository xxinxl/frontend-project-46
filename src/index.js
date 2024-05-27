import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const makeAbsolutePath = (filepath) => path.resolve(process.cwd(), filepath);
const getFileData = (filepath) => fs.readFileSync(filepath, 'utf-8');
const jsonPrepare = (data) => JSON.parse(data);
const findDiff = (data1, data2) => {
  const obj1 = jsonPrepare(data1);
  const obj2 = jsonPrepare(data2);
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const unionKeys = _.union(keys1, keys2).sort();
  console.log(unionKeys);
  const diff = unionKeys.flatMap((key) => {
    if (!keys2.includes(key)) {
      return `- ${key}: ${obj1[key]}`;
    }

    if (!keys1.includes(key)) {
      return `+ ${key}: ${obj2[key]}`;
    }

    if (obj1[key] === obj2[key]) {
      return `  ${key}: ${obj1[key]}`;
    }
    return [
      `- ${key}: ${obj1[key]}`,
      `+ ${key}: ${obj2[key]}`,
    ];
  });
  console.log(diff);
  return `{\n${diff.join('\n')}\n}`;
};

const genDiff = (filepath1, filepath2) => {
  const file1 = makeAbsolutePath(filepath1);
  const file2 = makeAbsolutePath(filepath2);
  const fileData1 = getFileData(file1);
  const fileData2 = getFileData(file2);
  return findDiff(fileData1, fileData2);
};

export default genDiff;