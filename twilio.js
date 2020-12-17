
const accountSid = 'ACadffee35fa4c8487eb5bc63413bfee5e';
const authToken ='2eeaf66fd37711fe45e94c75687c1419';
const twilio=require('twilio')
const client = require('twilio')(accountSid, authToken);
 client.verify.services.create({friendlyName: 'LyFinder'})
                      .then(service => console.log(service.sid));