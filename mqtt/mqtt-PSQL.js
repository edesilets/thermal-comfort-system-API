'use strict';

let mqtt   = require('mqtt');
let moment = require("moment"); // for time stamp
let Knex   = require("knex")({
  client: "pg",
  connection: {
    host: "localhost",
    user: "pi",
    password: "password",
    database: "homestatus"
  }
});

let Bookshelf = require("bookshelf")(Knex);
let Temperature = Bookshelf.Model.extend({
    tableName: 'temperatures'
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
    let dataTopic = false;
    let topicString = topic.toString();
    let messageString = message.toString().replace(' ', '');
    //console.log(`Message: ${messageString}, Topic: ${topicString}`);

    if (topicString === '/home/boiler/temperature/inletpipe' || topicString === '/coalshed/temperature/inletpipe') {
      dataTopic = 'temperature/inletpipe';

    } else if (topicString === '/home/boiler/temperature/outletpipe' || topicString === '/coalshed/temperature/outletpipe') {
      dataTopic = 'temperature/outletpipe';

    } else if (topicString === '/coalshed/temperature/waterjacket') {
      dataTopic = 'temperature/waterjacket';

    } else if (topicString === '/coalshed/pressure' ) {
      dataTopic = 'pressure'
    }
     else {
      dataTopic = 'false';
    }

    // cleanse input
    let floatMessage = parseFloat(messageString);
    let mainTopic = topicString.split('/');

    let data = {
      main_topic: mainTopic[1],
      data_topic: dataTopic,
      data: floatMessage,
      created_at: moment().format(),
      updated_at: moment().format(),
    };
    console.log('\n',data);
    new Temperature(data).save();
});

client.on('error', function(error){
  Knex.destroy();
	console.log(error);
});
