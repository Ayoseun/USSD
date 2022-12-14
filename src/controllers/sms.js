
const credentials = {
    apiKey: 'a91687fa7fc223b293868d2f52b645f5523d73a4acc89c22e01afcdba8686aac',         // use your sandbox app API key for development in the test environment
    username: 'sandbox',      // use 'sandbox' for development in the test environment
};

const Africastalking = require('africastalking')(credentials);

// Initialize a service e.g. SMS
const sms = Africastalking.SMS

async function sendSMS(id) {
    
    try {
        const result=await sms.send({
             // Set the numbers you want to send to in international format
      //  to: ['+254711XXXYYY', '+254733YYYZZZ'],
          to: '+2349037137077', 
          message: `Welcome to SOPA-ERETO. Please save this number ${id} as this is your ID,you can access and verify your information using this ID by dailing *384*63450*3#`,
          from: 'Sopa-Ereto'
        });
        console.log(result);
      } catch(ex) {
        console.error(ex);
      } 

};

module.exports = sendSMS;