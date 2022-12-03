const expressJs = require('express');
const expressWs = require('express-ws');

const expressApp = expressJs();

expressApp.use(expressJs.json());

expressWs(expressApp);

expressApp.get('/', (req, res) => {
  res.json({
    status: 1,
    message: 'Working as intended.',
    message_code: 'WORKING_AS_INTENDED',
    data: null
  });
});

expressApp.listen(3004, () => {
  console.log(`Bound to 0.0.0.0:${3004}.`);
});