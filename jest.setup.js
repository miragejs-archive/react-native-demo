// jest.setup.js
global.self = global;
global.window = {};
global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
