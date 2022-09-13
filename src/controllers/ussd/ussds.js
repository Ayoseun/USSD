
const { v4: uuidv4 } = require('uuid');
const ID = require("nodejs-unique-numeric-id-generator");
const axios = require('axios');
const UssdMenu = require('ussd-builder');
let menu = new UssdMenu()
var gg = '';
var userID = '';
let yourID = '';
var name = "";
var surname = "";
var middleName = "";
let responseData = {};
const sendSMS = require('../sms');
const rangers = require('./rangers');


const ussdStarter = (req, res, next) => {


    // Define menu states
    menu.startState({
        run: () => {
            // use menu.con() to send response without terminating session      
            menu.con('Welcome. Sopa Ereto User Registration:' +
                '\n1. Tour operator' +
                '\n2. Land owner' +
                '\n3. Conservancy'+
                '\n4. Ranger' );
        },
        // next object links to next state based on user input
        next: {


            '1': 'tourOperator',
            '2': 'landOwner',
            '3': 'conservancy',
            '4': 'ranger'
        }
    });




    menu.state('tourOperator', {
        run: () => {
            // use menu.con() to send response without terminating session      
            menu.con('Please enter your National ID number:');

            var id = Number(menu.val);


        },
        next: {

            '*\\d+': 'tourOperator.id'
        }
    });

    menu.state('tourOperator.id', {
        run: async () => {
            var id = "237721480";
            var NID = menu.val
            //console.log(NID);

            // menu.con('Hello $namez Select an account to recieve payments:' +
            // '\n1. Mpesa'+
            // '\n2. Bank Account');
            try {
                await axios({
                    method: "post",
                    url: `http://api.sandbox.youverify.co/v2/api/identity/ke/national-id`,
                    data: {
                        "id":NID,
                        "isSubjectConsent": true
                    },
                    headers: {
                        token: 'hEGOABo0.axF4vmsgeE2RxDPyF2UDIrU1ls0eG5L7jL0G',
                    },
                }).then((response) => {
                    responseData = response.data;
                    //console.log(responseData["data"]);
                    //console.log(response.data["data"]['status']);
                    if (responseData["data"]['status']=='found') {
                        // console.log(response.data['success']);
                        name = responseData["data"]['firstName'];
                        middleName = responseData["data"]['middleName'];
                        surname = responseData["data"]['lastName'];
                        try {
                            axios({
                                method: "post",
                                url: `https://sopa-ereto-diam.herokuapp.com/mcs2/validate-Ranger`,
                                data: { "name": name, "surname": surname, "middleName": middleName },

                            }).then((response) => {
                                let code = response.data["status"]
                                //console.log(response.data);
                                if (code == 200) {
                                    // console.log(response['success']);
                                    let getEncrypt = uuidv4();
                                    yourID = ID.generate(new Date().toJSON());
                                    userID = `${getEncrypt}${yourID}`;
                                    var newName = response.data["data"]["name"]
                                    var newsurname = response.data["data"]["surname"]
                                    var newMiddleName = response.data["data"]["middleName"]

                                    let fullName = `${newName} ${newMiddleName} ${newsurname}`

                                    menu.con('Hello ' + fullName + ' select an account type to recieve payments:' +
                                        '\n1. Mpesa' +
                                        '\n2. Bank Account');
                                } if (code == 404) {
                                    menu.end('Looks like something is wrong!, we could not find your data on the company records.');
                                }
                            })
                        } catch (error) {

                        }




                    }

                });

            } catch (error) {
                if (error.response['data']['success']==false) {
                    console.log(error.response['data'])
                    menu.con('Looks like something is wrong!, we could not find your National ID.'+
                    '\n Enter it again');

                }
            }
        },


        next: {
            // using regex to match user input to next state
            '1': 'Mpesa',
            '2': 'Bank',
            '3': 'Bank'
        }
    });


    //mpesa
    menu.state('Mpesa', {
        run: () => {
            menu.con('Enter your Mpesa Phone Number:');
            var tourMpesaResult = Number(menu.val);

        },
        next: {
            // using regex to match user input to next state
            '*\\d+': 'Result'
        }
    });



    //bank
    menu.state('Bank', {
        run: () => {
            menu.con('Enter your Bank Account Number:');
            var tourMpesaResult = Number(menu.val);

        },
        next: {
            // using regex to match user input to next state
            '*\\d+': 'Result'
        }
    });
    // nesting states
    menu.state('Result', {
        run: async () => {

            try {
                console.log(name);
                await axios({
                    method: "post",
                    url: `https://sopa-ereto-diam.herokuapp.com/mcs2/save-Keeper`,
                    data: { "name": name, "password": surname, },

                }).then((response) => {
                    console.log(response.data['Data']['args']);



                })
            } catch (error) {
                console.log(error);
            }

            menu.end(`Successful Registration! Your user ID is ${yourID}. Welcome to Sopa Ereto.`);
            await sendSMS(yourID);
        }
    });




























    menu.run(req.body, ussdResult => {
        res.send(ussdResult);
    });
};



module.exports = {
    ussdStarter

};