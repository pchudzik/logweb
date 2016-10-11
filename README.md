# logweb

[![Build Status](https://travis-ci.org/pchudzik/logweb.svg?branch=master)](https://travis-ci.org/pchudzik/logweb)

Backend: [![dependencies Status](https://david-dm.org/pchudzik/logweb/status.svg?path=backend)](https://david-dm.org/pchudzik/logweb?path=backend) [![devDependencies Status](https://david-dm.org/pchudzik/logweb/dev-status.svg?path=backend)](https://david-dm.org/pchudzik/logweb?path=backend&type=dev)

Frontend: [![dependencies Status](https://david-dm.org/pchudzik/logweb/status.svg?path=frontend)](https://david-dm.org/pchudzik/logweb?path=frontend) [![devDependencies Status](https://david-dm.org/pchudzik/logweb/dev-status.svg?path=frontend)](https://david-dm.org/pchudzik/logweb?path=frontend&type=dev)

Tail of process output in your browser. Process will be restarted on exit.

Logweb operates on stdout of process. In order to follow file provide command which will print content of the file to stdout. It's possible to track input from multiple providers. Single provider can follow multiple commands on its own (for example logs from two jboss instances).

For configuration options look at [sample configuration](backend/logweb.js)

## Purpose
Purpose of this project is strictly educational. I wanted to know how:
* child_process module in nodejs works.
* to develop javascript in es6 (natvily in nodejs 6.x)
* work with websockets
* develop application in react + redux + react-router (my first project)
* configure tests for react and redux (jsdom, mocha, enzyme, compiled by babel).
* configure and work with webpack (sass, babel)

## How it works
Backend reads configuration from backend/logweb.js and for each input it will start reading process stdout  and expose this input as websocket.

Frontend will display data from websocket exposed by backend.

## development
Frontend it's react + redux with webpack as module bundler. Frontend is built with command ```npm run dist```. This will compile all the files and put them in /backend/public folder. Development mode can be triggered by ```npm run dev```

Backend is plain nodejs application (node v6). Start it with ```npm start``` (remember to dist frontend first). 
