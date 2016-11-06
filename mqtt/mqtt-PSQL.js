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
let status = Bookshelf.Model.extend({
    tableName: 'status'
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
  let mainLocation = topicArray[2];
  let item = topicArray[3];
  let sensorType = topicArray[4];
  let sensorLocation = topicArray[5];

  if (topicArray.length === 6) {
    let messageString = message.toString().replace(' ', '');
    let floatMessage = parseFloat(messageString);
    console.log(`Message: ${messageString}, Topic: ${topic.toString()}`);

    let data = {
      item: item,
      main_location: mainLocation,
      sensor_type: sensorType,
      sensor_location: sensorLocation,
      data: floatMessage,
      created_at: moment().format(),
      updated_at: moment().format()
    }
    console.log(data);

    new status(data).save();
  }
});

client.on('error', function(error){
  Knex.destroy();
	console.log(error);
});
