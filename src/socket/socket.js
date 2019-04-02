/* eslint-disable prefer-arrow-callback */
const WebSocket = require('ws');
const url = require('url');
const qs = require('query-string');
const jwt = require('jsonwebtoken');
const redis = require('../redis');
const logger = require('../logger');

const { REDIS_PUBSUB_URL, REDIS_PUBSUB_PASSWORD } = process.env;

function noop() {}

const DEFAULT_PING_INTERVAL = 30000;

class SocketServer {
  /**
   * Initialize socket server
   *
   * @param {Object} options - Server options
   */
  constructor({ secret, server, pubsub, pingInterval = DEFAULT_PING_INTERVAL }) {
    logger.info('Initializing socket server');

    if (pubsub) {
      this.pub = redis(REDIS_PUBSUB_URL, {
        password: REDIS_PUBSUB_PASSWORD,
      });

      this.sub = redis(REDIS_PUBSUB_URL, {
        password: REDIS_PUBSUB_PASSWORD,
      });
    }

    // Initialize server
    this.wss = new WebSocket.Server({
      server,
      verifyClient: (info, cb) => {
        const token = qs.parse(url.URL(info.req.url).search).token;

        if (!token) {
          return cb(false);
        }

        jwt.verify(token, secret, (err, decoded) => {
          if (err) {
            cb(false);
          } else {
            info.req.user = decoded;
            cb(true);
          }
        });
      },
    });

    this.wss.on('connection', this.onClientConnected.bind(this));

    // Start keep alive interval
    setInterval(this.ping.bind(this), pingInterval);

    // Initialize users
    this.users = {};

    // Attach redis pubsub message handler
    this.sub.on('message', (channel, message) => {
      logger.info(`Received pubsub message: ${message}`);

      const messageObject = this.parseMessage(message);

      if (messageObject) {
        logger.info('Relaying message to recipients');

        this.relayMessage(messageObject);
      }
    });
  }

  /**
   * Ping sockets to check if they are alive
   */
  ping() {
    this.wss.clients.forEach(socket => {
      if (socket.isAlive === false) {
        logger.info('Cleaning up dead socket: ' + socket.id);

        delete this.users[socket.id];
        return socket.terminate();
      }

      socket.isAlive = false;
      socket.ping(noop);
    });
  }

  /**
   * Client connected handler
   *
   * @param {Object} socket - Socket object
   */
  onClientConnected(socket, req) {
    const { user } = req;

    if (!user || !user.id) {
      return socket.terminate();
    }

    socket.id = user.id;
    socket.isAlive = true;

    socket.on('message', message => {
      this.onMessageReceived(message, socket);
    });

    socket.on('close', () => {
      this.onClientDisconnected(socket);
    });

    socket.on('pong', () => {
      socket.isAlive = true;
    });

    this.users[user.id] = socket;

    logger.info(`New socket connection with id: ${user.id}`);
  }

  /**
   * Client disconnected handler
   *
   * @param {Object} socket - Socket object
   */
  onClientDisconnected(socket) {
    delete this.users[socket.id];

    logger.info(`Socket disconnected: ${socket.id}`);
  }

  /**
   * Message received handler
   *
   * @param {String} message - Message json
   * @param {Object} socket - Socket object
   */
  onMessageReceived(message, socket) {
    logger.info(`Received socket message: ${message}`);

    const messageObject = this.parseMessage(message);

    if (messageObject) {
      if (messageObject.publish) {
        this.publishMessage(messageObject, 'global');
      } else {
        this.relayMessage(messageObject);
      }

      const handler = this.events[messageObject.type];

      if (handler) {
        handler(messageObject, socket, this);
      }
    }
  }

  /**
   * Parse incoming socket message
   *
   * @param {String} message - Socket message
   */
  parseMessage(message) {
    try {
      return JSON.parse(message);
    } catch (err) {
      logger.error(`Unable to parse incoming message: ${message}`);
    }
  }

  /**
   * Publish message using redis pubsub
   *
   * @param {Object} messageObject - Message object
   * @param {String} channel - Channel to publish message to
   */
  publishMessage(messageObject, channel) {
    this.pub.publish(channel, JSON.stringify(messageObject));
  }

  /**
   * Send message to user
   *
   * @param {String|Object} message - The message data
   * @param {Object} socket - The recipient socket
   */
  sendMessage(data, socket) {
    logger.info(`Sending message to user with id: ${socket.id}`);

    if (typeof data === 'object') {
      socket.send(JSON.stringify(data));
    } else {
      socket.send(data);
    }
  }

  /**
   * Send message to a user or list of users
   *
   * @param {Object} messageObject - Message object
   */
  relayMessage(messageObject) {
    const { data, to } = messageObject;

    if (Array.isArray(to)) {
      to.forEach(r => {
        if (this.users[r]) {
          this.sendMessage(data, this.users[r]);
        }
      });
    } else if (this.users[to]) {
      this.sendMessage(data, this.users[to]);
    }
  }
}

module.exports = SocketServer;
