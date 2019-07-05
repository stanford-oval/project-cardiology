let email = "rickygv@stanford.edu";

const https = require('https');

var options_retrieve = {
  protocol: 'https:',
  hostname: 'almond-cardiology.herokuapp.com',
  path: '/retrieve?', // Query parameters are added later during function call
  method: 'GET',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'X-Requested-With'
  }
};

// TODO: This is test data (will be changed later)
const doctor_email = "rickygv@stanford.edu";
const doctor_password = "test";

options_retrieve.path = '/retrieve?email=' + email + '&doctor_email=' + doctor_email + '&doctor_password=' + doctor_password;

https.get(options_retrieve, res => {
  res.on('data', d => {
    console.log('Successfully retrieved measurements from database');
    console.log(JSON.parse(d.toString()));
    return d;
  });
}).on('error', error => {
  console.error(error);
});
