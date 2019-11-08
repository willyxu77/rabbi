"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = require("amqplib");
var channel;
const waitPort = require("wait-port");
const url = require("url");
const logger_1 = require("./logger");
var connection;
var connecting = false;
var channelIsConnected = false;
require('dotenv').config();
const AMQP_URL = process.env.AMQP_URL || 'amqp://guest:guest@127.0.0.1:5672/';
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        connection = yield getConnection();
        channel = yield connection.createChannel();
        channelIsConnected = true;
    });
})();
function awaitChannel() {
    return __awaiter(this, void 0, void 0, function* () {
        while (!channelIsConnected) {
            yield wait(100);
        }
        return channel;
    });
}
exports.awaitChannel = awaitChannel;
function getConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        while (connecting) {
            yield wait(100);
        }
        if (!connection) {
            connecting = true;
            let parsed = url.parse(AMQP_URL);
            yield waitPort({
                host: parsed.hostname,
                port: parseInt(parsed.port)
            });
            connection = yield amqplib_1.connect(AMQP_URL);
            connecting = false;
            logger_1.log.info('bunnies.amqp.connected');
        }
        return connection;
    });
}
exports.getConnection = getConnection;
function wait(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}
//# sourceMappingURL=amqp.js.map