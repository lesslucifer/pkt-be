/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
(function(global, factory) { /* global define, require, module */

    /* AMD */ if (typeof define === 'function' && define.amd)
        define(["protobufjs/minimal"], factory);

    /* CommonJS */ else if (typeof require === 'function' && typeof module === 'object' && module && module.exports)
        module.exports = factory(require("protobufjs/minimal"));

})(this, function($protobuf) {
    "use strict";

    // Common aliases
    var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
    
    // Exported root namespace
    var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});
    
    $root.GamePlayer = (function() {
    
        /**
         * Properties of a GamePlayer.
         * @exports IGamePlayer
         * @interface IGamePlayer
         * @property {string|null} [id] GamePlayer id
         * @property {string|null} [name] GamePlayer name
         * @property {string|null} [status] GamePlayer status
         * @property {number|null} [stack] GamePlayer stack
         * @property {number|null} [buyIn] GamePlayer buyIn
         * @property {number|null} [buyOut] GamePlayer buyOut
         */
    
        /**
         * Constructs a new GamePlayer.
         * @exports GamePlayer
         * @classdesc Represents a GamePlayer.
         * @implements IGamePlayer
         * @constructor
         * @param {IGamePlayer=} [properties] Properties to set
         */
        function GamePlayer(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * GamePlayer id.
         * @member {string} id
         * @memberof GamePlayer
         * @instance
         */
        GamePlayer.prototype.id = "";
    
        /**
         * GamePlayer name.
         * @member {string} name
         * @memberof GamePlayer
         * @instance
         */
        GamePlayer.prototype.name = "";
    
        /**
         * GamePlayer status.
         * @member {string} status
         * @memberof GamePlayer
         * @instance
         */
        GamePlayer.prototype.status = "";
    
        /**
         * GamePlayer stack.
         * @member {number} stack
         * @memberof GamePlayer
         * @instance
         */
        GamePlayer.prototype.stack = 0;
    
        /**
         * GamePlayer buyIn.
         * @member {number} buyIn
         * @memberof GamePlayer
         * @instance
         */
        GamePlayer.prototype.buyIn = 0;
    
        /**
         * GamePlayer buyOut.
         * @member {number} buyOut
         * @memberof GamePlayer
         * @instance
         */
        GamePlayer.prototype.buyOut = 0;
    
        /**
         * Creates a new GamePlayer instance using the specified properties.
         * @function create
         * @memberof GamePlayer
         * @static
         * @param {IGamePlayer=} [properties] Properties to set
         * @returns {GamePlayer} GamePlayer instance
         */
        GamePlayer.create = function create(properties) {
            return new GamePlayer(properties);
        };
    
        /**
         * Encodes the specified GamePlayer message. Does not implicitly {@link GamePlayer.verify|verify} messages.
         * @function encode
         * @memberof GamePlayer
         * @static
         * @param {IGamePlayer} message GamePlayer message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GamePlayer.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.status);
            if (message.stack != null && Object.hasOwnProperty.call(message, "stack"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.stack);
            if (message.buyIn != null && Object.hasOwnProperty.call(message, "buyIn"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.buyIn);
            if (message.buyOut != null && Object.hasOwnProperty.call(message, "buyOut"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.buyOut);
            return writer;
        };
    
        /**
         * Encodes the specified GamePlayer message, length delimited. Does not implicitly {@link GamePlayer.verify|verify} messages.
         * @function encodeDelimited
         * @memberof GamePlayer
         * @static
         * @param {IGamePlayer} message GamePlayer message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GamePlayer.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a GamePlayer message from the specified reader or buffer.
         * @function decode
         * @memberof GamePlayer
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {GamePlayer} GamePlayer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GamePlayer.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GamePlayer();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.string();
                        break;
                    }
                case 2: {
                        message.name = reader.string();
                        break;
                    }
                case 3: {
                        message.status = reader.string();
                        break;
                    }
                case 4: {
                        message.stack = reader.int32();
                        break;
                    }
                case 5: {
                        message.buyIn = reader.int32();
                        break;
                    }
                case 6: {
                        message.buyOut = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a GamePlayer message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof GamePlayer
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {GamePlayer} GamePlayer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GamePlayer.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a GamePlayer message.
         * @function verify
         * @memberof GamePlayer
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GamePlayer.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.status != null && message.hasOwnProperty("status"))
                if (!$util.isString(message.status))
                    return "status: string expected";
            if (message.stack != null && message.hasOwnProperty("stack"))
                if (!$util.isInteger(message.stack))
                    return "stack: integer expected";
            if (message.buyIn != null && message.hasOwnProperty("buyIn"))
                if (!$util.isInteger(message.buyIn))
                    return "buyIn: integer expected";
            if (message.buyOut != null && message.hasOwnProperty("buyOut"))
                if (!$util.isInteger(message.buyOut))
                    return "buyOut: integer expected";
            return null;
        };
    
        /**
         * Creates a GamePlayer message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof GamePlayer
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {GamePlayer} GamePlayer
         */
        GamePlayer.fromObject = function fromObject(object) {
            if (object instanceof $root.GamePlayer)
                return object;
            var message = new $root.GamePlayer();
            if (object.id != null)
                message.id = String(object.id);
            if (object.name != null)
                message.name = String(object.name);
            if (object.status != null)
                message.status = String(object.status);
            if (object.stack != null)
                message.stack = object.stack | 0;
            if (object.buyIn != null)
                message.buyIn = object.buyIn | 0;
            if (object.buyOut != null)
                message.buyOut = object.buyOut | 0;
            return message;
        };
    
        /**
         * Creates a plain object from a GamePlayer message. Also converts values to other types if specified.
         * @function toObject
         * @memberof GamePlayer
         * @static
         * @param {GamePlayer} message GamePlayer
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GamePlayer.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.id = "";
                object.name = "";
                object.status = "";
                object.stack = 0;
                object.buyIn = 0;
                object.buyOut = 0;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.status != null && message.hasOwnProperty("status"))
                object.status = message.status;
            if (message.stack != null && message.hasOwnProperty("stack"))
                object.stack = message.stack;
            if (message.buyIn != null && message.hasOwnProperty("buyIn"))
                object.buyIn = message.buyIn;
            if (message.buyOut != null && message.hasOwnProperty("buyOut"))
                object.buyOut = message.buyOut;
            return object;
        };
    
        /**
         * Converts this GamePlayer to JSON.
         * @function toJSON
         * @memberof GamePlayer
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GamePlayer.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        /**
         * Gets the default type url for GamePlayer
         * @function getTypeUrl
         * @memberof GamePlayer
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GamePlayer.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/GamePlayer";
        };
    
        return GamePlayer;
    })();
    
    $root.GameSettings = (function() {
    
        /**
         * Properties of a GameSettings.
         * @exports IGameSettings
         * @interface IGameSettings
         * @property {number|null} [smallBlind] GameSettings smallBlind
         * @property {number|null} [bigBlind] GameSettings bigBlind
         * @property {number|null} [showDownTime] GameSettings showDownTime
         * @property {number|null} [actionTime] GameSettings actionTime
         * @property {number|null} [gameSpeed] GameSettings gameSpeed
         */
    
        /**
         * Constructs a new GameSettings.
         * @exports GameSettings
         * @classdesc Represents a GameSettings.
         * @implements IGameSettings
         * @constructor
         * @param {IGameSettings=} [properties] Properties to set
         */
        function GameSettings(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * GameSettings smallBlind.
         * @member {number} smallBlind
         * @memberof GameSettings
         * @instance
         */
        GameSettings.prototype.smallBlind = 0;
    
        /**
         * GameSettings bigBlind.
         * @member {number} bigBlind
         * @memberof GameSettings
         * @instance
         */
        GameSettings.prototype.bigBlind = 0;
    
        /**
         * GameSettings showDownTime.
         * @member {number} showDownTime
         * @memberof GameSettings
         * @instance
         */
        GameSettings.prototype.showDownTime = 0;
    
        /**
         * GameSettings actionTime.
         * @member {number} actionTime
         * @memberof GameSettings
         * @instance
         */
        GameSettings.prototype.actionTime = 0;
    
        /**
         * GameSettings gameSpeed.
         * @member {number} gameSpeed
         * @memberof GameSettings
         * @instance
         */
        GameSettings.prototype.gameSpeed = 0;
    
        /**
         * Creates a new GameSettings instance using the specified properties.
         * @function create
         * @memberof GameSettings
         * @static
         * @param {IGameSettings=} [properties] Properties to set
         * @returns {GameSettings} GameSettings instance
         */
        GameSettings.create = function create(properties) {
            return new GameSettings(properties);
        };
    
        /**
         * Encodes the specified GameSettings message. Does not implicitly {@link GameSettings.verify|verify} messages.
         * @function encode
         * @memberof GameSettings
         * @static
         * @param {IGameSettings} message GameSettings message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameSettings.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.smallBlind != null && Object.hasOwnProperty.call(message, "smallBlind"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.smallBlind);
            if (message.bigBlind != null && Object.hasOwnProperty.call(message, "bigBlind"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.bigBlind);
            if (message.showDownTime != null && Object.hasOwnProperty.call(message, "showDownTime"))
                writer.uint32(/* id 3, wireType 5 =*/29).float(message.showDownTime);
            if (message.actionTime != null && Object.hasOwnProperty.call(message, "actionTime"))
                writer.uint32(/* id 4, wireType 5 =*/37).float(message.actionTime);
            if (message.gameSpeed != null && Object.hasOwnProperty.call(message, "gameSpeed"))
                writer.uint32(/* id 5, wireType 5 =*/45).float(message.gameSpeed);
            return writer;
        };
    
        /**
         * Encodes the specified GameSettings message, length delimited. Does not implicitly {@link GameSettings.verify|verify} messages.
         * @function encodeDelimited
         * @memberof GameSettings
         * @static
         * @param {IGameSettings} message GameSettings message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameSettings.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a GameSettings message from the specified reader or buffer.
         * @function decode
         * @memberof GameSettings
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {GameSettings} GameSettings
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameSettings.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GameSettings();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.smallBlind = reader.int32();
                        break;
                    }
                case 2: {
                        message.bigBlind = reader.int32();
                        break;
                    }
                case 3: {
                        message.showDownTime = reader.float();
                        break;
                    }
                case 4: {
                        message.actionTime = reader.float();
                        break;
                    }
                case 5: {
                        message.gameSpeed = reader.float();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a GameSettings message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof GameSettings
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {GameSettings} GameSettings
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameSettings.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a GameSettings message.
         * @function verify
         * @memberof GameSettings
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GameSettings.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.smallBlind != null && message.hasOwnProperty("smallBlind"))
                if (!$util.isInteger(message.smallBlind))
                    return "smallBlind: integer expected";
            if (message.bigBlind != null && message.hasOwnProperty("bigBlind"))
                if (!$util.isInteger(message.bigBlind))
                    return "bigBlind: integer expected";
            if (message.showDownTime != null && message.hasOwnProperty("showDownTime"))
                if (typeof message.showDownTime !== "number")
                    return "showDownTime: number expected";
            if (message.actionTime != null && message.hasOwnProperty("actionTime"))
                if (typeof message.actionTime !== "number")
                    return "actionTime: number expected";
            if (message.gameSpeed != null && message.hasOwnProperty("gameSpeed"))
                if (typeof message.gameSpeed !== "number")
                    return "gameSpeed: number expected";
            return null;
        };
    
        /**
         * Creates a GameSettings message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof GameSettings
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {GameSettings} GameSettings
         */
        GameSettings.fromObject = function fromObject(object) {
            if (object instanceof $root.GameSettings)
                return object;
            var message = new $root.GameSettings();
            if (object.smallBlind != null)
                message.smallBlind = object.smallBlind | 0;
            if (object.bigBlind != null)
                message.bigBlind = object.bigBlind | 0;
            if (object.showDownTime != null)
                message.showDownTime = Number(object.showDownTime);
            if (object.actionTime != null)
                message.actionTime = Number(object.actionTime);
            if (object.gameSpeed != null)
                message.gameSpeed = Number(object.gameSpeed);
            return message;
        };
    
        /**
         * Creates a plain object from a GameSettings message. Also converts values to other types if specified.
         * @function toObject
         * @memberof GameSettings
         * @static
         * @param {GameSettings} message GameSettings
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GameSettings.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.smallBlind = 0;
                object.bigBlind = 0;
                object.showDownTime = 0;
                object.actionTime = 0;
                object.gameSpeed = 0;
            }
            if (message.smallBlind != null && message.hasOwnProperty("smallBlind"))
                object.smallBlind = message.smallBlind;
            if (message.bigBlind != null && message.hasOwnProperty("bigBlind"))
                object.bigBlind = message.bigBlind;
            if (message.showDownTime != null && message.hasOwnProperty("showDownTime"))
                object.showDownTime = options.json && !isFinite(message.showDownTime) ? String(message.showDownTime) : message.showDownTime;
            if (message.actionTime != null && message.hasOwnProperty("actionTime"))
                object.actionTime = options.json && !isFinite(message.actionTime) ? String(message.actionTime) : message.actionTime;
            if (message.gameSpeed != null && message.hasOwnProperty("gameSpeed"))
                object.gameSpeed = options.json && !isFinite(message.gameSpeed) ? String(message.gameSpeed) : message.gameSpeed;
            return object;
        };
    
        /**
         * Converts this GameSettings to JSON.
         * @function toJSON
         * @memberof GameSettings
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GameSettings.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        /**
         * Gets the default type url for GameSettings
         * @function getTypeUrl
         * @memberof GameSettings
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GameSettings.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/GameSettings";
        };
    
        return GameSettings;
    })();
    
    $root.StackRequest = (function() {
    
        /**
         * Properties of a StackRequest.
         * @exports IStackRequest
         * @interface IStackRequest
         * @property {string|null} [type] StackRequest type
         * @property {number|null} [amount] StackRequest amount
         */
    
        /**
         * Constructs a new StackRequest.
         * @exports StackRequest
         * @classdesc Represents a StackRequest.
         * @implements IStackRequest
         * @constructor
         * @param {IStackRequest=} [properties] Properties to set
         */
        function StackRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * StackRequest type.
         * @member {string} type
         * @memberof StackRequest
         * @instance
         */
        StackRequest.prototype.type = "";
    
        /**
         * StackRequest amount.
         * @member {number} amount
         * @memberof StackRequest
         * @instance
         */
        StackRequest.prototype.amount = 0;
    
        /**
         * Creates a new StackRequest instance using the specified properties.
         * @function create
         * @memberof StackRequest
         * @static
         * @param {IStackRequest=} [properties] Properties to set
         * @returns {StackRequest} StackRequest instance
         */
        StackRequest.create = function create(properties) {
            return new StackRequest(properties);
        };
    
        /**
         * Encodes the specified StackRequest message. Does not implicitly {@link StackRequest.verify|verify} messages.
         * @function encode
         * @memberof StackRequest
         * @static
         * @param {IStackRequest} message StackRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StackRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.type);
            if (message.amount != null && Object.hasOwnProperty.call(message, "amount"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.amount);
            return writer;
        };
    
        /**
         * Encodes the specified StackRequest message, length delimited. Does not implicitly {@link StackRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof StackRequest
         * @static
         * @param {IStackRequest} message StackRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StackRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a StackRequest message from the specified reader or buffer.
         * @function decode
         * @memberof StackRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {StackRequest} StackRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StackRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.StackRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.type = reader.string();
                        break;
                    }
                case 2: {
                        message.amount = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a StackRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof StackRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {StackRequest} StackRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StackRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a StackRequest message.
         * @function verify
         * @memberof StackRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        StackRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.type != null && message.hasOwnProperty("type"))
                if (!$util.isString(message.type))
                    return "type: string expected";
            if (message.amount != null && message.hasOwnProperty("amount"))
                if (!$util.isInteger(message.amount))
                    return "amount: integer expected";
            return null;
        };
    
        /**
         * Creates a StackRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof StackRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {StackRequest} StackRequest
         */
        StackRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.StackRequest)
                return object;
            var message = new $root.StackRequest();
            if (object.type != null)
                message.type = String(object.type);
            if (object.amount != null)
                message.amount = object.amount | 0;
            return message;
        };
    
        /**
         * Creates a plain object from a StackRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof StackRequest
         * @static
         * @param {StackRequest} message StackRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        StackRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.type = "";
                object.amount = 0;
            }
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            if (message.amount != null && message.hasOwnProperty("amount"))
                object.amount = message.amount;
            return object;
        };
    
        /**
         * Converts this StackRequest to JSON.
         * @function toJSON
         * @memberof StackRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        StackRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        /**
         * Gets the default type url for StackRequest
         * @function getTypeUrl
         * @memberof StackRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        StackRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/StackRequest";
        };
    
        return StackRequest;
    })();
    
    $root.GameRequests = (function() {
    
        /**
         * Properties of a GameRequests.
         * @exports IGameRequests
         * @interface IGameRequests
         * @property {Object.<string,number>|null} [seatIn] GameRequests seatIn
         * @property {Array.<number>|null} [seatOut] GameRequests seatOut
         * @property {boolean|null} [stopGame] GameRequests stopGame
         * @property {IGameSettings|null} [settings] GameRequests settings
         * @property {Object.<string,IStackRequest>|null} [stack] GameRequests stack
         */
    
        /**
         * Constructs a new GameRequests.
         * @exports GameRequests
         * @classdesc Represents a GameRequests.
         * @implements IGameRequests
         * @constructor
         * @param {IGameRequests=} [properties] Properties to set
         */
        function GameRequests(properties) {
            this.seatIn = {};
            this.seatOut = [];
            this.stack = {};
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * GameRequests seatIn.
         * @member {Object.<string,number>} seatIn
         * @memberof GameRequests
         * @instance
         */
        GameRequests.prototype.seatIn = $util.emptyObject;
    
        /**
         * GameRequests seatOut.
         * @member {Array.<number>} seatOut
         * @memberof GameRequests
         * @instance
         */
        GameRequests.prototype.seatOut = $util.emptyArray;
    
        /**
         * GameRequests stopGame.
         * @member {boolean} stopGame
         * @memberof GameRequests
         * @instance
         */
        GameRequests.prototype.stopGame = false;
    
        /**
         * GameRequests settings.
         * @member {IGameSettings|null|undefined} settings
         * @memberof GameRequests
         * @instance
         */
        GameRequests.prototype.settings = null;
    
        /**
         * GameRequests stack.
         * @member {Object.<string,IStackRequest>} stack
         * @memberof GameRequests
         * @instance
         */
        GameRequests.prototype.stack = $util.emptyObject;
    
        /**
         * Creates a new GameRequests instance using the specified properties.
         * @function create
         * @memberof GameRequests
         * @static
         * @param {IGameRequests=} [properties] Properties to set
         * @returns {GameRequests} GameRequests instance
         */
        GameRequests.create = function create(properties) {
            return new GameRequests(properties);
        };
    
        /**
         * Encodes the specified GameRequests message. Does not implicitly {@link GameRequests.verify|verify} messages.
         * @function encode
         * @memberof GameRequests
         * @static
         * @param {IGameRequests} message GameRequests message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameRequests.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.seatIn != null && Object.hasOwnProperty.call(message, "seatIn"))
                for (var keys = Object.keys(message.seatIn), i = 0; i < keys.length; ++i)
                    writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 0 =*/16).int32(message.seatIn[keys[i]]).ldelim();
            if (message.seatOut != null && message.seatOut.length) {
                writer.uint32(/* id 2, wireType 2 =*/18).fork();
                for (var i = 0; i < message.seatOut.length; ++i)
                    writer.int32(message.seatOut[i]);
                writer.ldelim();
            }
            if (message.stopGame != null && Object.hasOwnProperty.call(message, "stopGame"))
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.stopGame);
            if (message.settings != null && Object.hasOwnProperty.call(message, "settings"))
                $root.GameSettings.encode(message.settings, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.stack != null && Object.hasOwnProperty.call(message, "stack"))
                for (var keys = Object.keys(message.stack), i = 0; i < keys.length; ++i) {
                    writer.uint32(/* id 5, wireType 2 =*/42).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                    $root.StackRequest.encode(message.stack[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                }
            return writer;
        };
    
        /**
         * Encodes the specified GameRequests message, length delimited. Does not implicitly {@link GameRequests.verify|verify} messages.
         * @function encodeDelimited
         * @memberof GameRequests
         * @static
         * @param {IGameRequests} message GameRequests message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameRequests.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a GameRequests message from the specified reader or buffer.
         * @function decode
         * @memberof GameRequests
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {GameRequests} GameRequests
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameRequests.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GameRequests(), key, value;
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (message.seatIn === $util.emptyObject)
                            message.seatIn = {};
                        var end2 = reader.uint32() + reader.pos;
                        key = "";
                        value = 0;
                        while (reader.pos < end2) {
                            var tag2 = reader.uint32();
                            switch (tag2 >>> 3) {
                            case 1:
                                key = reader.string();
                                break;
                            case 2:
                                value = reader.int32();
                                break;
                            default:
                                reader.skipType(tag2 & 7);
                                break;
                            }
                        }
                        message.seatIn[key] = value;
                        break;
                    }
                case 2: {
                        if (!(message.seatOut && message.seatOut.length))
                            message.seatOut = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.seatOut.push(reader.int32());
                        } else
                            message.seatOut.push(reader.int32());
                        break;
                    }
                case 3: {
                        message.stopGame = reader.bool();
                        break;
                    }
                case 4: {
                        message.settings = $root.GameSettings.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        if (message.stack === $util.emptyObject)
                            message.stack = {};
                        var end2 = reader.uint32() + reader.pos;
                        key = "";
                        value = null;
                        while (reader.pos < end2) {
                            var tag2 = reader.uint32();
                            switch (tag2 >>> 3) {
                            case 1:
                                key = reader.string();
                                break;
                            case 2:
                                value = $root.StackRequest.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag2 & 7);
                                break;
                            }
                        }
                        message.stack[key] = value;
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a GameRequests message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof GameRequests
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {GameRequests} GameRequests
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameRequests.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a GameRequests message.
         * @function verify
         * @memberof GameRequests
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GameRequests.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.seatIn != null && message.hasOwnProperty("seatIn")) {
                if (!$util.isObject(message.seatIn))
                    return "seatIn: object expected";
                var key = Object.keys(message.seatIn);
                for (var i = 0; i < key.length; ++i)
                    if (!$util.isInteger(message.seatIn[key[i]]))
                        return "seatIn: integer{k:string} expected";
            }
            if (message.seatOut != null && message.hasOwnProperty("seatOut")) {
                if (!Array.isArray(message.seatOut))
                    return "seatOut: array expected";
                for (var i = 0; i < message.seatOut.length; ++i)
                    if (!$util.isInteger(message.seatOut[i]))
                        return "seatOut: integer[] expected";
            }
            if (message.stopGame != null && message.hasOwnProperty("stopGame"))
                if (typeof message.stopGame !== "boolean")
                    return "stopGame: boolean expected";
            if (message.settings != null && message.hasOwnProperty("settings")) {
                var error = $root.GameSettings.verify(message.settings);
                if (error)
                    return "settings." + error;
            }
            if (message.stack != null && message.hasOwnProperty("stack")) {
                if (!$util.isObject(message.stack))
                    return "stack: object expected";
                var key = Object.keys(message.stack);
                for (var i = 0; i < key.length; ++i) {
                    var error = $root.StackRequest.verify(message.stack[key[i]]);
                    if (error)
                        return "stack." + error;
                }
            }
            return null;
        };
    
        /**
         * Creates a GameRequests message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof GameRequests
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {GameRequests} GameRequests
         */
        GameRequests.fromObject = function fromObject(object) {
            if (object instanceof $root.GameRequests)
                return object;
            var message = new $root.GameRequests();
            if (object.seatIn) {
                if (typeof object.seatIn !== "object")
                    throw TypeError(".GameRequests.seatIn: object expected");
                message.seatIn = {};
                for (var keys = Object.keys(object.seatIn), i = 0; i < keys.length; ++i)
                    message.seatIn[keys[i]] = object.seatIn[keys[i]] | 0;
            }
            if (object.seatOut) {
                if (!Array.isArray(object.seatOut))
                    throw TypeError(".GameRequests.seatOut: array expected");
                message.seatOut = [];
                for (var i = 0; i < object.seatOut.length; ++i)
                    message.seatOut[i] = object.seatOut[i] | 0;
            }
            if (object.stopGame != null)
                message.stopGame = Boolean(object.stopGame);
            if (object.settings != null) {
                if (typeof object.settings !== "object")
                    throw TypeError(".GameRequests.settings: object expected");
                message.settings = $root.GameSettings.fromObject(object.settings);
            }
            if (object.stack) {
                if (typeof object.stack !== "object")
                    throw TypeError(".GameRequests.stack: object expected");
                message.stack = {};
                for (var keys = Object.keys(object.stack), i = 0; i < keys.length; ++i) {
                    if (typeof object.stack[keys[i]] !== "object")
                        throw TypeError(".GameRequests.stack: object expected");
                    message.stack[keys[i]] = $root.StackRequest.fromObject(object.stack[keys[i]]);
                }
            }
            return message;
        };
    
        /**
         * Creates a plain object from a GameRequests message. Also converts values to other types if specified.
         * @function toObject
         * @memberof GameRequests
         * @static
         * @param {GameRequests} message GameRequests
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GameRequests.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.seatOut = [];
            if (options.objects || options.defaults) {
                object.seatIn = {};
                object.stack = {};
            }
            if (options.defaults) {
                object.stopGame = false;
                object.settings = null;
            }
            var keys2;
            if (message.seatIn && (keys2 = Object.keys(message.seatIn)).length) {
                object.seatIn = {};
                for (var j = 0; j < keys2.length; ++j)
                    object.seatIn[keys2[j]] = message.seatIn[keys2[j]];
            }
            if (message.seatOut && message.seatOut.length) {
                object.seatOut = [];
                for (var j = 0; j < message.seatOut.length; ++j)
                    object.seatOut[j] = message.seatOut[j];
            }
            if (message.stopGame != null && message.hasOwnProperty("stopGame"))
                object.stopGame = message.stopGame;
            if (message.settings != null && message.hasOwnProperty("settings"))
                object.settings = $root.GameSettings.toObject(message.settings, options);
            if (message.stack && (keys2 = Object.keys(message.stack)).length) {
                object.stack = {};
                for (var j = 0; j < keys2.length; ++j)
                    object.stack[keys2[j]] = $root.StackRequest.toObject(message.stack[keys2[j]], options);
            }
            return object;
        };
    
        /**
         * Converts this GameRequests to JSON.
         * @function toJSON
         * @memberof GameRequests
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GameRequests.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        /**
         * Gets the default type url for GameRequests
         * @function getTypeUrl
         * @memberof GameRequests
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GameRequests.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/GameRequests";
        };
    
        return GameRequests;
    })();
    
    $root.Card = (function() {
    
        /**
         * Properties of a Card.
         * @exports ICard
         * @interface ICard
         * @property {number|null} [rank] Card rank
         * @property {string|null} [suit] Card suit
         */
    
        /**
         * Constructs a new Card.
         * @exports Card
         * @classdesc Represents a Card.
         * @implements ICard
         * @constructor
         * @param {ICard=} [properties] Properties to set
         */
        function Card(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * Card rank.
         * @member {number} rank
         * @memberof Card
         * @instance
         */
        Card.prototype.rank = 0;
    
        /**
         * Card suit.
         * @member {string} suit
         * @memberof Card
         * @instance
         */
        Card.prototype.suit = "";
    
        /**
         * Creates a new Card instance using the specified properties.
         * @function create
         * @memberof Card
         * @static
         * @param {ICard=} [properties] Properties to set
         * @returns {Card} Card instance
         */
        Card.create = function create(properties) {
            return new Card(properties);
        };
    
        /**
         * Encodes the specified Card message. Does not implicitly {@link Card.verify|verify} messages.
         * @function encode
         * @memberof Card
         * @static
         * @param {ICard} message Card message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Card.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.rank != null && Object.hasOwnProperty.call(message, "rank"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.rank);
            if (message.suit != null && Object.hasOwnProperty.call(message, "suit"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.suit);
            return writer;
        };
    
        /**
         * Encodes the specified Card message, length delimited. Does not implicitly {@link Card.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Card
         * @static
         * @param {ICard} message Card message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Card.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a Card message from the specified reader or buffer.
         * @function decode
         * @memberof Card
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Card} Card
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Card.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Card();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.rank = reader.int32();
                        break;
                    }
                case 2: {
                        message.suit = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a Card message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Card
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Card} Card
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Card.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a Card message.
         * @function verify
         * @memberof Card
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Card.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.rank != null && message.hasOwnProperty("rank"))
                if (!$util.isInteger(message.rank))
                    return "rank: integer expected";
            if (message.suit != null && message.hasOwnProperty("suit"))
                if (!$util.isString(message.suit))
                    return "suit: string expected";
            return null;
        };
    
        /**
         * Creates a Card message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Card
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Card} Card
         */
        Card.fromObject = function fromObject(object) {
            if (object instanceof $root.Card)
                return object;
            var message = new $root.Card();
            if (object.rank != null)
                message.rank = object.rank | 0;
            if (object.suit != null)
                message.suit = String(object.suit);
            return message;
        };
    
        /**
         * Creates a plain object from a Card message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Card
         * @static
         * @param {Card} message Card
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Card.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.rank = 0;
                object.suit = "";
            }
            if (message.rank != null && message.hasOwnProperty("rank"))
                object.rank = message.rank;
            if (message.suit != null && message.hasOwnProperty("suit"))
                object.suit = message.suit;
            return object;
        };
    
        /**
         * Converts this Card to JSON.
         * @function toJSON
         * @memberof Card
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Card.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        /**
         * Gets the default type url for Card
         * @function getTypeUrl
         * @memberof Card
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Card.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/Card";
        };
    
        return Card;
    })();
    
    $root.PokerHandResult = (function() {
    
        /**
         * Properties of a PokerHandResult.
         * @exports IPokerHandResult
         * @interface IPokerHandResult
         * @property {number|null} [rank] PokerHandResult rank
         * @property {Array.<number>|null} [holeCardIndexes] PokerHandResult holeCardIndexes
         * @property {Array.<number>|null} [values] PokerHandResult values
         * @property {Array.<number>|null} [communityCardsIndexes] PokerHandResult communityCardsIndexes
         */
    
        /**
         * Constructs a new PokerHandResult.
         * @exports PokerHandResult
         * @classdesc Represents a PokerHandResult.
         * @implements IPokerHandResult
         * @constructor
         * @param {IPokerHandResult=} [properties] Properties to set
         */
        function PokerHandResult(properties) {
            this.holeCardIndexes = [];
            this.values = [];
            this.communityCardsIndexes = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * PokerHandResult rank.
         * @member {number} rank
         * @memberof PokerHandResult
         * @instance
         */
        PokerHandResult.prototype.rank = 0;
    
        /**
         * PokerHandResult holeCardIndexes.
         * @member {Array.<number>} holeCardIndexes
         * @memberof PokerHandResult
         * @instance
         */
        PokerHandResult.prototype.holeCardIndexes = $util.emptyArray;
    
        /**
         * PokerHandResult values.
         * @member {Array.<number>} values
         * @memberof PokerHandResult
         * @instance
         */
        PokerHandResult.prototype.values = $util.emptyArray;
    
        /**
         * PokerHandResult communityCardsIndexes.
         * @member {Array.<number>} communityCardsIndexes
         * @memberof PokerHandResult
         * @instance
         */
        PokerHandResult.prototype.communityCardsIndexes = $util.emptyArray;
    
        /**
         * Creates a new PokerHandResult instance using the specified properties.
         * @function create
         * @memberof PokerHandResult
         * @static
         * @param {IPokerHandResult=} [properties] Properties to set
         * @returns {PokerHandResult} PokerHandResult instance
         */
        PokerHandResult.create = function create(properties) {
            return new PokerHandResult(properties);
        };
    
        /**
         * Encodes the specified PokerHandResult message. Does not implicitly {@link PokerHandResult.verify|verify} messages.
         * @function encode
         * @memberof PokerHandResult
         * @static
         * @param {IPokerHandResult} message PokerHandResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PokerHandResult.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.rank != null && Object.hasOwnProperty.call(message, "rank"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.rank);
            if (message.holeCardIndexes != null && message.holeCardIndexes.length) {
                writer.uint32(/* id 2, wireType 2 =*/18).fork();
                for (var i = 0; i < message.holeCardIndexes.length; ++i)
                    writer.int32(message.holeCardIndexes[i]);
                writer.ldelim();
            }
            if (message.values != null && message.values.length) {
                writer.uint32(/* id 3, wireType 2 =*/26).fork();
                for (var i = 0; i < message.values.length; ++i)
                    writer.int32(message.values[i]);
                writer.ldelim();
            }
            if (message.communityCardsIndexes != null && message.communityCardsIndexes.length) {
                writer.uint32(/* id 4, wireType 2 =*/34).fork();
                for (var i = 0; i < message.communityCardsIndexes.length; ++i)
                    writer.int32(message.communityCardsIndexes[i]);
                writer.ldelim();
            }
            return writer;
        };
    
        /**
         * Encodes the specified PokerHandResult message, length delimited. Does not implicitly {@link PokerHandResult.verify|verify} messages.
         * @function encodeDelimited
         * @memberof PokerHandResult
         * @static
         * @param {IPokerHandResult} message PokerHandResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PokerHandResult.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a PokerHandResult message from the specified reader or buffer.
         * @function decode
         * @memberof PokerHandResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {PokerHandResult} PokerHandResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PokerHandResult.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PokerHandResult();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.rank = reader.int32();
                        break;
                    }
                case 2: {
                        if (!(message.holeCardIndexes && message.holeCardIndexes.length))
                            message.holeCardIndexes = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.holeCardIndexes.push(reader.int32());
                        } else
                            message.holeCardIndexes.push(reader.int32());
                        break;
                    }
                case 3: {
                        if (!(message.values && message.values.length))
                            message.values = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.values.push(reader.int32());
                        } else
                            message.values.push(reader.int32());
                        break;
                    }
                case 4: {
                        if (!(message.communityCardsIndexes && message.communityCardsIndexes.length))
                            message.communityCardsIndexes = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.communityCardsIndexes.push(reader.int32());
                        } else
                            message.communityCardsIndexes.push(reader.int32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a PokerHandResult message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof PokerHandResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {PokerHandResult} PokerHandResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PokerHandResult.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a PokerHandResult message.
         * @function verify
         * @memberof PokerHandResult
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PokerHandResult.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.rank != null && message.hasOwnProperty("rank"))
                if (!$util.isInteger(message.rank))
                    return "rank: integer expected";
            if (message.holeCardIndexes != null && message.hasOwnProperty("holeCardIndexes")) {
                if (!Array.isArray(message.holeCardIndexes))
                    return "holeCardIndexes: array expected";
                for (var i = 0; i < message.holeCardIndexes.length; ++i)
                    if (!$util.isInteger(message.holeCardIndexes[i]))
                        return "holeCardIndexes: integer[] expected";
            }
            if (message.values != null && message.hasOwnProperty("values")) {
                if (!Array.isArray(message.values))
                    return "values: array expected";
                for (var i = 0; i < message.values.length; ++i)
                    if (!$util.isInteger(message.values[i]))
                        return "values: integer[] expected";
            }
            if (message.communityCardsIndexes != null && message.hasOwnProperty("communityCardsIndexes")) {
                if (!Array.isArray(message.communityCardsIndexes))
                    return "communityCardsIndexes: array expected";
                for (var i = 0; i < message.communityCardsIndexes.length; ++i)
                    if (!$util.isInteger(message.communityCardsIndexes[i]))
                        return "communityCardsIndexes: integer[] expected";
            }
            return null;
        };
    
        /**
         * Creates a PokerHandResult message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof PokerHandResult
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {PokerHandResult} PokerHandResult
         */
        PokerHandResult.fromObject = function fromObject(object) {
            if (object instanceof $root.PokerHandResult)
                return object;
            var message = new $root.PokerHandResult();
            if (object.rank != null)
                message.rank = object.rank | 0;
            if (object.holeCardIndexes) {
                if (!Array.isArray(object.holeCardIndexes))
                    throw TypeError(".PokerHandResult.holeCardIndexes: array expected");
                message.holeCardIndexes = [];
                for (var i = 0; i < object.holeCardIndexes.length; ++i)
                    message.holeCardIndexes[i] = object.holeCardIndexes[i] | 0;
            }
            if (object.values) {
                if (!Array.isArray(object.values))
                    throw TypeError(".PokerHandResult.values: array expected");
                message.values = [];
                for (var i = 0; i < object.values.length; ++i)
                    message.values[i] = object.values[i] | 0;
            }
            if (object.communityCardsIndexes) {
                if (!Array.isArray(object.communityCardsIndexes))
                    throw TypeError(".PokerHandResult.communityCardsIndexes: array expected");
                message.communityCardsIndexes = [];
                for (var i = 0; i < object.communityCardsIndexes.length; ++i)
                    message.communityCardsIndexes[i] = object.communityCardsIndexes[i] | 0;
            }
            return message;
        };
    
        /**
         * Creates a plain object from a PokerHandResult message. Also converts values to other types if specified.
         * @function toObject
         * @memberof PokerHandResult
         * @static
         * @param {PokerHandResult} message PokerHandResult
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PokerHandResult.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.holeCardIndexes = [];
                object.values = [];
                object.communityCardsIndexes = [];
            }
            if (options.defaults)
                object.rank = 0;
            if (message.rank != null && message.hasOwnProperty("rank"))
                object.rank = message.rank;
            if (message.holeCardIndexes && message.holeCardIndexes.length) {
                object.holeCardIndexes = [];
                for (var j = 0; j < message.holeCardIndexes.length; ++j)
                    object.holeCardIndexes[j] = message.holeCardIndexes[j];
            }
            if (message.values && message.values.length) {
                object.values = [];
                for (var j = 0; j < message.values.length; ++j)
                    object.values[j] = message.values[j];
            }
            if (message.communityCardsIndexes && message.communityCardsIndexes.length) {
                object.communityCardsIndexes = [];
                for (var j = 0; j < message.communityCardsIndexes.length; ++j)
                    object.communityCardsIndexes[j] = message.communityCardsIndexes[j];
            }
            return object;
        };
    
        /**
         * Converts this PokerHandResult to JSON.
         * @function toJSON
         * @memberof PokerHandResult
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PokerHandResult.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        /**
         * Gets the default type url for PokerHandResult
         * @function getTypeUrl
         * @memberof PokerHandResult
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        PokerHandResult.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/PokerHandResult";
        };
    
        return PokerHandResult;
    })();
    
    $root.HandPlayer = (function() {
    
        /**
         * Properties of a HandPlayer.
         * @exports IHandPlayer
         * @interface IHandPlayer
         * @property {string|null} [id] HandPlayer id
         * @property {string|null} [status] HandPlayer status
         * @property {number|null} [stack] HandPlayer stack
         * @property {number|null} [betting] HandPlayer betting
         * @property {boolean|null} [showCard] HandPlayer showCard
         * @property {IPokerHandResult|null} [result] HandPlayer result
         */
    
        /**
         * Constructs a new HandPlayer.
         * @exports HandPlayer
         * @classdesc Represents a HandPlayer.
         * @implements IHandPlayer
         * @constructor
         * @param {IHandPlayer=} [properties] Properties to set
         */
        function HandPlayer(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * HandPlayer id.
         * @member {string} id
         * @memberof HandPlayer
         * @instance
         */
        HandPlayer.prototype.id = "";
    
        /**
         * HandPlayer status.
         * @member {string} status
         * @memberof HandPlayer
         * @instance
         */
        HandPlayer.prototype.status = "";
    
        /**
         * HandPlayer stack.
         * @member {number} stack
         * @memberof HandPlayer
         * @instance
         */
        HandPlayer.prototype.stack = 0;
    
        /**
         * HandPlayer betting.
         * @member {number|null|undefined} betting
         * @memberof HandPlayer
         * @instance
         */
        HandPlayer.prototype.betting = null;
    
        /**
         * HandPlayer showCard.
         * @member {boolean} showCard
         * @memberof HandPlayer
         * @instance
         */
        HandPlayer.prototype.showCard = false;
    
        /**
         * HandPlayer result.
         * @member {IPokerHandResult|null|undefined} result
         * @memberof HandPlayer
         * @instance
         */
        HandPlayer.prototype.result = null;
    
        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;
    
        /**
         * HandPlayer _betting.
         * @member {"betting"|undefined} _betting
         * @memberof HandPlayer
         * @instance
         */
        Object.defineProperty(HandPlayer.prototype, "_betting", {
            get: $util.oneOfGetter($oneOfFields = ["betting"]),
            set: $util.oneOfSetter($oneOfFields)
        });
    
        /**
         * HandPlayer _result.
         * @member {"result"|undefined} _result
         * @memberof HandPlayer
         * @instance
         */
        Object.defineProperty(HandPlayer.prototype, "_result", {
            get: $util.oneOfGetter($oneOfFields = ["result"]),
            set: $util.oneOfSetter($oneOfFields)
        });
    
        /**
         * Creates a new HandPlayer instance using the specified properties.
         * @function create
         * @memberof HandPlayer
         * @static
         * @param {IHandPlayer=} [properties] Properties to set
         * @returns {HandPlayer} HandPlayer instance
         */
        HandPlayer.create = function create(properties) {
            return new HandPlayer(properties);
        };
    
        /**
         * Encodes the specified HandPlayer message. Does not implicitly {@link HandPlayer.verify|verify} messages.
         * @function encode
         * @memberof HandPlayer
         * @static
         * @param {IHandPlayer} message HandPlayer message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HandPlayer.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.status);
            if (message.stack != null && Object.hasOwnProperty.call(message, "stack"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.stack);
            if (message.betting != null && Object.hasOwnProperty.call(message, "betting"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.betting);
            if (message.showCard != null && Object.hasOwnProperty.call(message, "showCard"))
                writer.uint32(/* id 5, wireType 0 =*/40).bool(message.showCard);
            if (message.result != null && Object.hasOwnProperty.call(message, "result"))
                $root.PokerHandResult.encode(message.result, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            return writer;
        };
    
        /**
         * Encodes the specified HandPlayer message, length delimited. Does not implicitly {@link HandPlayer.verify|verify} messages.
         * @function encodeDelimited
         * @memberof HandPlayer
         * @static
         * @param {IHandPlayer} message HandPlayer message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HandPlayer.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a HandPlayer message from the specified reader or buffer.
         * @function decode
         * @memberof HandPlayer
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {HandPlayer} HandPlayer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HandPlayer.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.HandPlayer();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.string();
                        break;
                    }
                case 2: {
                        message.status = reader.string();
                        break;
                    }
                case 3: {
                        message.stack = reader.int32();
                        break;
                    }
                case 4: {
                        message.betting = reader.int32();
                        break;
                    }
                case 5: {
                        message.showCard = reader.bool();
                        break;
                    }
                case 6: {
                        message.result = $root.PokerHandResult.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a HandPlayer message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof HandPlayer
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {HandPlayer} HandPlayer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HandPlayer.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a HandPlayer message.
         * @function verify
         * @memberof HandPlayer
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        HandPlayer.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.status != null && message.hasOwnProperty("status"))
                if (!$util.isString(message.status))
                    return "status: string expected";
            if (message.stack != null && message.hasOwnProperty("stack"))
                if (!$util.isInteger(message.stack))
                    return "stack: integer expected";
            if (message.betting != null && message.hasOwnProperty("betting")) {
                properties._betting = 1;
                if (!$util.isInteger(message.betting))
                    return "betting: integer expected";
            }
            if (message.showCard != null && message.hasOwnProperty("showCard"))
                if (typeof message.showCard !== "boolean")
                    return "showCard: boolean expected";
            if (message.result != null && message.hasOwnProperty("result")) {
                properties._result = 1;
                {
                    var error = $root.PokerHandResult.verify(message.result);
                    if (error)
                        return "result." + error;
                }
            }
            return null;
        };
    
        /**
         * Creates a HandPlayer message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof HandPlayer
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {HandPlayer} HandPlayer
         */
        HandPlayer.fromObject = function fromObject(object) {
            if (object instanceof $root.HandPlayer)
                return object;
            var message = new $root.HandPlayer();
            if (object.id != null)
                message.id = String(object.id);
            if (object.status != null)
                message.status = String(object.status);
            if (object.stack != null)
                message.stack = object.stack | 0;
            if (object.betting != null)
                message.betting = object.betting | 0;
            if (object.showCard != null)
                message.showCard = Boolean(object.showCard);
            if (object.result != null) {
                if (typeof object.result !== "object")
                    throw TypeError(".HandPlayer.result: object expected");
                message.result = $root.PokerHandResult.fromObject(object.result);
            }
            return message;
        };
    
        /**
         * Creates a plain object from a HandPlayer message. Also converts values to other types if specified.
         * @function toObject
         * @memberof HandPlayer
         * @static
         * @param {HandPlayer} message HandPlayer
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        HandPlayer.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.id = "";
                object.status = "";
                object.stack = 0;
                object.showCard = false;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.status != null && message.hasOwnProperty("status"))
                object.status = message.status;
            if (message.stack != null && message.hasOwnProperty("stack"))
                object.stack = message.stack;
            if (message.betting != null && message.hasOwnProperty("betting")) {
                object.betting = message.betting;
                if (options.oneofs)
                    object._betting = "betting";
            }
            if (message.showCard != null && message.hasOwnProperty("showCard"))
                object.showCard = message.showCard;
            if (message.result != null && message.hasOwnProperty("result")) {
                object.result = $root.PokerHandResult.toObject(message.result, options);
                if (options.oneofs)
                    object._result = "result";
            }
            return object;
        };
    
        /**
         * Converts this HandPlayer to JSON.
         * @function toJSON
         * @memberof HandPlayer
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        HandPlayer.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        /**
         * Gets the default type url for HandPlayer
         * @function getTypeUrl
         * @memberof HandPlayer
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        HandPlayer.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/HandPlayer";
        };
    
        return HandPlayer;
    })();
    
    $root.PlayerCards = (function() {
    
        /**
         * Properties of a PlayerCards.
         * @exports IPlayerCards
         * @interface IPlayerCards
         * @property {string|null} [id] PlayerCards id
         * @property {Array.<ICard>|null} [cards] PlayerCards cards
         */
    
        /**
         * Constructs a new PlayerCards.
         * @exports PlayerCards
         * @classdesc Represents a PlayerCards.
         * @implements IPlayerCards
         * @constructor
         * @param {IPlayerCards=} [properties] Properties to set
         */
        function PlayerCards(properties) {
            this.cards = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * PlayerCards id.
         * @member {string} id
         * @memberof PlayerCards
         * @instance
         */
        PlayerCards.prototype.id = "";
    
        /**
         * PlayerCards cards.
         * @member {Array.<ICard>} cards
         * @memberof PlayerCards
         * @instance
         */
        PlayerCards.prototype.cards = $util.emptyArray;
    
        /**
         * Creates a new PlayerCards instance using the specified properties.
         * @function create
         * @memberof PlayerCards
         * @static
         * @param {IPlayerCards=} [properties] Properties to set
         * @returns {PlayerCards} PlayerCards instance
         */
        PlayerCards.create = function create(properties) {
            return new PlayerCards(properties);
        };
    
        /**
         * Encodes the specified PlayerCards message. Does not implicitly {@link PlayerCards.verify|verify} messages.
         * @function encode
         * @memberof PlayerCards
         * @static
         * @param {IPlayerCards} message PlayerCards message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerCards.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            if (message.cards != null && message.cards.length)
                for (var i = 0; i < message.cards.length; ++i)
                    $root.Card.encode(message.cards[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };
    
        /**
         * Encodes the specified PlayerCards message, length delimited. Does not implicitly {@link PlayerCards.verify|verify} messages.
         * @function encodeDelimited
         * @memberof PlayerCards
         * @static
         * @param {IPlayerCards} message PlayerCards message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerCards.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a PlayerCards message from the specified reader or buffer.
         * @function decode
         * @memberof PlayerCards
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {PlayerCards} PlayerCards
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerCards.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PlayerCards();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.string();
                        break;
                    }
                case 2: {
                        if (!(message.cards && message.cards.length))
                            message.cards = [];
                        message.cards.push($root.Card.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a PlayerCards message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof PlayerCards
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {PlayerCards} PlayerCards
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerCards.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a PlayerCards message.
         * @function verify
         * @memberof PlayerCards
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PlayerCards.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.cards != null && message.hasOwnProperty("cards")) {
                if (!Array.isArray(message.cards))
                    return "cards: array expected";
                for (var i = 0; i < message.cards.length; ++i) {
                    var error = $root.Card.verify(message.cards[i]);
                    if (error)
                        return "cards." + error;
                }
            }
            return null;
        };
    
        /**
         * Creates a PlayerCards message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof PlayerCards
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {PlayerCards} PlayerCards
         */
        PlayerCards.fromObject = function fromObject(object) {
            if (object instanceof $root.PlayerCards)
                return object;
            var message = new $root.PlayerCards();
            if (object.id != null)
                message.id = String(object.id);
            if (object.cards) {
                if (!Array.isArray(object.cards))
                    throw TypeError(".PlayerCards.cards: array expected");
                message.cards = [];
                for (var i = 0; i < object.cards.length; ++i) {
                    if (typeof object.cards[i] !== "object")
                        throw TypeError(".PlayerCards.cards: object expected");
                    message.cards[i] = $root.Card.fromObject(object.cards[i]);
                }
            }
            return message;
        };
    
        /**
         * Creates a plain object from a PlayerCards message. Also converts values to other types if specified.
         * @function toObject
         * @memberof PlayerCards
         * @static
         * @param {PlayerCards} message PlayerCards
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PlayerCards.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.cards = [];
            if (options.defaults)
                object.id = "";
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.cards && message.cards.length) {
                object.cards = [];
                for (var j = 0; j < message.cards.length; ++j)
                    object.cards[j] = $root.Card.toObject(message.cards[j], options);
            }
            return object;
        };
    
        /**
         * Converts this PlayerCards to JSON.
         * @function toJSON
         * @memberof PlayerCards
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PlayerCards.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        /**
         * Gets the default type url for PlayerCards
         * @function getTypeUrl
         * @memberof PlayerCards
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        PlayerCards.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/PlayerCards";
        };
    
        return PlayerCards;
    })();
    
    $root.HandStep = (function() {
    
        /**
         * Properties of a HandStep.
         * @exports IHandStep
         * @interface IHandStep
         * @property {number|null} [type] HandStep type
         * @property {number|null} [amount] HandStep amount
         * @property {string|null} [player] HandStep player
         * @property {string|null} [round] HandStep round
         * @property {Array.<ICard>|null} [cards] HandStep cards
         */
    
        /**
         * Constructs a new HandStep.
         * @exports HandStep
         * @classdesc Represents a HandStep.
         * @implements IHandStep
         * @constructor
         * @param {IHandStep=} [properties] Properties to set
         */
        function HandStep(properties) {
            this.cards = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * HandStep type.
         * @member {number} type
         * @memberof HandStep
         * @instance
         */
        HandStep.prototype.type = 0;
    
        /**
         * HandStep amount.
         * @member {number|null|undefined} amount
         * @memberof HandStep
         * @instance
         */
        HandStep.prototype.amount = null;
    
        /**
         * HandStep player.
         * @member {string|null|undefined} player
         * @memberof HandStep
         * @instance
         */
        HandStep.prototype.player = null;
    
        /**
         * HandStep round.
         * @member {string|null|undefined} round
         * @memberof HandStep
         * @instance
         */
        HandStep.prototype.round = null;
    
        /**
         * HandStep cards.
         * @member {Array.<ICard>} cards
         * @memberof HandStep
         * @instance
         */
        HandStep.prototype.cards = $util.emptyArray;
    
        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;
    
        /**
         * HandStep _amount.
         * @member {"amount"|undefined} _amount
         * @memberof HandStep
         * @instance
         */
        Object.defineProperty(HandStep.prototype, "_amount", {
            get: $util.oneOfGetter($oneOfFields = ["amount"]),
            set: $util.oneOfSetter($oneOfFields)
        });
    
        /**
         * HandStep _player.
         * @member {"player"|undefined} _player
         * @memberof HandStep
         * @instance
         */
        Object.defineProperty(HandStep.prototype, "_player", {
            get: $util.oneOfGetter($oneOfFields = ["player"]),
            set: $util.oneOfSetter($oneOfFields)
        });
    
        /**
         * HandStep _round.
         * @member {"round"|undefined} _round
         * @memberof HandStep
         * @instance
         */
        Object.defineProperty(HandStep.prototype, "_round", {
            get: $util.oneOfGetter($oneOfFields = ["round"]),
            set: $util.oneOfSetter($oneOfFields)
        });
    
        /**
         * Creates a new HandStep instance using the specified properties.
         * @function create
         * @memberof HandStep
         * @static
         * @param {IHandStep=} [properties] Properties to set
         * @returns {HandStep} HandStep instance
         */
        HandStep.create = function create(properties) {
            return new HandStep(properties);
        };
    
        /**
         * Encodes the specified HandStep message. Does not implicitly {@link HandStep.verify|verify} messages.
         * @function encode
         * @memberof HandStep
         * @static
         * @param {IHandStep} message HandStep message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HandStep.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
            if (message.amount != null && Object.hasOwnProperty.call(message, "amount"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.amount);
            if (message.player != null && Object.hasOwnProperty.call(message, "player"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.player);
            if (message.round != null && Object.hasOwnProperty.call(message, "round"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.round);
            if (message.cards != null && message.cards.length)
                for (var i = 0; i < message.cards.length; ++i)
                    $root.Card.encode(message.cards[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            return writer;
        };
    
        /**
         * Encodes the specified HandStep message, length delimited. Does not implicitly {@link HandStep.verify|verify} messages.
         * @function encodeDelimited
         * @memberof HandStep
         * @static
         * @param {IHandStep} message HandStep message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HandStep.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a HandStep message from the specified reader or buffer.
         * @function decode
         * @memberof HandStep
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {HandStep} HandStep
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HandStep.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.HandStep();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.type = reader.int32();
                        break;
                    }
                case 2: {
                        message.amount = reader.int32();
                        break;
                    }
                case 3: {
                        message.player = reader.string();
                        break;
                    }
                case 4: {
                        message.round = reader.string();
                        break;
                    }
                case 5: {
                        if (!(message.cards && message.cards.length))
                            message.cards = [];
                        message.cards.push($root.Card.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a HandStep message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof HandStep
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {HandStep} HandStep
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HandStep.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a HandStep message.
         * @function verify
         * @memberof HandStep
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        HandStep.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.type != null && message.hasOwnProperty("type"))
                if (!$util.isInteger(message.type))
                    return "type: integer expected";
            if (message.amount != null && message.hasOwnProperty("amount")) {
                properties._amount = 1;
                if (!$util.isInteger(message.amount))
                    return "amount: integer expected";
            }
            if (message.player != null && message.hasOwnProperty("player")) {
                properties._player = 1;
                if (!$util.isString(message.player))
                    return "player: string expected";
            }
            if (message.round != null && message.hasOwnProperty("round")) {
                properties._round = 1;
                if (!$util.isString(message.round))
                    return "round: string expected";
            }
            if (message.cards != null && message.hasOwnProperty("cards")) {
                if (!Array.isArray(message.cards))
                    return "cards: array expected";
                for (var i = 0; i < message.cards.length; ++i) {
                    var error = $root.Card.verify(message.cards[i]);
                    if (error)
                        return "cards." + error;
                }
            }
            return null;
        };
    
        /**
         * Creates a HandStep message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof HandStep
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {HandStep} HandStep
         */
        HandStep.fromObject = function fromObject(object) {
            if (object instanceof $root.HandStep)
                return object;
            var message = new $root.HandStep();
            if (object.type != null)
                message.type = object.type | 0;
            if (object.amount != null)
                message.amount = object.amount | 0;
            if (object.player != null)
                message.player = String(object.player);
            if (object.round != null)
                message.round = String(object.round);
            if (object.cards) {
                if (!Array.isArray(object.cards))
                    throw TypeError(".HandStep.cards: array expected");
                message.cards = [];
                for (var i = 0; i < object.cards.length; ++i) {
                    if (typeof object.cards[i] !== "object")
                        throw TypeError(".HandStep.cards: object expected");
                    message.cards[i] = $root.Card.fromObject(object.cards[i]);
                }
            }
            return message;
        };
    
        /**
         * Creates a plain object from a HandStep message. Also converts values to other types if specified.
         * @function toObject
         * @memberof HandStep
         * @static
         * @param {HandStep} message HandStep
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        HandStep.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.cards = [];
            if (options.defaults)
                object.type = 0;
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            if (message.amount != null && message.hasOwnProperty("amount")) {
                object.amount = message.amount;
                if (options.oneofs)
                    object._amount = "amount";
            }
            if (message.player != null && message.hasOwnProperty("player")) {
                object.player = message.player;
                if (options.oneofs)
                    object._player = "player";
            }
            if (message.round != null && message.hasOwnProperty("round")) {
                object.round = message.round;
                if (options.oneofs)
                    object._round = "round";
            }
            if (message.cards && message.cards.length) {
                object.cards = [];
                for (var j = 0; j < message.cards.length; ++j)
                    object.cards[j] = $root.Card.toObject(message.cards[j], options);
            }
            return object;
        };
    
        /**
         * Converts this HandStep to JSON.
         * @function toJSON
         * @memberof HandStep
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        HandStep.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        /**
         * Gets the default type url for HandStep
         * @function getTypeUrl
         * @memberof HandStep
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        HandStep.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/HandStep";
        };
    
        return HandStep;
    })();
    
    $root.GameHand = (function() {
    
        /**
         * Properties of a GameHand.
         * @exports IGameHand
         * @interface IGameHand
         * @property {number|null} [id] GameHand id
         * @property {Array.<IHandPlayer>|null} [players] GameHand players
         * @property {Array.<IPlayerCards>|null} [playerCards] GameHand playerCards
         * @property {string|null} [status] GameHand status
         * @property {string|null} [round] GameHand round
         * @property {Array.<ICard>|null} [communityCards] GameHand communityCards
         * @property {string|null} [currentPlayer] GameHand currentPlayer
         * @property {number|null} [committedPot] GameHand committedPot
         * @property {number|null} [fullPot] GameHand fullPot
         * @property {number|null} [betting] GameHand betting
         * @property {number|null} [minRaise] GameHand minRaise
         * @property {number|Long|null} [beginActionTime] GameHand beginActionTime
         * @property {number|Long|null} [timeOutAt] GameHand timeOutAt
         * @property {Object.<string,number>|null} [winners] GameHand winners
         * @property {Array.<IHandStep>|null} [steps] GameHand steps
         */
    
        /**
         * Constructs a new GameHand.
         * @exports GameHand
         * @classdesc Represents a GameHand.
         * @implements IGameHand
         * @constructor
         * @param {IGameHand=} [properties] Properties to set
         */
        function GameHand(properties) {
            this.players = [];
            this.playerCards = [];
            this.communityCards = [];
            this.winners = {};
            this.steps = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * GameHand id.
         * @member {number} id
         * @memberof GameHand
         * @instance
         */
        GameHand.prototype.id = 0;
    
        /**
         * GameHand players.
         * @member {Array.<IHandPlayer>} players
         * @memberof GameHand
         * @instance
         */
        GameHand.prototype.players = $util.emptyArray;
    
        /**
         * GameHand playerCards.
         * @member {Array.<IPlayerCards>} playerCards
         * @memberof GameHand
         * @instance
         */
        GameHand.prototype.playerCards = $util.emptyArray;
    
        /**
         * GameHand status.
         * @member {string} status
         * @memberof GameHand
         * @instance
         */
        GameHand.prototype.status = "";
    
        /**
         * GameHand round.
         * @member {string} round
         * @memberof GameHand
         * @instance
         */
        GameHand.prototype.round = "";
    
        /**
         * GameHand communityCards.
         * @member {Array.<ICard>} communityCards
         * @memberof GameHand
         * @instance
         */
        GameHand.prototype.communityCards = $util.emptyArray;
    
        /**
         * GameHand currentPlayer.
         * @member {string|null|undefined} currentPlayer
         * @memberof GameHand
         * @instance
         */
        GameHand.prototype.currentPlayer = null;
    
        /**
         * GameHand committedPot.
         * @member {number} committedPot
         * @memberof GameHand
         * @instance
         */
        GameHand.prototype.committedPot = 0;
    
        /**
         * GameHand fullPot.
         * @member {number} fullPot
         * @memberof GameHand
         * @instance
         */
        GameHand.prototype.fullPot = 0;
    
        /**
         * GameHand betting.
         * @member {number} betting
         * @memberof GameHand
         * @instance
         */
        GameHand.prototype.betting = 0;
    
        /**
         * GameHand minRaise.
         * @member {number} minRaise
         * @memberof GameHand
         * @instance
         */
        GameHand.prototype.minRaise = 0;
    
        /**
         * GameHand beginActionTime.
         * @member {number|Long} beginActionTime
         * @memberof GameHand
         * @instance
         */
        GameHand.prototype.beginActionTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
        /**
         * GameHand timeOutAt.
         * @member {number|Long} timeOutAt
         * @memberof GameHand
         * @instance
         */
        GameHand.prototype.timeOutAt = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
        /**
         * GameHand winners.
         * @member {Object.<string,number>} winners
         * @memberof GameHand
         * @instance
         */
        GameHand.prototype.winners = $util.emptyObject;
    
        /**
         * GameHand steps.
         * @member {Array.<IHandStep>} steps
         * @memberof GameHand
         * @instance
         */
        GameHand.prototype.steps = $util.emptyArray;
    
        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;
    
        /**
         * GameHand _currentPlayer.
         * @member {"currentPlayer"|undefined} _currentPlayer
         * @memberof GameHand
         * @instance
         */
        Object.defineProperty(GameHand.prototype, "_currentPlayer", {
            get: $util.oneOfGetter($oneOfFields = ["currentPlayer"]),
            set: $util.oneOfSetter($oneOfFields)
        });
    
        /**
         * Creates a new GameHand instance using the specified properties.
         * @function create
         * @memberof GameHand
         * @static
         * @param {IGameHand=} [properties] Properties to set
         * @returns {GameHand} GameHand instance
         */
        GameHand.create = function create(properties) {
            return new GameHand(properties);
        };
    
        /**
         * Encodes the specified GameHand message. Does not implicitly {@link GameHand.verify|verify} messages.
         * @function encode
         * @memberof GameHand
         * @static
         * @param {IGameHand} message GameHand message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameHand.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.id);
            if (message.players != null && message.players.length)
                for (var i = 0; i < message.players.length; ++i)
                    $root.HandPlayer.encode(message.players[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.playerCards != null && message.playerCards.length)
                for (var i = 0; i < message.playerCards.length; ++i)
                    $root.PlayerCards.encode(message.playerCards[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.status);
            if (message.round != null && Object.hasOwnProperty.call(message, "round"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.round);
            if (message.communityCards != null && message.communityCards.length)
                for (var i = 0; i < message.communityCards.length; ++i)
                    $root.Card.encode(message.communityCards[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.currentPlayer != null && Object.hasOwnProperty.call(message, "currentPlayer"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.currentPlayer);
            if (message.committedPot != null && Object.hasOwnProperty.call(message, "committedPot"))
                writer.uint32(/* id 8, wireType 0 =*/64).int32(message.committedPot);
            if (message.fullPot != null && Object.hasOwnProperty.call(message, "fullPot"))
                writer.uint32(/* id 9, wireType 0 =*/72).int32(message.fullPot);
            if (message.betting != null && Object.hasOwnProperty.call(message, "betting"))
                writer.uint32(/* id 10, wireType 0 =*/80).int32(message.betting);
            if (message.minRaise != null && Object.hasOwnProperty.call(message, "minRaise"))
                writer.uint32(/* id 11, wireType 0 =*/88).int32(message.minRaise);
            if (message.beginActionTime != null && Object.hasOwnProperty.call(message, "beginActionTime"))
                writer.uint32(/* id 12, wireType 0 =*/96).int64(message.beginActionTime);
            if (message.timeOutAt != null && Object.hasOwnProperty.call(message, "timeOutAt"))
                writer.uint32(/* id 13, wireType 0 =*/104).int64(message.timeOutAt);
            if (message.winners != null && Object.hasOwnProperty.call(message, "winners"))
                for (var keys = Object.keys(message.winners), i = 0; i < keys.length; ++i)
                    writer.uint32(/* id 14, wireType 2 =*/114).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 0 =*/16).int32(message.winners[keys[i]]).ldelim();
            if (message.steps != null && message.steps.length)
                for (var i = 0; i < message.steps.length; ++i)
                    $root.HandStep.encode(message.steps[i], writer.uint32(/* id 15, wireType 2 =*/122).fork()).ldelim();
            return writer;
        };
    
        /**
         * Encodes the specified GameHand message, length delimited. Does not implicitly {@link GameHand.verify|verify} messages.
         * @function encodeDelimited
         * @memberof GameHand
         * @static
         * @param {IGameHand} message GameHand message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameHand.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a GameHand message from the specified reader or buffer.
         * @function decode
         * @memberof GameHand
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {GameHand} GameHand
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameHand.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GameHand(), key, value;
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.int32();
                        break;
                    }
                case 2: {
                        if (!(message.players && message.players.length))
                            message.players = [];
                        message.players.push($root.HandPlayer.decode(reader, reader.uint32()));
                        break;
                    }
                case 3: {
                        if (!(message.playerCards && message.playerCards.length))
                            message.playerCards = [];
                        message.playerCards.push($root.PlayerCards.decode(reader, reader.uint32()));
                        break;
                    }
                case 4: {
                        message.status = reader.string();
                        break;
                    }
                case 5: {
                        message.round = reader.string();
                        break;
                    }
                case 6: {
                        if (!(message.communityCards && message.communityCards.length))
                            message.communityCards = [];
                        message.communityCards.push($root.Card.decode(reader, reader.uint32()));
                        break;
                    }
                case 7: {
                        message.currentPlayer = reader.string();
                        break;
                    }
                case 8: {
                        message.committedPot = reader.int32();
                        break;
                    }
                case 9: {
                        message.fullPot = reader.int32();
                        break;
                    }
                case 10: {
                        message.betting = reader.int32();
                        break;
                    }
                case 11: {
                        message.minRaise = reader.int32();
                        break;
                    }
                case 12: {
                        message.beginActionTime = reader.int64();
                        break;
                    }
                case 13: {
                        message.timeOutAt = reader.int64();
                        break;
                    }
                case 14: {
                        if (message.winners === $util.emptyObject)
                            message.winners = {};
                        var end2 = reader.uint32() + reader.pos;
                        key = "";
                        value = 0;
                        while (reader.pos < end2) {
                            var tag2 = reader.uint32();
                            switch (tag2 >>> 3) {
                            case 1:
                                key = reader.string();
                                break;
                            case 2:
                                value = reader.int32();
                                break;
                            default:
                                reader.skipType(tag2 & 7);
                                break;
                            }
                        }
                        message.winners[key] = value;
                        break;
                    }
                case 15: {
                        if (!(message.steps && message.steps.length))
                            message.steps = [];
                        message.steps.push($root.HandStep.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a GameHand message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof GameHand
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {GameHand} GameHand
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameHand.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a GameHand message.
         * @function verify
         * @memberof GameHand
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GameHand.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            if (message.players != null && message.hasOwnProperty("players")) {
                if (!Array.isArray(message.players))
                    return "players: array expected";
                for (var i = 0; i < message.players.length; ++i) {
                    var error = $root.HandPlayer.verify(message.players[i]);
                    if (error)
                        return "players." + error;
                }
            }
            if (message.playerCards != null && message.hasOwnProperty("playerCards")) {
                if (!Array.isArray(message.playerCards))
                    return "playerCards: array expected";
                for (var i = 0; i < message.playerCards.length; ++i) {
                    var error = $root.PlayerCards.verify(message.playerCards[i]);
                    if (error)
                        return "playerCards." + error;
                }
            }
            if (message.status != null && message.hasOwnProperty("status"))
                if (!$util.isString(message.status))
                    return "status: string expected";
            if (message.round != null && message.hasOwnProperty("round"))
                if (!$util.isString(message.round))
                    return "round: string expected";
            if (message.communityCards != null && message.hasOwnProperty("communityCards")) {
                if (!Array.isArray(message.communityCards))
                    return "communityCards: array expected";
                for (var i = 0; i < message.communityCards.length; ++i) {
                    var error = $root.Card.verify(message.communityCards[i]);
                    if (error)
                        return "communityCards." + error;
                }
            }
            if (message.currentPlayer != null && message.hasOwnProperty("currentPlayer")) {
                properties._currentPlayer = 1;
                if (!$util.isString(message.currentPlayer))
                    return "currentPlayer: string expected";
            }
            if (message.committedPot != null && message.hasOwnProperty("committedPot"))
                if (!$util.isInteger(message.committedPot))
                    return "committedPot: integer expected";
            if (message.fullPot != null && message.hasOwnProperty("fullPot"))
                if (!$util.isInteger(message.fullPot))
                    return "fullPot: integer expected";
            if (message.betting != null && message.hasOwnProperty("betting"))
                if (!$util.isInteger(message.betting))
                    return "betting: integer expected";
            if (message.minRaise != null && message.hasOwnProperty("minRaise"))
                if (!$util.isInteger(message.minRaise))
                    return "minRaise: integer expected";
            if (message.beginActionTime != null && message.hasOwnProperty("beginActionTime"))
                if (!$util.isInteger(message.beginActionTime) && !(message.beginActionTime && $util.isInteger(message.beginActionTime.low) && $util.isInteger(message.beginActionTime.high)))
                    return "beginActionTime: integer|Long expected";
            if (message.timeOutAt != null && message.hasOwnProperty("timeOutAt"))
                if (!$util.isInteger(message.timeOutAt) && !(message.timeOutAt && $util.isInteger(message.timeOutAt.low) && $util.isInteger(message.timeOutAt.high)))
                    return "timeOutAt: integer|Long expected";
            if (message.winners != null && message.hasOwnProperty("winners")) {
                if (!$util.isObject(message.winners))
                    return "winners: object expected";
                var key = Object.keys(message.winners);
                for (var i = 0; i < key.length; ++i)
                    if (!$util.isInteger(message.winners[key[i]]))
                        return "winners: integer{k:string} expected";
            }
            if (message.steps != null && message.hasOwnProperty("steps")) {
                if (!Array.isArray(message.steps))
                    return "steps: array expected";
                for (var i = 0; i < message.steps.length; ++i) {
                    var error = $root.HandStep.verify(message.steps[i]);
                    if (error)
                        return "steps." + error;
                }
            }
            return null;
        };
    
        /**
         * Creates a GameHand message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof GameHand
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {GameHand} GameHand
         */
        GameHand.fromObject = function fromObject(object) {
            if (object instanceof $root.GameHand)
                return object;
            var message = new $root.GameHand();
            if (object.id != null)
                message.id = object.id | 0;
            if (object.players) {
                if (!Array.isArray(object.players))
                    throw TypeError(".GameHand.players: array expected");
                message.players = [];
                for (var i = 0; i < object.players.length; ++i) {
                    if (typeof object.players[i] !== "object")
                        throw TypeError(".GameHand.players: object expected");
                    message.players[i] = $root.HandPlayer.fromObject(object.players[i]);
                }
            }
            if (object.playerCards) {
                if (!Array.isArray(object.playerCards))
                    throw TypeError(".GameHand.playerCards: array expected");
                message.playerCards = [];
                for (var i = 0; i < object.playerCards.length; ++i) {
                    if (typeof object.playerCards[i] !== "object")
                        throw TypeError(".GameHand.playerCards: object expected");
                    message.playerCards[i] = $root.PlayerCards.fromObject(object.playerCards[i]);
                }
            }
            if (object.status != null)
                message.status = String(object.status);
            if (object.round != null)
                message.round = String(object.round);
            if (object.communityCards) {
                if (!Array.isArray(object.communityCards))
                    throw TypeError(".GameHand.communityCards: array expected");
                message.communityCards = [];
                for (var i = 0; i < object.communityCards.length; ++i) {
                    if (typeof object.communityCards[i] !== "object")
                        throw TypeError(".GameHand.communityCards: object expected");
                    message.communityCards[i] = $root.Card.fromObject(object.communityCards[i]);
                }
            }
            if (object.currentPlayer != null)
                message.currentPlayer = String(object.currentPlayer);
            if (object.committedPot != null)
                message.committedPot = object.committedPot | 0;
            if (object.fullPot != null)
                message.fullPot = object.fullPot | 0;
            if (object.betting != null)
                message.betting = object.betting | 0;
            if (object.minRaise != null)
                message.minRaise = object.minRaise | 0;
            if (object.beginActionTime != null)
                if ($util.Long)
                    (message.beginActionTime = $util.Long.fromValue(object.beginActionTime)).unsigned = false;
                else if (typeof object.beginActionTime === "string")
                    message.beginActionTime = parseInt(object.beginActionTime, 10);
                else if (typeof object.beginActionTime === "number")
                    message.beginActionTime = object.beginActionTime;
                else if (typeof object.beginActionTime === "object")
                    message.beginActionTime = new $util.LongBits(object.beginActionTime.low >>> 0, object.beginActionTime.high >>> 0).toNumber();
            if (object.timeOutAt != null)
                if ($util.Long)
                    (message.timeOutAt = $util.Long.fromValue(object.timeOutAt)).unsigned = false;
                else if (typeof object.timeOutAt === "string")
                    message.timeOutAt = parseInt(object.timeOutAt, 10);
                else if (typeof object.timeOutAt === "number")
                    message.timeOutAt = object.timeOutAt;
                else if (typeof object.timeOutAt === "object")
                    message.timeOutAt = new $util.LongBits(object.timeOutAt.low >>> 0, object.timeOutAt.high >>> 0).toNumber();
            if (object.winners) {
                if (typeof object.winners !== "object")
                    throw TypeError(".GameHand.winners: object expected");
                message.winners = {};
                for (var keys = Object.keys(object.winners), i = 0; i < keys.length; ++i)
                    message.winners[keys[i]] = object.winners[keys[i]] | 0;
            }
            if (object.steps) {
                if (!Array.isArray(object.steps))
                    throw TypeError(".GameHand.steps: array expected");
                message.steps = [];
                for (var i = 0; i < object.steps.length; ++i) {
                    if (typeof object.steps[i] !== "object")
                        throw TypeError(".GameHand.steps: object expected");
                    message.steps[i] = $root.HandStep.fromObject(object.steps[i]);
                }
            }
            return message;
        };
    
        /**
         * Creates a plain object from a GameHand message. Also converts values to other types if specified.
         * @function toObject
         * @memberof GameHand
         * @static
         * @param {GameHand} message GameHand
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GameHand.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.players = [];
                object.playerCards = [];
                object.communityCards = [];
                object.steps = [];
            }
            if (options.objects || options.defaults)
                object.winners = {};
            if (options.defaults) {
                object.id = 0;
                object.status = "";
                object.round = "";
                object.committedPot = 0;
                object.fullPot = 0;
                object.betting = 0;
                object.minRaise = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.beginActionTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.beginActionTime = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timeOutAt = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timeOutAt = options.longs === String ? "0" : 0;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.players && message.players.length) {
                object.players = [];
                for (var j = 0; j < message.players.length; ++j)
                    object.players[j] = $root.HandPlayer.toObject(message.players[j], options);
            }
            if (message.playerCards && message.playerCards.length) {
                object.playerCards = [];
                for (var j = 0; j < message.playerCards.length; ++j)
                    object.playerCards[j] = $root.PlayerCards.toObject(message.playerCards[j], options);
            }
            if (message.status != null && message.hasOwnProperty("status"))
                object.status = message.status;
            if (message.round != null && message.hasOwnProperty("round"))
                object.round = message.round;
            if (message.communityCards && message.communityCards.length) {
                object.communityCards = [];
                for (var j = 0; j < message.communityCards.length; ++j)
                    object.communityCards[j] = $root.Card.toObject(message.communityCards[j], options);
            }
            if (message.currentPlayer != null && message.hasOwnProperty("currentPlayer")) {
                object.currentPlayer = message.currentPlayer;
                if (options.oneofs)
                    object._currentPlayer = "currentPlayer";
            }
            if (message.committedPot != null && message.hasOwnProperty("committedPot"))
                object.committedPot = message.committedPot;
            if (message.fullPot != null && message.hasOwnProperty("fullPot"))
                object.fullPot = message.fullPot;
            if (message.betting != null && message.hasOwnProperty("betting"))
                object.betting = message.betting;
            if (message.minRaise != null && message.hasOwnProperty("minRaise"))
                object.minRaise = message.minRaise;
            if (message.beginActionTime != null && message.hasOwnProperty("beginActionTime"))
                if (typeof message.beginActionTime === "number")
                    object.beginActionTime = options.longs === String ? String(message.beginActionTime) : message.beginActionTime;
                else
                    object.beginActionTime = options.longs === String ? $util.Long.prototype.toString.call(message.beginActionTime) : options.longs === Number ? new $util.LongBits(message.beginActionTime.low >>> 0, message.beginActionTime.high >>> 0).toNumber() : message.beginActionTime;
            if (message.timeOutAt != null && message.hasOwnProperty("timeOutAt"))
                if (typeof message.timeOutAt === "number")
                    object.timeOutAt = options.longs === String ? String(message.timeOutAt) : message.timeOutAt;
                else
                    object.timeOutAt = options.longs === String ? $util.Long.prototype.toString.call(message.timeOutAt) : options.longs === Number ? new $util.LongBits(message.timeOutAt.low >>> 0, message.timeOutAt.high >>> 0).toNumber() : message.timeOutAt;
            var keys2;
            if (message.winners && (keys2 = Object.keys(message.winners)).length) {
                object.winners = {};
                for (var j = 0; j < keys2.length; ++j)
                    object.winners[keys2[j]] = message.winners[keys2[j]];
            }
            if (message.steps && message.steps.length) {
                object.steps = [];
                for (var j = 0; j < message.steps.length; ++j)
                    object.steps[j] = $root.HandStep.toObject(message.steps[j], options);
            }
            return object;
        };
    
        /**
         * Converts this GameHand to JSON.
         * @function toJSON
         * @memberof GameHand
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GameHand.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        /**
         * Gets the default type url for GameHand
         * @function getTypeUrl
         * @memberof GameHand
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GameHand.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/GameHand";
        };
    
        return GameHand;
    })();
    
    $root.Game = (function() {
    
        /**
         * Properties of a Game.
         * @exports IGame
         * @interface IGame
         * @property {string|null} [id] Game id
         * @property {string|null} [ownerId] Game ownerId
         * @property {string|null} [status] Game status
         * @property {Array.<string>|null} [seats] Game seats
         * @property {Object.<string,IGamePlayer>|null} [players] Game players
         * @property {Array.<string>|null} [onlinePlayers] Game onlinePlayers
         * @property {number|null} [dealerSeat] Game dealerSeat
         * @property {IGameSettings|null} [settings] Game settings
         * @property {IGameRequests|null} [requests] Game requests
         * @property {number|Long|null} [time] Game time
         * @property {IGameHand|null} [hand] Game hand
         * @property {boolean|null} [noHand] Game noHand
         * @property {string|null} [seed] Game seed
         */
    
        /**
         * Constructs a new Game.
         * @exports Game
         * @classdesc Represents a Game.
         * @implements IGame
         * @constructor
         * @param {IGame=} [properties] Properties to set
         */
        function Game(properties) {
            this.seats = [];
            this.players = {};
            this.onlinePlayers = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * Game id.
         * @member {string} id
         * @memberof Game
         * @instance
         */
        Game.prototype.id = "";
    
        /**
         * Game ownerId.
         * @member {string|null|undefined} ownerId
         * @memberof Game
         * @instance
         */
        Game.prototype.ownerId = null;
    
        /**
         * Game status.
         * @member {string|null|undefined} status
         * @memberof Game
         * @instance
         */
        Game.prototype.status = null;
    
        /**
         * Game seats.
         * @member {Array.<string>} seats
         * @memberof Game
         * @instance
         */
        Game.prototype.seats = $util.emptyArray;
    
        /**
         * Game players.
         * @member {Object.<string,IGamePlayer>} players
         * @memberof Game
         * @instance
         */
        Game.prototype.players = $util.emptyObject;
    
        /**
         * Game onlinePlayers.
         * @member {Array.<string>} onlinePlayers
         * @memberof Game
         * @instance
         */
        Game.prototype.onlinePlayers = $util.emptyArray;
    
        /**
         * Game dealerSeat.
         * @member {number|null|undefined} dealerSeat
         * @memberof Game
         * @instance
         */
        Game.prototype.dealerSeat = null;
    
        /**
         * Game settings.
         * @member {IGameSettings|null|undefined} settings
         * @memberof Game
         * @instance
         */
        Game.prototype.settings = null;
    
        /**
         * Game requests.
         * @member {IGameRequests|null|undefined} requests
         * @memberof Game
         * @instance
         */
        Game.prototype.requests = null;
    
        /**
         * Game time.
         * @member {number|Long} time
         * @memberof Game
         * @instance
         */
        Game.prototype.time = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
        /**
         * Game hand.
         * @member {IGameHand|null|undefined} hand
         * @memberof Game
         * @instance
         */
        Game.prototype.hand = null;
    
        /**
         * Game noHand.
         * @member {boolean} noHand
         * @memberof Game
         * @instance
         */
        Game.prototype.noHand = false;
    
        /**
         * Game seed.
         * @member {string|null|undefined} seed
         * @memberof Game
         * @instance
         */
        Game.prototype.seed = null;
    
        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;
    
        /**
         * Game _ownerId.
         * @member {"ownerId"|undefined} _ownerId
         * @memberof Game
         * @instance
         */
        Object.defineProperty(Game.prototype, "_ownerId", {
            get: $util.oneOfGetter($oneOfFields = ["ownerId"]),
            set: $util.oneOfSetter($oneOfFields)
        });
    
        /**
         * Game _status.
         * @member {"status"|undefined} _status
         * @memberof Game
         * @instance
         */
        Object.defineProperty(Game.prototype, "_status", {
            get: $util.oneOfGetter($oneOfFields = ["status"]),
            set: $util.oneOfSetter($oneOfFields)
        });
    
        /**
         * Game _dealerSeat.
         * @member {"dealerSeat"|undefined} _dealerSeat
         * @memberof Game
         * @instance
         */
        Object.defineProperty(Game.prototype, "_dealerSeat", {
            get: $util.oneOfGetter($oneOfFields = ["dealerSeat"]),
            set: $util.oneOfSetter($oneOfFields)
        });
    
        /**
         * Game _settings.
         * @member {"settings"|undefined} _settings
         * @memberof Game
         * @instance
         */
        Object.defineProperty(Game.prototype, "_settings", {
            get: $util.oneOfGetter($oneOfFields = ["settings"]),
            set: $util.oneOfSetter($oneOfFields)
        });
    
        /**
         * Game _requests.
         * @member {"requests"|undefined} _requests
         * @memberof Game
         * @instance
         */
        Object.defineProperty(Game.prototype, "_requests", {
            get: $util.oneOfGetter($oneOfFields = ["requests"]),
            set: $util.oneOfSetter($oneOfFields)
        });
    
        /**
         * Game _hand.
         * @member {"hand"|undefined} _hand
         * @memberof Game
         * @instance
         */
        Object.defineProperty(Game.prototype, "_hand", {
            get: $util.oneOfGetter($oneOfFields = ["hand"]),
            set: $util.oneOfSetter($oneOfFields)
        });
    
        /**
         * Game _seed.
         * @member {"seed"|undefined} _seed
         * @memberof Game
         * @instance
         */
        Object.defineProperty(Game.prototype, "_seed", {
            get: $util.oneOfGetter($oneOfFields = ["seed"]),
            set: $util.oneOfSetter($oneOfFields)
        });
    
        /**
         * Creates a new Game instance using the specified properties.
         * @function create
         * @memberof Game
         * @static
         * @param {IGame=} [properties] Properties to set
         * @returns {Game} Game instance
         */
        Game.create = function create(properties) {
            return new Game(properties);
        };
    
        /**
         * Encodes the specified Game message. Does not implicitly {@link Game.verify|verify} messages.
         * @function encode
         * @memberof Game
         * @static
         * @param {IGame} message Game message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Game.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            if (message.ownerId != null && Object.hasOwnProperty.call(message, "ownerId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.ownerId);
            if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.status);
            if (message.seats != null && message.seats.length)
                for (var i = 0; i < message.seats.length; ++i)
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.seats[i]);
            if (message.players != null && Object.hasOwnProperty.call(message, "players"))
                for (var keys = Object.keys(message.players), i = 0; i < keys.length; ++i) {
                    writer.uint32(/* id 5, wireType 2 =*/42).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                    $root.GamePlayer.encode(message.players[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                }
            if (message.onlinePlayers != null && message.onlinePlayers.length)
                for (var i = 0; i < message.onlinePlayers.length; ++i)
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.onlinePlayers[i]);
            if (message.dealerSeat != null && Object.hasOwnProperty.call(message, "dealerSeat"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.dealerSeat);
            if (message.settings != null && Object.hasOwnProperty.call(message, "settings"))
                $root.GameSettings.encode(message.settings, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            if (message.requests != null && Object.hasOwnProperty.call(message, "requests"))
                $root.GameRequests.encode(message.requests, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
            if (message.time != null && Object.hasOwnProperty.call(message, "time"))
                writer.uint32(/* id 10, wireType 0 =*/80).int64(message.time);
            if (message.hand != null && Object.hasOwnProperty.call(message, "hand"))
                $root.GameHand.encode(message.hand, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
            if (message.noHand != null && Object.hasOwnProperty.call(message, "noHand"))
                writer.uint32(/* id 12, wireType 0 =*/96).bool(message.noHand);
            if (message.seed != null && Object.hasOwnProperty.call(message, "seed"))
                writer.uint32(/* id 13, wireType 2 =*/106).string(message.seed);
            return writer;
        };
    
        /**
         * Encodes the specified Game message, length delimited. Does not implicitly {@link Game.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Game
         * @static
         * @param {IGame} message Game message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Game.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a Game message from the specified reader or buffer.
         * @function decode
         * @memberof Game
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Game} Game
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Game.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Game(), key, value;
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.string();
                        break;
                    }
                case 2: {
                        message.ownerId = reader.string();
                        break;
                    }
                case 3: {
                        message.status = reader.string();
                        break;
                    }
                case 4: {
                        if (!(message.seats && message.seats.length))
                            message.seats = [];
                        message.seats.push(reader.string());
                        break;
                    }
                case 5: {
                        if (message.players === $util.emptyObject)
                            message.players = {};
                        var end2 = reader.uint32() + reader.pos;
                        key = "";
                        value = null;
                        while (reader.pos < end2) {
                            var tag2 = reader.uint32();
                            switch (tag2 >>> 3) {
                            case 1:
                                key = reader.string();
                                break;
                            case 2:
                                value = $root.GamePlayer.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag2 & 7);
                                break;
                            }
                        }
                        message.players[key] = value;
                        break;
                    }
                case 6: {
                        if (!(message.onlinePlayers && message.onlinePlayers.length))
                            message.onlinePlayers = [];
                        message.onlinePlayers.push(reader.string());
                        break;
                    }
                case 7: {
                        message.dealerSeat = reader.int32();
                        break;
                    }
                case 8: {
                        message.settings = $root.GameSettings.decode(reader, reader.uint32());
                        break;
                    }
                case 9: {
                        message.requests = $root.GameRequests.decode(reader, reader.uint32());
                        break;
                    }
                case 10: {
                        message.time = reader.int64();
                        break;
                    }
                case 11: {
                        message.hand = $root.GameHand.decode(reader, reader.uint32());
                        break;
                    }
                case 12: {
                        message.noHand = reader.bool();
                        break;
                    }
                case 13: {
                        message.seed = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a Game message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Game
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Game} Game
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Game.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a Game message.
         * @function verify
         * @memberof Game
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Game.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.ownerId != null && message.hasOwnProperty("ownerId")) {
                properties._ownerId = 1;
                if (!$util.isString(message.ownerId))
                    return "ownerId: string expected";
            }
            if (message.status != null && message.hasOwnProperty("status")) {
                properties._status = 1;
                if (!$util.isString(message.status))
                    return "status: string expected";
            }
            if (message.seats != null && message.hasOwnProperty("seats")) {
                if (!Array.isArray(message.seats))
                    return "seats: array expected";
                for (var i = 0; i < message.seats.length; ++i)
                    if (!$util.isString(message.seats[i]))
                        return "seats: string[] expected";
            }
            if (message.players != null && message.hasOwnProperty("players")) {
                if (!$util.isObject(message.players))
                    return "players: object expected";
                var key = Object.keys(message.players);
                for (var i = 0; i < key.length; ++i) {
                    var error = $root.GamePlayer.verify(message.players[key[i]]);
                    if (error)
                        return "players." + error;
                }
            }
            if (message.onlinePlayers != null && message.hasOwnProperty("onlinePlayers")) {
                if (!Array.isArray(message.onlinePlayers))
                    return "onlinePlayers: array expected";
                for (var i = 0; i < message.onlinePlayers.length; ++i)
                    if (!$util.isString(message.onlinePlayers[i]))
                        return "onlinePlayers: string[] expected";
            }
            if (message.dealerSeat != null && message.hasOwnProperty("dealerSeat")) {
                properties._dealerSeat = 1;
                if (!$util.isInteger(message.dealerSeat))
                    return "dealerSeat: integer expected";
            }
            if (message.settings != null && message.hasOwnProperty("settings")) {
                properties._settings = 1;
                {
                    var error = $root.GameSettings.verify(message.settings);
                    if (error)
                        return "settings." + error;
                }
            }
            if (message.requests != null && message.hasOwnProperty("requests")) {
                properties._requests = 1;
                {
                    var error = $root.GameRequests.verify(message.requests);
                    if (error)
                        return "requests." + error;
                }
            }
            if (message.time != null && message.hasOwnProperty("time"))
                if (!$util.isInteger(message.time) && !(message.time && $util.isInteger(message.time.low) && $util.isInteger(message.time.high)))
                    return "time: integer|Long expected";
            if (message.hand != null && message.hasOwnProperty("hand")) {
                properties._hand = 1;
                {
                    var error = $root.GameHand.verify(message.hand);
                    if (error)
                        return "hand." + error;
                }
            }
            if (message.noHand != null && message.hasOwnProperty("noHand"))
                if (typeof message.noHand !== "boolean")
                    return "noHand: boolean expected";
            if (message.seed != null && message.hasOwnProperty("seed")) {
                properties._seed = 1;
                if (!$util.isString(message.seed))
                    return "seed: string expected";
            }
            return null;
        };
    
        /**
         * Creates a Game message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Game
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Game} Game
         */
        Game.fromObject = function fromObject(object) {
            if (object instanceof $root.Game)
                return object;
            var message = new $root.Game();
            if (object.id != null)
                message.id = String(object.id);
            if (object.ownerId != null)
                message.ownerId = String(object.ownerId);
            if (object.status != null)
                message.status = String(object.status);
            if (object.seats) {
                if (!Array.isArray(object.seats))
                    throw TypeError(".Game.seats: array expected");
                message.seats = [];
                for (var i = 0; i < object.seats.length; ++i)
                    message.seats[i] = String(object.seats[i]);
            }
            if (object.players) {
                if (typeof object.players !== "object")
                    throw TypeError(".Game.players: object expected");
                message.players = {};
                for (var keys = Object.keys(object.players), i = 0; i < keys.length; ++i) {
                    if (typeof object.players[keys[i]] !== "object")
                        throw TypeError(".Game.players: object expected");
                    message.players[keys[i]] = $root.GamePlayer.fromObject(object.players[keys[i]]);
                }
            }
            if (object.onlinePlayers) {
                if (!Array.isArray(object.onlinePlayers))
                    throw TypeError(".Game.onlinePlayers: array expected");
                message.onlinePlayers = [];
                for (var i = 0; i < object.onlinePlayers.length; ++i)
                    message.onlinePlayers[i] = String(object.onlinePlayers[i]);
            }
            if (object.dealerSeat != null)
                message.dealerSeat = object.dealerSeat | 0;
            if (object.settings != null) {
                if (typeof object.settings !== "object")
                    throw TypeError(".Game.settings: object expected");
                message.settings = $root.GameSettings.fromObject(object.settings);
            }
            if (object.requests != null) {
                if (typeof object.requests !== "object")
                    throw TypeError(".Game.requests: object expected");
                message.requests = $root.GameRequests.fromObject(object.requests);
            }
            if (object.time != null)
                if ($util.Long)
                    (message.time = $util.Long.fromValue(object.time)).unsigned = false;
                else if (typeof object.time === "string")
                    message.time = parseInt(object.time, 10);
                else if (typeof object.time === "number")
                    message.time = object.time;
                else if (typeof object.time === "object")
                    message.time = new $util.LongBits(object.time.low >>> 0, object.time.high >>> 0).toNumber();
            if (object.hand != null) {
                if (typeof object.hand !== "object")
                    throw TypeError(".Game.hand: object expected");
                message.hand = $root.GameHand.fromObject(object.hand);
            }
            if (object.noHand != null)
                message.noHand = Boolean(object.noHand);
            if (object.seed != null)
                message.seed = String(object.seed);
            return message;
        };
    
        /**
         * Creates a plain object from a Game message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Game
         * @static
         * @param {Game} message Game
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Game.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.seats = [];
                object.onlinePlayers = [];
            }
            if (options.objects || options.defaults)
                object.players = {};
            if (options.defaults) {
                object.id = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.time = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.time = options.longs === String ? "0" : 0;
                object.noHand = false;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.ownerId != null && message.hasOwnProperty("ownerId")) {
                object.ownerId = message.ownerId;
                if (options.oneofs)
                    object._ownerId = "ownerId";
            }
            if (message.status != null && message.hasOwnProperty("status")) {
                object.status = message.status;
                if (options.oneofs)
                    object._status = "status";
            }
            if (message.seats && message.seats.length) {
                object.seats = [];
                for (var j = 0; j < message.seats.length; ++j)
                    object.seats[j] = message.seats[j];
            }
            var keys2;
            if (message.players && (keys2 = Object.keys(message.players)).length) {
                object.players = {};
                for (var j = 0; j < keys2.length; ++j)
                    object.players[keys2[j]] = $root.GamePlayer.toObject(message.players[keys2[j]], options);
            }
            if (message.onlinePlayers && message.onlinePlayers.length) {
                object.onlinePlayers = [];
                for (var j = 0; j < message.onlinePlayers.length; ++j)
                    object.onlinePlayers[j] = message.onlinePlayers[j];
            }
            if (message.dealerSeat != null && message.hasOwnProperty("dealerSeat")) {
                object.dealerSeat = message.dealerSeat;
                if (options.oneofs)
                    object._dealerSeat = "dealerSeat";
            }
            if (message.settings != null && message.hasOwnProperty("settings")) {
                object.settings = $root.GameSettings.toObject(message.settings, options);
                if (options.oneofs)
                    object._settings = "settings";
            }
            if (message.requests != null && message.hasOwnProperty("requests")) {
                object.requests = $root.GameRequests.toObject(message.requests, options);
                if (options.oneofs)
                    object._requests = "requests";
            }
            if (message.time != null && message.hasOwnProperty("time"))
                if (typeof message.time === "number")
                    object.time = options.longs === String ? String(message.time) : message.time;
                else
                    object.time = options.longs === String ? $util.Long.prototype.toString.call(message.time) : options.longs === Number ? new $util.LongBits(message.time.low >>> 0, message.time.high >>> 0).toNumber() : message.time;
            if (message.hand != null && message.hasOwnProperty("hand")) {
                object.hand = $root.GameHand.toObject(message.hand, options);
                if (options.oneofs)
                    object._hand = "hand";
            }
            if (message.noHand != null && message.hasOwnProperty("noHand"))
                object.noHand = message.noHand;
            if (message.seed != null && message.hasOwnProperty("seed")) {
                object.seed = message.seed;
                if (options.oneofs)
                    object._seed = "seed";
            }
            return object;
        };
    
        /**
         * Converts this Game to JSON.
         * @function toJSON
         * @memberof Game
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Game.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        /**
         * Gets the default type url for Game
         * @function getTypeUrl
         * @memberof Game
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Game.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/Game";
        };
    
        return Game;
    })();
    
    $root.GameHandUpdate = (function() {
    
        /**
         * Properties of a GameHandUpdate.
         * @exports IGameHandUpdate
         * @interface IGameHandUpdate
         * @property {string|null} [id] GameHandUpdate id
         * @property {number|Long|null} [time] GameHandUpdate time
         * @property {IGameHand|null} [hand] GameHandUpdate hand
         */
    
        /**
         * Constructs a new GameHandUpdate.
         * @exports GameHandUpdate
         * @classdesc Represents a GameHandUpdate.
         * @implements IGameHandUpdate
         * @constructor
         * @param {IGameHandUpdate=} [properties] Properties to set
         */
        function GameHandUpdate(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * GameHandUpdate id.
         * @member {string} id
         * @memberof GameHandUpdate
         * @instance
         */
        GameHandUpdate.prototype.id = "";
    
        /**
         * GameHandUpdate time.
         * @member {number|Long} time
         * @memberof GameHandUpdate
         * @instance
         */
        GameHandUpdate.prototype.time = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
        /**
         * GameHandUpdate hand.
         * @member {IGameHand|null|undefined} hand
         * @memberof GameHandUpdate
         * @instance
         */
        GameHandUpdate.prototype.hand = null;
    
        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;
    
        /**
         * GameHandUpdate _hand.
         * @member {"hand"|undefined} _hand
         * @memberof GameHandUpdate
         * @instance
         */
        Object.defineProperty(GameHandUpdate.prototype, "_hand", {
            get: $util.oneOfGetter($oneOfFields = ["hand"]),
            set: $util.oneOfSetter($oneOfFields)
        });
    
        /**
         * Creates a new GameHandUpdate instance using the specified properties.
         * @function create
         * @memberof GameHandUpdate
         * @static
         * @param {IGameHandUpdate=} [properties] Properties to set
         * @returns {GameHandUpdate} GameHandUpdate instance
         */
        GameHandUpdate.create = function create(properties) {
            return new GameHandUpdate(properties);
        };
    
        /**
         * Encodes the specified GameHandUpdate message. Does not implicitly {@link GameHandUpdate.verify|verify} messages.
         * @function encode
         * @memberof GameHandUpdate
         * @static
         * @param {IGameHandUpdate} message GameHandUpdate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameHandUpdate.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            if (message.time != null && Object.hasOwnProperty.call(message, "time"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.time);
            if (message.hand != null && Object.hasOwnProperty.call(message, "hand"))
                $root.GameHand.encode(message.hand, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };
    
        /**
         * Encodes the specified GameHandUpdate message, length delimited. Does not implicitly {@link GameHandUpdate.verify|verify} messages.
         * @function encodeDelimited
         * @memberof GameHandUpdate
         * @static
         * @param {IGameHandUpdate} message GameHandUpdate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameHandUpdate.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a GameHandUpdate message from the specified reader or buffer.
         * @function decode
         * @memberof GameHandUpdate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {GameHandUpdate} GameHandUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameHandUpdate.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GameHandUpdate();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.string();
                        break;
                    }
                case 2: {
                        message.time = reader.int64();
                        break;
                    }
                case 3: {
                        message.hand = $root.GameHand.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a GameHandUpdate message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof GameHandUpdate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {GameHandUpdate} GameHandUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameHandUpdate.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a GameHandUpdate message.
         * @function verify
         * @memberof GameHandUpdate
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GameHandUpdate.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.time != null && message.hasOwnProperty("time"))
                if (!$util.isInteger(message.time) && !(message.time && $util.isInteger(message.time.low) && $util.isInteger(message.time.high)))
                    return "time: integer|Long expected";
            if (message.hand != null && message.hasOwnProperty("hand")) {
                properties._hand = 1;
                {
                    var error = $root.GameHand.verify(message.hand);
                    if (error)
                        return "hand." + error;
                }
            }
            return null;
        };
    
        /**
         * Creates a GameHandUpdate message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof GameHandUpdate
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {GameHandUpdate} GameHandUpdate
         */
        GameHandUpdate.fromObject = function fromObject(object) {
            if (object instanceof $root.GameHandUpdate)
                return object;
            var message = new $root.GameHandUpdate();
            if (object.id != null)
                message.id = String(object.id);
            if (object.time != null)
                if ($util.Long)
                    (message.time = $util.Long.fromValue(object.time)).unsigned = false;
                else if (typeof object.time === "string")
                    message.time = parseInt(object.time, 10);
                else if (typeof object.time === "number")
                    message.time = object.time;
                else if (typeof object.time === "object")
                    message.time = new $util.LongBits(object.time.low >>> 0, object.time.high >>> 0).toNumber();
            if (object.hand != null) {
                if (typeof object.hand !== "object")
                    throw TypeError(".GameHandUpdate.hand: object expected");
                message.hand = $root.GameHand.fromObject(object.hand);
            }
            return message;
        };
    
        /**
         * Creates a plain object from a GameHandUpdate message. Also converts values to other types if specified.
         * @function toObject
         * @memberof GameHandUpdate
         * @static
         * @param {GameHandUpdate} message GameHandUpdate
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GameHandUpdate.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.id = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.time = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.time = options.longs === String ? "0" : 0;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.time != null && message.hasOwnProperty("time"))
                if (typeof message.time === "number")
                    object.time = options.longs === String ? String(message.time) : message.time;
                else
                    object.time = options.longs === String ? $util.Long.prototype.toString.call(message.time) : options.longs === Number ? new $util.LongBits(message.time.low >>> 0, message.time.high >>> 0).toNumber() : message.time;
            if (message.hand != null && message.hasOwnProperty("hand")) {
                object.hand = $root.GameHand.toObject(message.hand, options);
                if (options.oneofs)
                    object._hand = "hand";
            }
            return object;
        };
    
        /**
         * Converts this GameHandUpdate to JSON.
         * @function toJSON
         * @memberof GameHandUpdate
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GameHandUpdate.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        /**
         * Gets the default type url for GameHandUpdate
         * @function getTypeUrl
         * @memberof GameHandUpdate
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GameHandUpdate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/GameHandUpdate";
        };
    
        return GameHandUpdate;
    })();

    return $root;
});
