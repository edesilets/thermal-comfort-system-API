'use strict';

let mqtt   = require('mqtt');
let moment = require("moment"); // for time stamp
let Knex   = require("knex")({
  client: "pg",
  connection: {
    host: "localhost",
    user: "pi",
    password: "password",
    database: "test"
  }
});

let Bookshelf = require("bookshelf")(Knex);
let livingroom = Bookshelf.Model.extend({
    tableName: 'livingroom'
});
let coalshed = Bookshelf.Model.extend({
    tableName: 'coalshed'
});
let basement = Bookshelf.Model.extend({
    tableName: 'basement'
});

let client  = mqtt.connect('mqtt://homestatus.ddns.net', {
  protocolId: 'MQIsdp',
  protocolVersion: 3
});

client.on('connect', function () {
  client.subscribe('#');
  console.log('subscribed and now published');
});

client.on('message', function (topic, message) {
  // /home/livingroom/thermostat/temperature/livingroom
  let topicArray = topic.toString().split('/');
  let db = topicArray[1];
  let table = topicArray[2];
  let item = topicArray[3];
  let sensorType = topicArray[4];
  let sensorLocation = topicArray[5];

  let messageString = message.toString().replace(' ', '');
  let floatMessage = parseFloat(messageString);
 console.log(`Message: ${messageString}, Topic: ${topic.toString()}`);

  let data = {
    item: item,
    sensor_type: sensorType,
    sensor_location: sensorLocation,
    data: floatMessage,
    created_at: moment().format(),
    updated_at: moment().format()
  }

//  console.log('\n',data);
  switch (table) {
    case 'livingroom':
        new livingroom(data).save();
      break;
    case 'coalshed':
        new coalshed(data).save();
      break;
    case 'basement':
        new basement(data).save();
      break;
    default:
      console.log("TABLE DOESN'T EXIST YET");
      console.log(data);
  }
});

client.on('error', function(error){
  Knex.destroy();
	console.log(error);
});
