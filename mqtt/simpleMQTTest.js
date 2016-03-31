var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://localhost', {
  protocolId: 'MQIsdp',
  protocolVersion: 3
});

client.on('connect', function () {
  client.subscribe('#');
  console.log('subscribed and now published');
});

	client.on('message', function (topic, message) {
    var inMessage = message.toString();
    var inTopic = topic.toString();
    console.log(`Message: ${inMessage}, Topic: ${inTopic}`);
});

client.on('error', function(error){
	console.log(error);
});
