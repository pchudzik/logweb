var fs = require('fs');

var WebSocketServer = require('ws').Server;
var http = require('http');
var express = require('express');
var CBuffer = require('CBuffer');
var _ = require('lodash');
var childProcess = require('child_process');

var configFile = JSON.parse(fs.readFileSync('config.json'));
var inputs = _.chain(configFile.inputs)
  .map(function(entry) {
    if(_.isString(entry.provider)) {
      entry.provider = [{
        cmd: entry.provider
      }];
    }
    return entry;
  })
  .value();

var app = express();

app.get('/api/inputs', function(req, resp) {
  resp.json(_.map(inputs, 'name'));
});
app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);
server.listen(8080);


inputs.forEach(function(input) {
  var wss = new WebSocketServer({server: server, path:'/' + input.name});
  var inputBuffer = new CBuffer(input.buffer || 1000);
  var id = 0;

  var eventWatcher = function(watchEvent) {
    var event = {
      timestamp: watchEvent.timestamp,
      id: id++,
      data: watchEvent.data.toString(),
      sourceName: watchEvent.name
    };
    inputBuffer.push(event);

    wss.clients.forEach(function(client) {
      sendEventToClient(client, [event]);
    });
  };

  input.provider.forEach(function(provider) {
    startNewWatcher(provider, eventWatcher);
  });

  wss.on('connection', function(client) {
    var allEvents = []
    inputBuffer.forEach(function(event) {
      allEvents.push(event);
    });
    sendEventToClient(client, allEvents);
  });
});

function sendEventToClient(client, events) {
  client.send(JSON.stringify(events));
}

function startNewWatcher(provider, dataListener) {
  var cmd = childProcess.exec(provider.cmd);
  cmd.stdout.on('data', function(data) {
    dataListener({
      data: data.toString(),
      timestamp: new Date().getTime(),
      name: provider.name || ''
    });
  });
}
