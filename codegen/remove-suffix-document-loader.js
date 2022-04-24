const { parse } = require('graphql');
const { readFileSync } = require('fs');

module.exports = (docString, config) => {
  const docs = readFileSync(docString, { encoding: 'utf-8' });
  const updatedDocs = docs
    .replaceAll('_query', '')
    .replaceAll('_mutation', '')
    .replaceAll('_subscription', '');
  return parse(updatedDocs);
};
