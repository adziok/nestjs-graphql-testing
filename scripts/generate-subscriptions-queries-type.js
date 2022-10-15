// eslint-disable-next-line @typescript-eslint/no-var-requires
const { writeFileSync } = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { join } = require('path');
const subscriptionsFolderPath = process.argv[2];

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const subscriptions = require(join(
    process.cwd(),
    `${subscriptionsFolderPath}/index.js`,
  ));
  writeFileSync(
    `${subscriptionsFolderPath}/subscriptions.ts`,
    generateSubscriptionQueriesDefinition(JSON.stringify(subscriptions)),
  );
} catch (e) {
  console.log(e);
}

function generateSubscriptionQueriesDefinition(queiresToExport) {
  return `export const SubscriptionsQueries = ${queiresToExport};`;
}
