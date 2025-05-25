/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.battletanks = (function() {

    /**
     * Namespace battletanks.
     * @exports battletanks
     * @namespace
     */
    var battletanks = {};

    battletanks.Vector3 = (function() {

        /**
         * Properties of a Vector3.
         * @memberof battletanks
         * @interface IVector3
         * @property {number|null} [x] Vector3 x
         * @property {number|null} [y] Vector3 y
         * @property {number|null} [z] Vector3 z
         */

        /**
         * Constructs a new Vector3.
         * @memberof battletanks
         * @classdesc Represents a Vector3.
         * @implements IVector3
         * @constructor
         * @param {battletanks.IVector3=} [properties] Properties to set
         */
        function Vector3(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Vector3 x.
         * @member {number} x
         * @memberof battletanks.Vector3
         * @instance
         */
        Vector3.prototype.x = 0;

        /**
         * Vector3 y.
         * @member {number} y
         * @memberof battletanks.Vector3
         * @instance
         */
        Vector3.prototype.y = 0;

        /**
         * Vector3 z.
         * @member {number} z
         * @memberof battletanks.Vector3
         * @instance
         */
        Vector3.prototype.z = 0;

        /**
         * Creates a new Vector3 instance using the specified properties.
         * @function create
         * @memberof battletanks.Vector3
         * @static
         * @param {battletanks.IVector3=} [properties] Properties to set
         * @returns {battletanks.Vector3} Vector3 instance
         */
        Vector3.create = function create(properties) {
            return new Vector3(properties);
        };

        /**
         * Encodes the specified Vector3 message. Does not implicitly {@link battletanks.Vector3.verify|verify} messages.
         * @function encode
         * @memberof battletanks.Vector3
         * @static
         * @param {battletanks.IVector3} message Vector3 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Vector3.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                writer.uint32(/* id 1, wireType 5 =*/13).float(message.x);
            if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                writer.uint32(/* id 2, wireType 5 =*/21).float(message.y);
            if (message.z != null && Object.hasOwnProperty.call(message, "z"))
                writer.uint32(/* id 3, wireType 5 =*/29).float(message.z);
            return writer;
        };

        /**
         * Encodes the specified Vector3 message, length delimited. Does not implicitly {@link battletanks.Vector3.verify|verify} messages.
         * @function encodeDelimited
         * @memberof battletanks.Vector3
         * @static
         * @param {battletanks.IVector3} message Vector3 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Vector3.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Vector3 message from the specified reader or buffer.
         * @function decode
         * @memberof battletanks.Vector3
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {battletanks.Vector3} Vector3
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Vector3.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.battletanks.Vector3();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.x = reader.float();
                        break;
                    }
                case 2: {
                        message.y = reader.float();
                        break;
                    }
                case 3: {
                        message.z = reader.float();
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
         * Decodes a Vector3 message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof battletanks.Vector3
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {battletanks.Vector3} Vector3
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Vector3.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Vector3 message.
         * @function verify
         * @memberof battletanks.Vector3
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Vector3.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.x != null && message.hasOwnProperty("x"))
                if (typeof message.x !== "number")
                    return "x: number expected";
            if (message.y != null && message.hasOwnProperty("y"))
                if (typeof message.y !== "number")
                    return "y: number expected";
            if (message.z != null && message.hasOwnProperty("z"))
                if (typeof message.z !== "number")
                    return "z: number expected";
            return null;
        };

        /**
         * Creates a Vector3 message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof battletanks.Vector3
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {battletanks.Vector3} Vector3
         */
        Vector3.fromObject = function fromObject(object) {
            if (object instanceof $root.battletanks.Vector3)
                return object;
            var message = new $root.battletanks.Vector3();
            if (object.x != null)
                message.x = Number(object.x);
            if (object.y != null)
                message.y = Number(object.y);
            if (object.z != null)
                message.z = Number(object.z);
            return message;
        };

        /**
         * Creates a plain object from a Vector3 message. Also converts values to other types if specified.
         * @function toObject
         * @memberof battletanks.Vector3
         * @static
         * @param {battletanks.Vector3} message Vector3
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Vector3.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.x = 0;
                object.y = 0;
                object.z = 0;
            }
            if (message.x != null && message.hasOwnProperty("x"))
                object.x = options.json && !isFinite(message.x) ? String(message.x) : message.x;
            if (message.y != null && message.hasOwnProperty("y"))
                object.y = options.json && !isFinite(message.y) ? String(message.y) : message.y;
            if (message.z != null && message.hasOwnProperty("z"))
                object.z = options.json && !isFinite(message.z) ? String(message.z) : message.z;
            return object;
        };

        /**
         * Converts this Vector3 to JSON.
         * @function toJSON
         * @memberof battletanks.Vector3
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Vector3.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Vector3
         * @function getTypeUrl
         * @memberof battletanks.Vector3
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Vector3.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/battletanks.Vector3";
        };

        return Vector3;
    })();

    battletanks.Vector2 = (function() {

        /**
         * Properties of a Vector2.
         * @memberof battletanks
         * @interface IVector2
         * @property {number|null} [x] Vector2 x
         * @property {number|null} [y] Vector2 y
         */

        /**
         * Constructs a new Vector2.
         * @memberof battletanks
         * @classdesc Represents a Vector2.
         * @implements IVector2
         * @constructor
         * @param {battletanks.IVector2=} [properties] Properties to set
         */
        function Vector2(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Vector2 x.
         * @member {number} x
         * @memberof battletanks.Vector2
         * @instance
         */
        Vector2.prototype.x = 0;

        /**
         * Vector2 y.
         * @member {number} y
         * @memberof battletanks.Vector2
         * @instance
         */
        Vector2.prototype.y = 0;

        /**
         * Creates a new Vector2 instance using the specified properties.
         * @function create
         * @memberof battletanks.Vector2
         * @static
         * @param {battletanks.IVector2=} [properties] Properties to set
         * @returns {battletanks.Vector2} Vector2 instance
         */
        Vector2.create = function create(properties) {
            return new Vector2(properties);
        };

        /**
         * Encodes the specified Vector2 message. Does not implicitly {@link battletanks.Vector2.verify|verify} messages.
         * @function encode
         * @memberof battletanks.Vector2
         * @static
         * @param {battletanks.IVector2} message Vector2 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Vector2.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                writer.uint32(/* id 1, wireType 5 =*/13).float(message.x);
            if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                writer.uint32(/* id 2, wireType 5 =*/21).float(message.y);
            return writer;
        };

        /**
         * Encodes the specified Vector2 message, length delimited. Does not implicitly {@link battletanks.Vector2.verify|verify} messages.
         * @function encodeDelimited
         * @memberof battletanks.Vector2
         * @static
         * @param {battletanks.IVector2} message Vector2 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Vector2.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Vector2 message from the specified reader or buffer.
         * @function decode
         * @memberof battletanks.Vector2
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {battletanks.Vector2} Vector2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Vector2.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.battletanks.Vector2();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.x = reader.float();
                        break;
                    }
                case 2: {
                        message.y = reader.float();
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
         * Decodes a Vector2 message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof battletanks.Vector2
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {battletanks.Vector2} Vector2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Vector2.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Vector2 message.
         * @function verify
         * @memberof battletanks.Vector2
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Vector2.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.x != null && message.hasOwnProperty("x"))
                if (typeof message.x !== "number")
                    return "x: number expected";
            if (message.y != null && message.hasOwnProperty("y"))
                if (typeof message.y !== "number")
                    return "y: number expected";
            return null;
        };

        /**
         * Creates a Vector2 message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof battletanks.Vector2
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {battletanks.Vector2} Vector2
         */
        Vector2.fromObject = function fromObject(object) {
            if (object instanceof $root.battletanks.Vector2)
                return object;
            var message = new $root.battletanks.Vector2();
            if (object.x != null)
                message.x = Number(object.x);
            if (object.y != null)
                message.y = Number(object.y);
            return message;
        };

        /**
         * Creates a plain object from a Vector2 message. Also converts values to other types if specified.
         * @function toObject
         * @memberof battletanks.Vector2
         * @static
         * @param {battletanks.Vector2} message Vector2
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Vector2.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.x = 0;
                object.y = 0;
            }
            if (message.x != null && message.hasOwnProperty("x"))
                object.x = options.json && !isFinite(message.x) ? String(message.x) : message.x;
            if (message.y != null && message.hasOwnProperty("y"))
                object.y = options.json && !isFinite(message.y) ? String(message.y) : message.y;
            return object;
        };

        /**
         * Converts this Vector2 to JSON.
         * @function toJSON
         * @memberof battletanks.Vector2
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Vector2.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Vector2
         * @function getTypeUrl
         * @memberof battletanks.Vector2
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Vector2.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/battletanks.Vector2";
        };

        return Vector2;
    })();

    /**
     * TeamColor enum.
     * @name battletanks.TeamColor
     * @enum {number}
     * @property {number} TEAM_NEUTRAL=0 TEAM_NEUTRAL value
     * @property {number} TEAM_RED=1 TEAM_RED value
     * @property {number} TEAM_BLUE=2 TEAM_BLUE value
     * @property {number} TEAM_NPC=3 TEAM_NPC value
     */
    battletanks.TeamColor = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "TEAM_NEUTRAL"] = 0;
        values[valuesById[1] = "TEAM_RED"] = 1;
        values[valuesById[2] = "TEAM_BLUE"] = 2;
        values[valuesById[3] = "TEAM_NPC"] = 3;
        return values;
    })();

    /**
     * PowerUpType enum.
     * @name battletanks.PowerUpType
     * @enum {number}
     * @property {number} POWER_UP_NONE=0 POWER_UP_NONE value
     * @property {number} POWER_UP_SHIELD=1 POWER_UP_SHIELD value
     * @property {number} POWER_UP_CLOAK=2 POWER_UP_CLOAK value
     * @property {number} POWER_UP_SPEED=3 POWER_UP_SPEED value
     * @property {number} POWER_UP_RAPID_FIRE=4 POWER_UP_RAPID_FIRE value
     */
    battletanks.PowerUpType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "POWER_UP_NONE"] = 0;
        values[valuesById[1] = "POWER_UP_SHIELD"] = 1;
        values[valuesById[2] = "POWER_UP_CLOAK"] = 2;
        values[valuesById[3] = "POWER_UP_SPEED"] = 3;
        values[valuesById[4] = "POWER_UP_RAPID_FIRE"] = 4;
        return values;
    })();

    battletanks.PlayerInput = (function() {

        /**
         * Properties of a PlayerInput.
         * @memberof battletanks
         * @interface IPlayerInput
         * @property {boolean|null} [forward] PlayerInput forward
         * @property {boolean|null} [backward] PlayerInput backward
         * @property {boolean|null} [rotateLeft] PlayerInput rotateLeft
         * @property {boolean|null} [rotateRight] PlayerInput rotateRight
         * @property {boolean|null} [fire] PlayerInput fire
         * @property {number|null} [turretAngle] PlayerInput turretAngle
         * @property {number|Long|null} [timestamp] PlayerInput timestamp
         * @property {number|null} [sequenceNumber] PlayerInput sequenceNumber
         */

        /**
         * Constructs a new PlayerInput.
         * @memberof battletanks
         * @classdesc Represents a PlayerInput.
         * @implements IPlayerInput
         * @constructor
         * @param {battletanks.IPlayerInput=} [properties] Properties to set
         */
        function PlayerInput(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PlayerInput forward.
         * @member {boolean} forward
         * @memberof battletanks.PlayerInput
         * @instance
         */
        PlayerInput.prototype.forward = false;

        /**
         * PlayerInput backward.
         * @member {boolean} backward
         * @memberof battletanks.PlayerInput
         * @instance
         */
        PlayerInput.prototype.backward = false;

        /**
         * PlayerInput rotateLeft.
         * @member {boolean} rotateLeft
         * @memberof battletanks.PlayerInput
         * @instance
         */
        PlayerInput.prototype.rotateLeft = false;

        /**
         * PlayerInput rotateRight.
         * @member {boolean} rotateRight
         * @memberof battletanks.PlayerInput
         * @instance
         */
        PlayerInput.prototype.rotateRight = false;

        /**
         * PlayerInput fire.
         * @member {boolean} fire
         * @memberof battletanks.PlayerInput
         * @instance
         */
        PlayerInput.prototype.fire = false;

        /**
         * PlayerInput turretAngle.
         * @member {number} turretAngle
         * @memberof battletanks.PlayerInput
         * @instance
         */
        PlayerInput.prototype.turretAngle = 0;

        /**
         * PlayerInput timestamp.
         * @member {number|Long} timestamp
         * @memberof battletanks.PlayerInput
         * @instance
         */
        PlayerInput.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * PlayerInput sequenceNumber.
         * @member {number} sequenceNumber
         * @memberof battletanks.PlayerInput
         * @instance
         */
        PlayerInput.prototype.sequenceNumber = 0;

        /**
         * Creates a new PlayerInput instance using the specified properties.
         * @function create
         * @memberof battletanks.PlayerInput
         * @static
         * @param {battletanks.IPlayerInput=} [properties] Properties to set
         * @returns {battletanks.PlayerInput} PlayerInput instance
         */
        PlayerInput.create = function create(properties) {
            return new PlayerInput(properties);
        };

        /**
         * Encodes the specified PlayerInput message. Does not implicitly {@link battletanks.PlayerInput.verify|verify} messages.
         * @function encode
         * @memberof battletanks.PlayerInput
         * @static
         * @param {battletanks.IPlayerInput} message PlayerInput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerInput.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.forward != null && Object.hasOwnProperty.call(message, "forward"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.forward);
            if (message.backward != null && Object.hasOwnProperty.call(message, "backward"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.backward);
            if (message.rotateLeft != null && Object.hasOwnProperty.call(message, "rotateLeft"))
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.rotateLeft);
            if (message.rotateRight != null && Object.hasOwnProperty.call(message, "rotateRight"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.rotateRight);
            if (message.fire != null && Object.hasOwnProperty.call(message, "fire"))
                writer.uint32(/* id 5, wireType 0 =*/40).bool(message.fire);
            if (message.turretAngle != null && Object.hasOwnProperty.call(message, "turretAngle"))
                writer.uint32(/* id 6, wireType 5 =*/53).float(message.turretAngle);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 7, wireType 0 =*/56).uint64(message.timestamp);
            if (message.sequenceNumber != null && Object.hasOwnProperty.call(message, "sequenceNumber"))
                writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.sequenceNumber);
            return writer;
        };

        /**
         * Encodes the specified PlayerInput message, length delimited. Does not implicitly {@link battletanks.PlayerInput.verify|verify} messages.
         * @function encodeDelimited
         * @memberof battletanks.PlayerInput
         * @static
         * @param {battletanks.IPlayerInput} message PlayerInput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerInput.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PlayerInput message from the specified reader or buffer.
         * @function decode
         * @memberof battletanks.PlayerInput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {battletanks.PlayerInput} PlayerInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerInput.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.battletanks.PlayerInput();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.forward = reader.bool();
                        break;
                    }
                case 2: {
                        message.backward = reader.bool();
                        break;
                    }
                case 3: {
                        message.rotateLeft = reader.bool();
                        break;
                    }
                case 4: {
                        message.rotateRight = reader.bool();
                        break;
                    }
                case 5: {
                        message.fire = reader.bool();
                        break;
                    }
                case 6: {
                        message.turretAngle = reader.float();
                        break;
                    }
                case 7: {
                        message.timestamp = reader.uint64();
                        break;
                    }
                case 8: {
                        message.sequenceNumber = reader.uint32();
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
         * Decodes a PlayerInput message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof battletanks.PlayerInput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {battletanks.PlayerInput} PlayerInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerInput.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PlayerInput message.
         * @function verify
         * @memberof battletanks.PlayerInput
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PlayerInput.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.forward != null && message.hasOwnProperty("forward"))
                if (typeof message.forward !== "boolean")
                    return "forward: boolean expected";
            if (message.backward != null && message.hasOwnProperty("backward"))
                if (typeof message.backward !== "boolean")
                    return "backward: boolean expected";
            if (message.rotateLeft != null && message.hasOwnProperty("rotateLeft"))
                if (typeof message.rotateLeft !== "boolean")
                    return "rotateLeft: boolean expected";
            if (message.rotateRight != null && message.hasOwnProperty("rotateRight"))
                if (typeof message.rotateRight !== "boolean")
                    return "rotateRight: boolean expected";
            if (message.fire != null && message.hasOwnProperty("fire"))
                if (typeof message.fire !== "boolean")
                    return "fire: boolean expected";
            if (message.turretAngle != null && message.hasOwnProperty("turretAngle"))
                if (typeof message.turretAngle !== "number")
                    return "turretAngle: number expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.sequenceNumber != null && message.hasOwnProperty("sequenceNumber"))
                if (!$util.isInteger(message.sequenceNumber))
                    return "sequenceNumber: integer expected";
            return null;
        };

        /**
         * Creates a PlayerInput message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof battletanks.PlayerInput
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {battletanks.PlayerInput} PlayerInput
         */
        PlayerInput.fromObject = function fromObject(object) {
            if (object instanceof $root.battletanks.PlayerInput)
                return object;
            var message = new $root.battletanks.PlayerInput();
            if (object.forward != null)
                message.forward = Boolean(object.forward);
            if (object.backward != null)
                message.backward = Boolean(object.backward);
            if (object.rotateLeft != null)
                message.rotateLeft = Boolean(object.rotateLeft);
            if (object.rotateRight != null)
                message.rotateRight = Boolean(object.rotateRight);
            if (object.fire != null)
                message.fire = Boolean(object.fire);
            if (object.turretAngle != null)
                message.turretAngle = Number(object.turretAngle);
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = true;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber(true);
            if (object.sequenceNumber != null)
                message.sequenceNumber = object.sequenceNumber >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a PlayerInput message. Also converts values to other types if specified.
         * @function toObject
         * @memberof battletanks.PlayerInput
         * @static
         * @param {battletanks.PlayerInput} message PlayerInput
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PlayerInput.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.forward = false;
                object.backward = false;
                object.rotateLeft = false;
                object.rotateRight = false;
                object.fire = false;
                object.turretAngle = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
                object.sequenceNumber = 0;
            }
            if (message.forward != null && message.hasOwnProperty("forward"))
                object.forward = message.forward;
            if (message.backward != null && message.hasOwnProperty("backward"))
                object.backward = message.backward;
            if (message.rotateLeft != null && message.hasOwnProperty("rotateLeft"))
                object.rotateLeft = message.rotateLeft;
            if (message.rotateRight != null && message.hasOwnProperty("rotateRight"))
                object.rotateRight = message.rotateRight;
            if (message.fire != null && message.hasOwnProperty("fire"))
                object.fire = message.fire;
            if (message.turretAngle != null && message.hasOwnProperty("turretAngle"))
                object.turretAngle = options.json && !isFinite(message.turretAngle) ? String(message.turretAngle) : message.turretAngle;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber(true) : message.timestamp;
            if (message.sequenceNumber != null && message.hasOwnProperty("sequenceNumber"))
                object.sequenceNumber = message.sequenceNumber;
            return object;
        };

        /**
         * Converts this PlayerInput to JSON.
         * @function toJSON
         * @memberof battletanks.PlayerInput
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PlayerInput.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for PlayerInput
         * @function getTypeUrl
         * @memberof battletanks.PlayerInput
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        PlayerInput.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/battletanks.PlayerInput";
        };

        return PlayerInput;
    })();

    battletanks.TankState = (function() {

        /**
         * Properties of a TankState.
         * @memberof battletanks
         * @interface ITankState
         * @property {number|null} [entityId] TankState entityId
         * @property {string|null} [playerId] TankState playerId
         * @property {string|null} [displayName] TankState displayName
         * @property {battletanks.IVector3|null} [position] TankState position
         * @property {number|null} [bodyRotation] TankState bodyRotation
         * @property {number|null} [turretRotation] TankState turretRotation
         * @property {number|null} [health] TankState health
         * @property {number|null} [maxHealth] TankState maxHealth
         * @property {battletanks.TeamColor|null} [team] TankState team
         * @property {Array.<battletanks.IActivePowerUp>|null} [activePowerups] TankState activePowerups
         * @property {boolean|null} [isInvulnerable] TankState isInvulnerable
         * @property {number|null} [invulnerabilityRemaining] TankState invulnerabilityRemaining
         */

        /**
         * Constructs a new TankState.
         * @memberof battletanks
         * @classdesc Represents a TankState.
         * @implements ITankState
         * @constructor
         * @param {battletanks.ITankState=} [properties] Properties to set
         */
        function TankState(properties) {
            this.activePowerups = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TankState entityId.
         * @member {number} entityId
         * @memberof battletanks.TankState
         * @instance
         */
        TankState.prototype.entityId = 0;

        /**
         * TankState playerId.
         * @member {string} playerId
         * @memberof battletanks.TankState
         * @instance
         */
        TankState.prototype.playerId = "";

        /**
         * TankState displayName.
         * @member {string} displayName
         * @memberof battletanks.TankState
         * @instance
         */
        TankState.prototype.displayName = "";

        /**
         * TankState position.
         * @member {battletanks.IVector3|null|undefined} position
         * @memberof battletanks.TankState
         * @instance
         */
        TankState.prototype.position = null;

        /**
         * TankState bodyRotation.
         * @member {number} bodyRotation
         * @memberof battletanks.TankState
         * @instance
         */
        TankState.prototype.bodyRotation = 0;

        /**
         * TankState turretRotation.
         * @member {number} turretRotation
         * @memberof battletanks.TankState
         * @instance
         */
        TankState.prototype.turretRotation = 0;

        /**
         * TankState health.
         * @member {number} health
         * @memberof battletanks.TankState
         * @instance
         */
        TankState.prototype.health = 0;

        /**
         * TankState maxHealth.
         * @member {number} maxHealth
         * @memberof battletanks.TankState
         * @instance
         */
        TankState.prototype.maxHealth = 0;

        /**
         * TankState team.
         * @member {battletanks.TeamColor} team
         * @memberof battletanks.TankState
         * @instance
         */
        TankState.prototype.team = 0;

        /**
         * TankState activePowerups.
         * @member {Array.<battletanks.IActivePowerUp>} activePowerups
         * @memberof battletanks.TankState
         * @instance
         */
        TankState.prototype.activePowerups = $util.emptyArray;

        /**
         * TankState isInvulnerable.
         * @member {boolean} isInvulnerable
         * @memberof battletanks.TankState
         * @instance
         */
        TankState.prototype.isInvulnerable = false;

        /**
         * TankState invulnerabilityRemaining.
         * @member {number} invulnerabilityRemaining
         * @memberof battletanks.TankState
         * @instance
         */
        TankState.prototype.invulnerabilityRemaining = 0;

        /**
         * Creates a new TankState instance using the specified properties.
         * @function create
         * @memberof battletanks.TankState
         * @static
         * @param {battletanks.ITankState=} [properties] Properties to set
         * @returns {battletanks.TankState} TankState instance
         */
        TankState.create = function create(properties) {
            return new TankState(properties);
        };

        /**
         * Encodes the specified TankState message. Does not implicitly {@link battletanks.TankState.verify|verify} messages.
         * @function encode
         * @memberof battletanks.TankState
         * @static
         * @param {battletanks.ITankState} message TankState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TankState.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.entityId != null && Object.hasOwnProperty.call(message, "entityId"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.entityId);
            if (message.playerId != null && Object.hasOwnProperty.call(message, "playerId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.playerId);
            if (message.displayName != null && Object.hasOwnProperty.call(message, "displayName"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.displayName);
            if (message.position != null && Object.hasOwnProperty.call(message, "position"))
                $root.battletanks.Vector3.encode(message.position, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.bodyRotation != null && Object.hasOwnProperty.call(message, "bodyRotation"))
                writer.uint32(/* id 5, wireType 5 =*/45).float(message.bodyRotation);
            if (message.turretRotation != null && Object.hasOwnProperty.call(message, "turretRotation"))
                writer.uint32(/* id 6, wireType 5 =*/53).float(message.turretRotation);
            if (message.health != null && Object.hasOwnProperty.call(message, "health"))
                writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.health);
            if (message.maxHealth != null && Object.hasOwnProperty.call(message, "maxHealth"))
                writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.maxHealth);
            if (message.team != null && Object.hasOwnProperty.call(message, "team"))
                writer.uint32(/* id 9, wireType 0 =*/72).int32(message.team);
            if (message.activePowerups != null && message.activePowerups.length)
                for (var i = 0; i < message.activePowerups.length; ++i)
                    $root.battletanks.ActivePowerUp.encode(message.activePowerups[i], writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
            if (message.isInvulnerable != null && Object.hasOwnProperty.call(message, "isInvulnerable"))
                writer.uint32(/* id 11, wireType 0 =*/88).bool(message.isInvulnerable);
            if (message.invulnerabilityRemaining != null && Object.hasOwnProperty.call(message, "invulnerabilityRemaining"))
                writer.uint32(/* id 12, wireType 5 =*/101).float(message.invulnerabilityRemaining);
            return writer;
        };

        /**
         * Encodes the specified TankState message, length delimited. Does not implicitly {@link battletanks.TankState.verify|verify} messages.
         * @function encodeDelimited
         * @memberof battletanks.TankState
         * @static
         * @param {battletanks.ITankState} message TankState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TankState.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TankState message from the specified reader or buffer.
         * @function decode
         * @memberof battletanks.TankState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {battletanks.TankState} TankState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TankState.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.battletanks.TankState();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.entityId = reader.uint32();
                        break;
                    }
                case 2: {
                        message.playerId = reader.string();
                        break;
                    }
                case 3: {
                        message.displayName = reader.string();
                        break;
                    }
                case 4: {
                        message.position = $root.battletanks.Vector3.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.bodyRotation = reader.float();
                        break;
                    }
                case 6: {
                        message.turretRotation = reader.float();
                        break;
                    }
                case 7: {
                        message.health = reader.uint32();
                        break;
                    }
                case 8: {
                        message.maxHealth = reader.uint32();
                        break;
                    }
                case 9: {
                        message.team = reader.int32();
                        break;
                    }
                case 10: {
                        if (!(message.activePowerups && message.activePowerups.length))
                            message.activePowerups = [];
                        message.activePowerups.push($root.battletanks.ActivePowerUp.decode(reader, reader.uint32()));
                        break;
                    }
                case 11: {
                        message.isInvulnerable = reader.bool();
                        break;
                    }
                case 12: {
                        message.invulnerabilityRemaining = reader.float();
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
         * Decodes a TankState message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof battletanks.TankState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {battletanks.TankState} TankState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TankState.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TankState message.
         * @function verify
         * @memberof battletanks.TankState
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TankState.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.entityId != null && message.hasOwnProperty("entityId"))
                if (!$util.isInteger(message.entityId))
                    return "entityId: integer expected";
            if (message.playerId != null && message.hasOwnProperty("playerId"))
                if (!$util.isString(message.playerId))
                    return "playerId: string expected";
            if (message.displayName != null && message.hasOwnProperty("displayName"))
                if (!$util.isString(message.displayName))
                    return "displayName: string expected";
            if (message.position != null && message.hasOwnProperty("position")) {
                var error = $root.battletanks.Vector3.verify(message.position);
                if (error)
                    return "position." + error;
            }
            if (message.bodyRotation != null && message.hasOwnProperty("bodyRotation"))
                if (typeof message.bodyRotation !== "number")
                    return "bodyRotation: number expected";
            if (message.turretRotation != null && message.hasOwnProperty("turretRotation"))
                if (typeof message.turretRotation !== "number")
                    return "turretRotation: number expected";
            if (message.health != null && message.hasOwnProperty("health"))
                if (!$util.isInteger(message.health))
                    return "health: integer expected";
            if (message.maxHealth != null && message.hasOwnProperty("maxHealth"))
                if (!$util.isInteger(message.maxHealth))
                    return "maxHealth: integer expected";
            if (message.team != null && message.hasOwnProperty("team"))
                switch (message.team) {
                default:
                    return "team: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.activePowerups != null && message.hasOwnProperty("activePowerups")) {
                if (!Array.isArray(message.activePowerups))
                    return "activePowerups: array expected";
                for (var i = 0; i < message.activePowerups.length; ++i) {
                    var error = $root.battletanks.ActivePowerUp.verify(message.activePowerups[i]);
                    if (error)
                        return "activePowerups." + error;
                }
            }
            if (message.isInvulnerable != null && message.hasOwnProperty("isInvulnerable"))
                if (typeof message.isInvulnerable !== "boolean")
                    return "isInvulnerable: boolean expected";
            if (message.invulnerabilityRemaining != null && message.hasOwnProperty("invulnerabilityRemaining"))
                if (typeof message.invulnerabilityRemaining !== "number")
                    return "invulnerabilityRemaining: number expected";
            return null;
        };

        /**
         * Creates a TankState message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof battletanks.TankState
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {battletanks.TankState} TankState
         */
        TankState.fromObject = function fromObject(object) {
            if (object instanceof $root.battletanks.TankState)
                return object;
            var message = new $root.battletanks.TankState();
            if (object.entityId != null)
                message.entityId = object.entityId >>> 0;
            if (object.playerId != null)
                message.playerId = String(object.playerId);
            if (object.displayName != null)
                message.displayName = String(object.displayName);
            if (object.position != null) {
                if (typeof object.position !== "object")
                    throw TypeError(".battletanks.TankState.position: object expected");
                message.position = $root.battletanks.Vector3.fromObject(object.position);
            }
            if (object.bodyRotation != null)
                message.bodyRotation = Number(object.bodyRotation);
            if (object.turretRotation != null)
                message.turretRotation = Number(object.turretRotation);
            if (object.health != null)
                message.health = object.health >>> 0;
            if (object.maxHealth != null)
                message.maxHealth = object.maxHealth >>> 0;
            switch (object.team) {
            default:
                if (typeof object.team === "number") {
                    message.team = object.team;
                    break;
                }
                break;
            case "TEAM_NEUTRAL":
            case 0:
                message.team = 0;
                break;
            case "TEAM_RED":
            case 1:
                message.team = 1;
                break;
            case "TEAM_BLUE":
            case 2:
                message.team = 2;
                break;
            case "TEAM_NPC":
            case 3:
                message.team = 3;
                break;
            }
            if (object.activePowerups) {
                if (!Array.isArray(object.activePowerups))
                    throw TypeError(".battletanks.TankState.activePowerups: array expected");
                message.activePowerups = [];
                for (var i = 0; i < object.activePowerups.length; ++i) {
                    if (typeof object.activePowerups[i] !== "object")
                        throw TypeError(".battletanks.TankState.activePowerups: object expected");
                    message.activePowerups[i] = $root.battletanks.ActivePowerUp.fromObject(object.activePowerups[i]);
                }
            }
            if (object.isInvulnerable != null)
                message.isInvulnerable = Boolean(object.isInvulnerable);
            if (object.invulnerabilityRemaining != null)
                message.invulnerabilityRemaining = Number(object.invulnerabilityRemaining);
            return message;
        };

        /**
         * Creates a plain object from a TankState message. Also converts values to other types if specified.
         * @function toObject
         * @memberof battletanks.TankState
         * @static
         * @param {battletanks.TankState} message TankState
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TankState.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.activePowerups = [];
            if (options.defaults) {
                object.entityId = 0;
                object.playerId = "";
                object.displayName = "";
                object.position = null;
                object.bodyRotation = 0;
                object.turretRotation = 0;
                object.health = 0;
                object.maxHealth = 0;
                object.team = options.enums === String ? "TEAM_NEUTRAL" : 0;
                object.isInvulnerable = false;
                object.invulnerabilityRemaining = 0;
            }
            if (message.entityId != null && message.hasOwnProperty("entityId"))
                object.entityId = message.entityId;
            if (message.playerId != null && message.hasOwnProperty("playerId"))
                object.playerId = message.playerId;
            if (message.displayName != null && message.hasOwnProperty("displayName"))
                object.displayName = message.displayName;
            if (message.position != null && message.hasOwnProperty("position"))
                object.position = $root.battletanks.Vector3.toObject(message.position, options);
            if (message.bodyRotation != null && message.hasOwnProperty("bodyRotation"))
                object.bodyRotation = options.json && !isFinite(message.bodyRotation) ? String(message.bodyRotation) : message.bodyRotation;
            if (message.turretRotation != null && message.hasOwnProperty("turretRotation"))
                object.turretRotation = options.json && !isFinite(message.turretRotation) ? String(message.turretRotation) : message.turretRotation;
            if (message.health != null && message.hasOwnProperty("health"))
                object.health = message.health;
            if (message.maxHealth != null && message.hasOwnProperty("maxHealth"))
                object.maxHealth = message.maxHealth;
            if (message.team != null && message.hasOwnProperty("team"))
                object.team = options.enums === String ? $root.battletanks.TeamColor[message.team] === undefined ? message.team : $root.battletanks.TeamColor[message.team] : message.team;
            if (message.activePowerups && message.activePowerups.length) {
                object.activePowerups = [];
                for (var j = 0; j < message.activePowerups.length; ++j)
                    object.activePowerups[j] = $root.battletanks.ActivePowerUp.toObject(message.activePowerups[j], options);
            }
            if (message.isInvulnerable != null && message.hasOwnProperty("isInvulnerable"))
                object.isInvulnerable = message.isInvulnerable;
            if (message.invulnerabilityRemaining != null && message.hasOwnProperty("invulnerabilityRemaining"))
                object.invulnerabilityRemaining = options.json && !isFinite(message.invulnerabilityRemaining) ? String(message.invulnerabilityRemaining) : message.invulnerabilityRemaining;
            return object;
        };

        /**
         * Converts this TankState to JSON.
         * @function toJSON
         * @memberof battletanks.TankState
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TankState.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for TankState
         * @function getTypeUrl
         * @memberof battletanks.TankState
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TankState.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/battletanks.TankState";
        };

        return TankState;
    })();

    battletanks.ProjectileState = (function() {

        /**
         * Properties of a ProjectileState.
         * @memberof battletanks
         * @interface IProjectileState
         * @property {number|null} [entityId] ProjectileState entityId
         * @property {string|null} [ownerId] ProjectileState ownerId
         * @property {battletanks.IVector3|null} [position] ProjectileState position
         * @property {battletanks.IVector3|null} [velocity] ProjectileState velocity
         * @property {number|null} [damage] ProjectileState damage
         * @property {battletanks.TeamColor|null} [team] ProjectileState team
         * @property {number|null} [lifetimeRemaining] ProjectileState lifetimeRemaining
         */

        /**
         * Constructs a new ProjectileState.
         * @memberof battletanks
         * @classdesc Represents a ProjectileState.
         * @implements IProjectileState
         * @constructor
         * @param {battletanks.IProjectileState=} [properties] Properties to set
         */
        function ProjectileState(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ProjectileState entityId.
         * @member {number} entityId
         * @memberof battletanks.ProjectileState
         * @instance
         */
        ProjectileState.prototype.entityId = 0;

        /**
         * ProjectileState ownerId.
         * @member {string} ownerId
         * @memberof battletanks.ProjectileState
         * @instance
         */
        ProjectileState.prototype.ownerId = "";

        /**
         * ProjectileState position.
         * @member {battletanks.IVector3|null|undefined} position
         * @memberof battletanks.ProjectileState
         * @instance
         */
        ProjectileState.prototype.position = null;

        /**
         * ProjectileState velocity.
         * @member {battletanks.IVector3|null|undefined} velocity
         * @memberof battletanks.ProjectileState
         * @instance
         */
        ProjectileState.prototype.velocity = null;

        /**
         * ProjectileState damage.
         * @member {number} damage
         * @memberof battletanks.ProjectileState
         * @instance
         */
        ProjectileState.prototype.damage = 0;

        /**
         * ProjectileState team.
         * @member {battletanks.TeamColor} team
         * @memberof battletanks.ProjectileState
         * @instance
         */
        ProjectileState.prototype.team = 0;

        /**
         * ProjectileState lifetimeRemaining.
         * @member {number} lifetimeRemaining
         * @memberof battletanks.ProjectileState
         * @instance
         */
        ProjectileState.prototype.lifetimeRemaining = 0;

        /**
         * Creates a new ProjectileState instance using the specified properties.
         * @function create
         * @memberof battletanks.ProjectileState
         * @static
         * @param {battletanks.IProjectileState=} [properties] Properties to set
         * @returns {battletanks.ProjectileState} ProjectileState instance
         */
        ProjectileState.create = function create(properties) {
            return new ProjectileState(properties);
        };

        /**
         * Encodes the specified ProjectileState message. Does not implicitly {@link battletanks.ProjectileState.verify|verify} messages.
         * @function encode
         * @memberof battletanks.ProjectileState
         * @static
         * @param {battletanks.IProjectileState} message ProjectileState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProjectileState.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.entityId != null && Object.hasOwnProperty.call(message, "entityId"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.entityId);
            if (message.ownerId != null && Object.hasOwnProperty.call(message, "ownerId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.ownerId);
            if (message.position != null && Object.hasOwnProperty.call(message, "position"))
                $root.battletanks.Vector3.encode(message.position, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.velocity != null && Object.hasOwnProperty.call(message, "velocity"))
                $root.battletanks.Vector3.encode(message.velocity, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.damage != null && Object.hasOwnProperty.call(message, "damage"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.damage);
            if (message.team != null && Object.hasOwnProperty.call(message, "team"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.team);
            if (message.lifetimeRemaining != null && Object.hasOwnProperty.call(message, "lifetimeRemaining"))
                writer.uint32(/* id 7, wireType 5 =*/61).float(message.lifetimeRemaining);
            return writer;
        };

        /**
         * Encodes the specified ProjectileState message, length delimited. Does not implicitly {@link battletanks.ProjectileState.verify|verify} messages.
         * @function encodeDelimited
         * @memberof battletanks.ProjectileState
         * @static
         * @param {battletanks.IProjectileState} message ProjectileState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProjectileState.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ProjectileState message from the specified reader or buffer.
         * @function decode
         * @memberof battletanks.ProjectileState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {battletanks.ProjectileState} ProjectileState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProjectileState.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.battletanks.ProjectileState();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.entityId = reader.uint32();
                        break;
                    }
                case 2: {
                        message.ownerId = reader.string();
                        break;
                    }
                case 3: {
                        message.position = $root.battletanks.Vector3.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.velocity = $root.battletanks.Vector3.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.damage = reader.uint32();
                        break;
                    }
                case 6: {
                        message.team = reader.int32();
                        break;
                    }
                case 7: {
                        message.lifetimeRemaining = reader.float();
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
         * Decodes a ProjectileState message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof battletanks.ProjectileState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {battletanks.ProjectileState} ProjectileState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProjectileState.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ProjectileState message.
         * @function verify
         * @memberof battletanks.ProjectileState
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ProjectileState.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.entityId != null && message.hasOwnProperty("entityId"))
                if (!$util.isInteger(message.entityId))
                    return "entityId: integer expected";
            if (message.ownerId != null && message.hasOwnProperty("ownerId"))
                if (!$util.isString(message.ownerId))
                    return "ownerId: string expected";
            if (message.position != null && message.hasOwnProperty("position")) {
                var error = $root.battletanks.Vector3.verify(message.position);
                if (error)
                    return "position." + error;
            }
            if (message.velocity != null && message.hasOwnProperty("velocity")) {
                var error = $root.battletanks.Vector3.verify(message.velocity);
                if (error)
                    return "velocity." + error;
            }
            if (message.damage != null && message.hasOwnProperty("damage"))
                if (!$util.isInteger(message.damage))
                    return "damage: integer expected";
            if (message.team != null && message.hasOwnProperty("team"))
                switch (message.team) {
                default:
                    return "team: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.lifetimeRemaining != null && message.hasOwnProperty("lifetimeRemaining"))
                if (typeof message.lifetimeRemaining !== "number")
                    return "lifetimeRemaining: number expected";
            return null;
        };

        /**
         * Creates a ProjectileState message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof battletanks.ProjectileState
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {battletanks.ProjectileState} ProjectileState
         */
        ProjectileState.fromObject = function fromObject(object) {
            if (object instanceof $root.battletanks.ProjectileState)
                return object;
            var message = new $root.battletanks.ProjectileState();
            if (object.entityId != null)
                message.entityId = object.entityId >>> 0;
            if (object.ownerId != null)
                message.ownerId = String(object.ownerId);
            if (object.position != null) {
                if (typeof object.position !== "object")
                    throw TypeError(".battletanks.ProjectileState.position: object expected");
                message.position = $root.battletanks.Vector3.fromObject(object.position);
            }
            if (object.velocity != null) {
                if (typeof object.velocity !== "object")
                    throw TypeError(".battletanks.ProjectileState.velocity: object expected");
                message.velocity = $root.battletanks.Vector3.fromObject(object.velocity);
            }
            if (object.damage != null)
                message.damage = object.damage >>> 0;
            switch (object.team) {
            default:
                if (typeof object.team === "number") {
                    message.team = object.team;
                    break;
                }
                break;
            case "TEAM_NEUTRAL":
            case 0:
                message.team = 0;
                break;
            case "TEAM_RED":
            case 1:
                message.team = 1;
                break;
            case "TEAM_BLUE":
            case 2:
                message.team = 2;
                break;
            case "TEAM_NPC":
            case 3:
                message.team = 3;
                break;
            }
            if (object.lifetimeRemaining != null)
                message.lifetimeRemaining = Number(object.lifetimeRemaining);
            return message;
        };

        /**
         * Creates a plain object from a ProjectileState message. Also converts values to other types if specified.
         * @function toObject
         * @memberof battletanks.ProjectileState
         * @static
         * @param {battletanks.ProjectileState} message ProjectileState
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ProjectileState.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.entityId = 0;
                object.ownerId = "";
                object.position = null;
                object.velocity = null;
                object.damage = 0;
                object.team = options.enums === String ? "TEAM_NEUTRAL" : 0;
                object.lifetimeRemaining = 0;
            }
            if (message.entityId != null && message.hasOwnProperty("entityId"))
                object.entityId = message.entityId;
            if (message.ownerId != null && message.hasOwnProperty("ownerId"))
                object.ownerId = message.ownerId;
            if (message.position != null && message.hasOwnProperty("position"))
                object.position = $root.battletanks.Vector3.toObject(message.position, options);
            if (message.velocity != null && message.hasOwnProperty("velocity"))
                object.velocity = $root.battletanks.Vector3.toObject(message.velocity, options);
            if (message.damage != null && message.hasOwnProperty("damage"))
                object.damage = message.damage;
            if (message.team != null && message.hasOwnProperty("team"))
                object.team = options.enums === String ? $root.battletanks.TeamColor[message.team] === undefined ? message.team : $root.battletanks.TeamColor[message.team] : message.team;
            if (message.lifetimeRemaining != null && message.hasOwnProperty("lifetimeRemaining"))
                object.lifetimeRemaining = options.json && !isFinite(message.lifetimeRemaining) ? String(message.lifetimeRemaining) : message.lifetimeRemaining;
            return object;
        };

        /**
         * Converts this ProjectileState to JSON.
         * @function toJSON
         * @memberof battletanks.ProjectileState
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ProjectileState.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ProjectileState
         * @function getTypeUrl
         * @memberof battletanks.ProjectileState
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ProjectileState.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/battletanks.ProjectileState";
        };

        return ProjectileState;
    })();

    battletanks.PowerUpState = (function() {

        /**
         * Properties of a PowerUpState.
         * @memberof battletanks
         * @interface IPowerUpState
         * @property {number|null} [entityId] PowerUpState entityId
         * @property {battletanks.PowerUpType|null} [powerUpType] PowerUpState powerUpType
         * @property {battletanks.IVector3|null} [position] PowerUpState position
         * @property {boolean|null} [isAvailable] PowerUpState isAvailable
         * @property {number|null} [respawnTimer] PowerUpState respawnTimer
         */

        /**
         * Constructs a new PowerUpState.
         * @memberof battletanks
         * @classdesc Represents a PowerUpState.
         * @implements IPowerUpState
         * @constructor
         * @param {battletanks.IPowerUpState=} [properties] Properties to set
         */
        function PowerUpState(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PowerUpState entityId.
         * @member {number} entityId
         * @memberof battletanks.PowerUpState
         * @instance
         */
        PowerUpState.prototype.entityId = 0;

        /**
         * PowerUpState powerUpType.
         * @member {battletanks.PowerUpType} powerUpType
         * @memberof battletanks.PowerUpState
         * @instance
         */
        PowerUpState.prototype.powerUpType = 0;

        /**
         * PowerUpState position.
         * @member {battletanks.IVector3|null|undefined} position
         * @memberof battletanks.PowerUpState
         * @instance
         */
        PowerUpState.prototype.position = null;

        /**
         * PowerUpState isAvailable.
         * @member {boolean} isAvailable
         * @memberof battletanks.PowerUpState
         * @instance
         */
        PowerUpState.prototype.isAvailable = false;

        /**
         * PowerUpState respawnTimer.
         * @member {number} respawnTimer
         * @memberof battletanks.PowerUpState
         * @instance
         */
        PowerUpState.prototype.respawnTimer = 0;

        /**
         * Creates a new PowerUpState instance using the specified properties.
         * @function create
         * @memberof battletanks.PowerUpState
         * @static
         * @param {battletanks.IPowerUpState=} [properties] Properties to set
         * @returns {battletanks.PowerUpState} PowerUpState instance
         */
        PowerUpState.create = function create(properties) {
            return new PowerUpState(properties);
        };

        /**
         * Encodes the specified PowerUpState message. Does not implicitly {@link battletanks.PowerUpState.verify|verify} messages.
         * @function encode
         * @memberof battletanks.PowerUpState
         * @static
         * @param {battletanks.IPowerUpState} message PowerUpState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PowerUpState.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.entityId != null && Object.hasOwnProperty.call(message, "entityId"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.entityId);
            if (message.powerUpType != null && Object.hasOwnProperty.call(message, "powerUpType"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.powerUpType);
            if (message.position != null && Object.hasOwnProperty.call(message, "position"))
                $root.battletanks.Vector3.encode(message.position, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.isAvailable != null && Object.hasOwnProperty.call(message, "isAvailable"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.isAvailable);
            if (message.respawnTimer != null && Object.hasOwnProperty.call(message, "respawnTimer"))
                writer.uint32(/* id 5, wireType 5 =*/45).float(message.respawnTimer);
            return writer;
        };

        /**
         * Encodes the specified PowerUpState message, length delimited. Does not implicitly {@link battletanks.PowerUpState.verify|verify} messages.
         * @function encodeDelimited
         * @memberof battletanks.PowerUpState
         * @static
         * @param {battletanks.IPowerUpState} message PowerUpState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PowerUpState.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PowerUpState message from the specified reader or buffer.
         * @function decode
         * @memberof battletanks.PowerUpState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {battletanks.PowerUpState} PowerUpState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PowerUpState.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.battletanks.PowerUpState();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.entityId = reader.uint32();
                        break;
                    }
                case 2: {
                        message.powerUpType = reader.int32();
                        break;
                    }
                case 3: {
                        message.position = $root.battletanks.Vector3.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.isAvailable = reader.bool();
                        break;
                    }
                case 5: {
                        message.respawnTimer = reader.float();
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
         * Decodes a PowerUpState message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof battletanks.PowerUpState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {battletanks.PowerUpState} PowerUpState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PowerUpState.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PowerUpState message.
         * @function verify
         * @memberof battletanks.PowerUpState
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PowerUpState.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.entityId != null && message.hasOwnProperty("entityId"))
                if (!$util.isInteger(message.entityId))
                    return "entityId: integer expected";
            if (message.powerUpType != null && message.hasOwnProperty("powerUpType"))
                switch (message.powerUpType) {
                default:
                    return "powerUpType: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                    break;
                }
            if (message.position != null && message.hasOwnProperty("position")) {
                var error = $root.battletanks.Vector3.verify(message.position);
                if (error)
                    return "position." + error;
            }
            if (message.isAvailable != null && message.hasOwnProperty("isAvailable"))
                if (typeof message.isAvailable !== "boolean")
                    return "isAvailable: boolean expected";
            if (message.respawnTimer != null && message.hasOwnProperty("respawnTimer"))
                if (typeof message.respawnTimer !== "number")
                    return "respawnTimer: number expected";
            return null;
        };

        /**
         * Creates a PowerUpState message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof battletanks.PowerUpState
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {battletanks.PowerUpState} PowerUpState
         */
        PowerUpState.fromObject = function fromObject(object) {
            if (object instanceof $root.battletanks.PowerUpState)
                return object;
            var message = new $root.battletanks.PowerUpState();
            if (object.entityId != null)
                message.entityId = object.entityId >>> 0;
            switch (object.powerUpType) {
            default:
                if (typeof object.powerUpType === "number") {
                    message.powerUpType = object.powerUpType;
                    break;
                }
                break;
            case "POWER_UP_NONE":
            case 0:
                message.powerUpType = 0;
                break;
            case "POWER_UP_SHIELD":
            case 1:
                message.powerUpType = 1;
                break;
            case "POWER_UP_CLOAK":
            case 2:
                message.powerUpType = 2;
                break;
            case "POWER_UP_SPEED":
            case 3:
                message.powerUpType = 3;
                break;
            case "POWER_UP_RAPID_FIRE":
            case 4:
                message.powerUpType = 4;
                break;
            }
            if (object.position != null) {
                if (typeof object.position !== "object")
                    throw TypeError(".battletanks.PowerUpState.position: object expected");
                message.position = $root.battletanks.Vector3.fromObject(object.position);
            }
            if (object.isAvailable != null)
                message.isAvailable = Boolean(object.isAvailable);
            if (object.respawnTimer != null)
                message.respawnTimer = Number(object.respawnTimer);
            return message;
        };

        /**
         * Creates a plain object from a PowerUpState message. Also converts values to other types if specified.
         * @function toObject
         * @memberof battletanks.PowerUpState
         * @static
         * @param {battletanks.PowerUpState} message PowerUpState
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PowerUpState.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.entityId = 0;
                object.powerUpType = options.enums === String ? "POWER_UP_NONE" : 0;
                object.position = null;
                object.isAvailable = false;
                object.respawnTimer = 0;
            }
            if (message.entityId != null && message.hasOwnProperty("entityId"))
                object.entityId = message.entityId;
            if (message.powerUpType != null && message.hasOwnProperty("powerUpType"))
                object.powerUpType = options.enums === String ? $root.battletanks.PowerUpType[message.powerUpType] === undefined ? message.powerUpType : $root.battletanks.PowerUpType[message.powerUpType] : message.powerUpType;
            if (message.position != null && message.hasOwnProperty("position"))
                object.position = $root.battletanks.Vector3.toObject(message.position, options);
            if (message.isAvailable != null && message.hasOwnProperty("isAvailable"))
                object.isAvailable = message.isAvailable;
            if (message.respawnTimer != null && message.hasOwnProperty("respawnTimer"))
                object.respawnTimer = options.json && !isFinite(message.respawnTimer) ? String(message.respawnTimer) : message.respawnTimer;
            return object;
        };

        /**
         * Converts this PowerUpState to JSON.
         * @function toJSON
         * @memberof battletanks.PowerUpState
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PowerUpState.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for PowerUpState
         * @function getTypeUrl
         * @memberof battletanks.PowerUpState
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        PowerUpState.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/battletanks.PowerUpState";
        };

        return PowerUpState;
    })();

    battletanks.ActivePowerUp = (function() {

        /**
         * Properties of an ActivePowerUp.
         * @memberof battletanks
         * @interface IActivePowerUp
         * @property {battletanks.PowerUpType|null} [powerUpType] ActivePowerUp powerUpType
         * @property {number|null} [durationRemaining] ActivePowerUp durationRemaining
         * @property {number|null} [totalDuration] ActivePowerUp totalDuration
         */

        /**
         * Constructs a new ActivePowerUp.
         * @memberof battletanks
         * @classdesc Represents an ActivePowerUp.
         * @implements IActivePowerUp
         * @constructor
         * @param {battletanks.IActivePowerUp=} [properties] Properties to set
         */
        function ActivePowerUp(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ActivePowerUp powerUpType.
         * @member {battletanks.PowerUpType} powerUpType
         * @memberof battletanks.ActivePowerUp
         * @instance
         */
        ActivePowerUp.prototype.powerUpType = 0;

        /**
         * ActivePowerUp durationRemaining.
         * @member {number} durationRemaining
         * @memberof battletanks.ActivePowerUp
         * @instance
         */
        ActivePowerUp.prototype.durationRemaining = 0;

        /**
         * ActivePowerUp totalDuration.
         * @member {number} totalDuration
         * @memberof battletanks.ActivePowerUp
         * @instance
         */
        ActivePowerUp.prototype.totalDuration = 0;

        /**
         * Creates a new ActivePowerUp instance using the specified properties.
         * @function create
         * @memberof battletanks.ActivePowerUp
         * @static
         * @param {battletanks.IActivePowerUp=} [properties] Properties to set
         * @returns {battletanks.ActivePowerUp} ActivePowerUp instance
         */
        ActivePowerUp.create = function create(properties) {
            return new ActivePowerUp(properties);
        };

        /**
         * Encodes the specified ActivePowerUp message. Does not implicitly {@link battletanks.ActivePowerUp.verify|verify} messages.
         * @function encode
         * @memberof battletanks.ActivePowerUp
         * @static
         * @param {battletanks.IActivePowerUp} message ActivePowerUp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ActivePowerUp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.powerUpType != null && Object.hasOwnProperty.call(message, "powerUpType"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.powerUpType);
            if (message.durationRemaining != null && Object.hasOwnProperty.call(message, "durationRemaining"))
                writer.uint32(/* id 2, wireType 5 =*/21).float(message.durationRemaining);
            if (message.totalDuration != null && Object.hasOwnProperty.call(message, "totalDuration"))
                writer.uint32(/* id 3, wireType 5 =*/29).float(message.totalDuration);
            return writer;
        };

        /**
         * Encodes the specified ActivePowerUp message, length delimited. Does not implicitly {@link battletanks.ActivePowerUp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof battletanks.ActivePowerUp
         * @static
         * @param {battletanks.IActivePowerUp} message ActivePowerUp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ActivePowerUp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ActivePowerUp message from the specified reader or buffer.
         * @function decode
         * @memberof battletanks.ActivePowerUp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {battletanks.ActivePowerUp} ActivePowerUp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ActivePowerUp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.battletanks.ActivePowerUp();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.powerUpType = reader.int32();
                        break;
                    }
                case 2: {
                        message.durationRemaining = reader.float();
                        break;
                    }
                case 3: {
                        message.totalDuration = reader.float();
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
         * Decodes an ActivePowerUp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof battletanks.ActivePowerUp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {battletanks.ActivePowerUp} ActivePowerUp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ActivePowerUp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ActivePowerUp message.
         * @function verify
         * @memberof battletanks.ActivePowerUp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ActivePowerUp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.powerUpType != null && message.hasOwnProperty("powerUpType"))
                switch (message.powerUpType) {
                default:
                    return "powerUpType: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                    break;
                }
            if (message.durationRemaining != null && message.hasOwnProperty("durationRemaining"))
                if (typeof message.durationRemaining !== "number")
                    return "durationRemaining: number expected";
            if (message.totalDuration != null && message.hasOwnProperty("totalDuration"))
                if (typeof message.totalDuration !== "number")
                    return "totalDuration: number expected";
            return null;
        };

        /**
         * Creates an ActivePowerUp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof battletanks.ActivePowerUp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {battletanks.ActivePowerUp} ActivePowerUp
         */
        ActivePowerUp.fromObject = function fromObject(object) {
            if (object instanceof $root.battletanks.ActivePowerUp)
                return object;
            var message = new $root.battletanks.ActivePowerUp();
            switch (object.powerUpType) {
            default:
                if (typeof object.powerUpType === "number") {
                    message.powerUpType = object.powerUpType;
                    break;
                }
                break;
            case "POWER_UP_NONE":
            case 0:
                message.powerUpType = 0;
                break;
            case "POWER_UP_SHIELD":
            case 1:
                message.powerUpType = 1;
                break;
            case "POWER_UP_CLOAK":
            case 2:
                message.powerUpType = 2;
                break;
            case "POWER_UP_SPEED":
            case 3:
                message.powerUpType = 3;
                break;
            case "POWER_UP_RAPID_FIRE":
            case 4:
                message.powerUpType = 4;
                break;
            }
            if (object.durationRemaining != null)
                message.durationRemaining = Number(object.durationRemaining);
            if (object.totalDuration != null)
                message.totalDuration = Number(object.totalDuration);
            return message;
        };

        /**
         * Creates a plain object from an ActivePowerUp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof battletanks.ActivePowerUp
         * @static
         * @param {battletanks.ActivePowerUp} message ActivePowerUp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ActivePowerUp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.powerUpType = options.enums === String ? "POWER_UP_NONE" : 0;
                object.durationRemaining = 0;
                object.totalDuration = 0;
            }
            if (message.powerUpType != null && message.hasOwnProperty("powerUpType"))
                object.powerUpType = options.enums === String ? $root.battletanks.PowerUpType[message.powerUpType] === undefined ? message.powerUpType : $root.battletanks.PowerUpType[message.powerUpType] : message.powerUpType;
            if (message.durationRemaining != null && message.hasOwnProperty("durationRemaining"))
                object.durationRemaining = options.json && !isFinite(message.durationRemaining) ? String(message.durationRemaining) : message.durationRemaining;
            if (message.totalDuration != null && message.hasOwnProperty("totalDuration"))
                object.totalDuration = options.json && !isFinite(message.totalDuration) ? String(message.totalDuration) : message.totalDuration;
            return object;
        };

        /**
         * Converts this ActivePowerUp to JSON.
         * @function toJSON
         * @memberof battletanks.ActivePowerUp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ActivePowerUp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ActivePowerUp
         * @function getTypeUrl
         * @memberof battletanks.ActivePowerUp
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ActivePowerUp.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/battletanks.ActivePowerUp";
        };

        return ActivePowerUp;
    })();

    battletanks.GameEvent = (function() {

        /**
         * Properties of a GameEvent.
         * @memberof battletanks
         * @interface IGameEvent
         * @property {number|Long|null} [timestamp] GameEvent timestamp
         * @property {battletanks.IPlayerJoinedEvent|null} [playerJoined] GameEvent playerJoined
         * @property {battletanks.IPlayerLeftEvent|null} [playerLeft] GameEvent playerLeft
         * @property {battletanks.ITankDestroyedEvent|null} [tankDestroyed] GameEvent tankDestroyed
         * @property {battletanks.IPowerUpPickedUpEvent|null} [powerUpPickedUp] GameEvent powerUpPickedUp
         * @property {battletanks.IProjectileHitEvent|null} [projectileHit] GameEvent projectileHit
         * @property {battletanks.IChatMessageEvent|null} [chatMessage] GameEvent chatMessage
         * @property {battletanks.IRoundStartedEvent|null} [roundStarted] GameEvent roundStarted
         * @property {battletanks.IRoundEndedEvent|null} [roundEnded] GameEvent roundEnded
         */

        /**
         * Constructs a new GameEvent.
         * @memberof battletanks
         * @classdesc Represents a GameEvent.
         * @implements IGameEvent
         * @constructor
         * @param {battletanks.IGameEvent=} [properties] Properties to set
         */
        function GameEvent(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GameEvent timestamp.
         * @member {number|Long} timestamp
         * @memberof battletanks.GameEvent
         * @instance
         */
        GameEvent.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * GameEvent playerJoined.
         * @member {battletanks.IPlayerJoinedEvent|null|undefined} playerJoined
         * @memberof battletanks.GameEvent
         * @instance
         */
        GameEvent.prototype.playerJoined = null;

        /**
         * GameEvent playerLeft.
         * @member {battletanks.IPlayerLeftEvent|null|undefined} playerLeft
         * @memberof battletanks.GameEvent
         * @instance
         */
        GameEvent.prototype.playerLeft = null;

        /**
         * GameEvent tankDestroyed.
         * @member {battletanks.ITankDestroyedEvent|null|undefined} tankDestroyed
         * @memberof battletanks.GameEvent
         * @instance
         */
        GameEvent.prototype.tankDestroyed = null;

        /**
         * GameEvent powerUpPickedUp.
         * @member {battletanks.IPowerUpPickedUpEvent|null|undefined} powerUpPickedUp
         * @memberof battletanks.GameEvent
         * @instance
         */
        GameEvent.prototype.powerUpPickedUp = null;

        /**
         * GameEvent projectileHit.
         * @member {battletanks.IProjectileHitEvent|null|undefined} projectileHit
         * @memberof battletanks.GameEvent
         * @instance
         */
        GameEvent.prototype.projectileHit = null;

        /**
         * GameEvent chatMessage.
         * @member {battletanks.IChatMessageEvent|null|undefined} chatMessage
         * @memberof battletanks.GameEvent
         * @instance
         */
        GameEvent.prototype.chatMessage = null;

        /**
         * GameEvent roundStarted.
         * @member {battletanks.IRoundStartedEvent|null|undefined} roundStarted
         * @memberof battletanks.GameEvent
         * @instance
         */
        GameEvent.prototype.roundStarted = null;

        /**
         * GameEvent roundEnded.
         * @member {battletanks.IRoundEndedEvent|null|undefined} roundEnded
         * @memberof battletanks.GameEvent
         * @instance
         */
        GameEvent.prototype.roundEnded = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * GameEvent eventType.
         * @member {"playerJoined"|"playerLeft"|"tankDestroyed"|"powerUpPickedUp"|"projectileHit"|"chatMessage"|"roundStarted"|"roundEnded"|undefined} eventType
         * @memberof battletanks.GameEvent
         * @instance
         */
        Object.defineProperty(GameEvent.prototype, "eventType", {
            get: $util.oneOfGetter($oneOfFields = ["playerJoined", "playerLeft", "tankDestroyed", "powerUpPickedUp", "projectileHit", "chatMessage", "roundStarted", "roundEnded"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new GameEvent instance using the specified properties.
         * @function create
         * @memberof battletanks.GameEvent
         * @static
         * @param {battletanks.IGameEvent=} [properties] Properties to set
         * @returns {battletanks.GameEvent} GameEvent instance
         */
        GameEvent.create = function create(properties) {
            return new GameEvent(properties);
        };

        /**
         * Encodes the specified GameEvent message. Does not implicitly {@link battletanks.GameEvent.verify|verify} messages.
         * @function encode
         * @memberof battletanks.GameEvent
         * @static
         * @param {battletanks.IGameEvent} message GameEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.timestamp);
            if (message.playerJoined != null && Object.hasOwnProperty.call(message, "playerJoined"))
                $root.battletanks.PlayerJoinedEvent.encode(message.playerJoined, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.playerLeft != null && Object.hasOwnProperty.call(message, "playerLeft"))
                $root.battletanks.PlayerLeftEvent.encode(message.playerLeft, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.tankDestroyed != null && Object.hasOwnProperty.call(message, "tankDestroyed"))
                $root.battletanks.TankDestroyedEvent.encode(message.tankDestroyed, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.powerUpPickedUp != null && Object.hasOwnProperty.call(message, "powerUpPickedUp"))
                $root.battletanks.PowerUpPickedUpEvent.encode(message.powerUpPickedUp, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.projectileHit != null && Object.hasOwnProperty.call(message, "projectileHit"))
                $root.battletanks.ProjectileHitEvent.encode(message.projectileHit, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.chatMessage != null && Object.hasOwnProperty.call(message, "chatMessage"))
                $root.battletanks.ChatMessageEvent.encode(message.chatMessage, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            if (message.roundStarted != null && Object.hasOwnProperty.call(message, "roundStarted"))
                $root.battletanks.RoundStartedEvent.encode(message.roundStarted, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            if (message.roundEnded != null && Object.hasOwnProperty.call(message, "roundEnded"))
                $root.battletanks.RoundEndedEvent.encode(message.roundEnded, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified GameEvent message, length delimited. Does not implicitly {@link battletanks.GameEvent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof battletanks.GameEvent
         * @static
         * @param {battletanks.IGameEvent} message GameEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameEvent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GameEvent message from the specified reader or buffer.
         * @function decode
         * @memberof battletanks.GameEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {battletanks.GameEvent} GameEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameEvent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.battletanks.GameEvent();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.timestamp = reader.uint64();
                        break;
                    }
                case 2: {
                        message.playerJoined = $root.battletanks.PlayerJoinedEvent.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.playerLeft = $root.battletanks.PlayerLeftEvent.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.tankDestroyed = $root.battletanks.TankDestroyedEvent.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.powerUpPickedUp = $root.battletanks.PowerUpPickedUpEvent.decode(reader, reader.uint32());
                        break;
                    }
                case 6: {
                        message.projectileHit = $root.battletanks.ProjectileHitEvent.decode(reader, reader.uint32());
                        break;
                    }
                case 7: {
                        message.chatMessage = $root.battletanks.ChatMessageEvent.decode(reader, reader.uint32());
                        break;
                    }
                case 8: {
                        message.roundStarted = $root.battletanks.RoundStartedEvent.decode(reader, reader.uint32());
                        break;
                    }
                case 9: {
                        message.roundEnded = $root.battletanks.RoundEndedEvent.decode(reader, reader.uint32());
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
         * Decodes a GameEvent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof battletanks.GameEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {battletanks.GameEvent} GameEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameEvent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GameEvent message.
         * @function verify
         * @memberof battletanks.GameEvent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GameEvent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.playerJoined != null && message.hasOwnProperty("playerJoined")) {
                properties.eventType = 1;
                {
                    var error = $root.battletanks.PlayerJoinedEvent.verify(message.playerJoined);
                    if (error)
                        return "playerJoined." + error;
                }
            }
            if (message.playerLeft != null && message.hasOwnProperty("playerLeft")) {
                if (properties.eventType === 1)
                    return "eventType: multiple values";
                properties.eventType = 1;
                {
                    var error = $root.battletanks.PlayerLeftEvent.verify(message.playerLeft);
                    if (error)
                        return "playerLeft." + error;
                }
            }
            if (message.tankDestroyed != null && message.hasOwnProperty("tankDestroyed")) {
                if (properties.eventType === 1)
                    return "eventType: multiple values";
                properties.eventType = 1;
                {
                    var error = $root.battletanks.TankDestroyedEvent.verify(message.tankDestroyed);
                    if (error)
                        return "tankDestroyed." + error;
                }
            }
            if (message.powerUpPickedUp != null && message.hasOwnProperty("powerUpPickedUp")) {
                if (properties.eventType === 1)
                    return "eventType: multiple values";
                properties.eventType = 1;
                {
                    var error = $root.battletanks.PowerUpPickedUpEvent.verify(message.powerUpPickedUp);
                    if (error)
                        return "powerUpPickedUp." + error;
                }
            }
            if (message.projectileHit != null && message.hasOwnProperty("projectileHit")) {
                if (properties.eventType === 1)
                    return "eventType: multiple values";
                properties.eventType = 1;
                {
                    var error = $root.battletanks.ProjectileHitEvent.verify(message.projectileHit);
                    if (error)
                        return "projectileHit." + error;
                }
            }
            if (message.chatMessage != null && message.hasOwnProperty("chatMessage")) {
                if (properties.eventType === 1)
                    return "eventType: multiple values";
                properties.eventType = 1;
                {
                    var error = $root.battletanks.ChatMessageEvent.verify(message.chatMessage);
                    if (error)
                        return "chatMessage." + error;
                }
            }
            if (message.roundStarted != null && message.hasOwnProperty("roundStarted")) {
                if (properties.eventType === 1)
                    return "eventType: multiple values";
                properties.eventType = 1;
                {
                    var error = $root.battletanks.RoundStartedEvent.verify(message.roundStarted);
                    if (error)
                        return "roundStarted." + error;
                }
            }
            if (message.roundEnded != null && message.hasOwnProperty("roundEnded")) {
                if (properties.eventType === 1)
                    return "eventType: multiple values";
                properties.eventType = 1;
                {
                    var error = $root.battletanks.RoundEndedEvent.verify(message.roundEnded);
                    if (error)
                        return "roundEnded." + error;
                }
            }
            return null;
        };

        /**
         * Creates a GameEvent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof battletanks.GameEvent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {battletanks.GameEvent} GameEvent
         */
        GameEvent.fromObject = function fromObject(object) {
            if (object instanceof $root.battletanks.GameEvent)
                return object;
            var message = new $root.battletanks.GameEvent();
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = true;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber(true);
            if (object.playerJoined != null) {
                if (typeof object.playerJoined !== "object")
                    throw TypeError(".battletanks.GameEvent.playerJoined: object expected");
                message.playerJoined = $root.battletanks.PlayerJoinedEvent.fromObject(object.playerJoined);
            }
            if (object.playerLeft != null) {
                if (typeof object.playerLeft !== "object")
                    throw TypeError(".battletanks.GameEvent.playerLeft: object expected");
                message.playerLeft = $root.battletanks.PlayerLeftEvent.fromObject(object.playerLeft);
            }
            if (object.tankDestroyed != null) {
                if (typeof object.tankDestroyed !== "object")
                    throw TypeError(".battletanks.GameEvent.tankDestroyed: object expected");
                message.tankDestroyed = $root.battletanks.TankDestroyedEvent.fromObject(object.tankDestroyed);
            }
            if (object.powerUpPickedUp != null) {
                if (typeof object.powerUpPickedUp !== "object")
                    throw TypeError(".battletanks.GameEvent.powerUpPickedUp: object expected");
                message.powerUpPickedUp = $root.battletanks.PowerUpPickedUpEvent.fromObject(object.powerUpPickedUp);
            }
            if (object.projectileHit != null) {
                if (typeof object.projectileHit !== "object")
                    throw TypeError(".battletanks.GameEvent.projectileHit: object expected");
                message.projectileHit = $root.battletanks.ProjectileHitEvent.fromObject(object.projectileHit);
            }
            if (object.chatMessage != null) {
                if (typeof object.chatMessage !== "object")
                    throw TypeError(".battletanks.GameEvent.chatMessage: object expected");
                message.chatMessage = $root.battletanks.ChatMessageEvent.fromObject(object.chatMessage);
            }
            if (object.roundStarted != null) {
                if (typeof object.roundStarted !== "object")
                    throw TypeError(".battletanks.GameEvent.roundStarted: object expected");
                message.roundStarted = $root.battletanks.RoundStartedEvent.fromObject(object.roundStarted);
            }
            if (object.roundEnded != null) {
                if (typeof object.roundEnded !== "object")
                    throw TypeError(".battletanks.GameEvent.roundEnded: object expected");
                message.roundEnded = $root.battletanks.RoundEndedEvent.fromObject(object.roundEnded);
            }
            return message;
        };

        /**
         * Creates a plain object from a GameEvent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof battletanks.GameEvent
         * @static
         * @param {battletanks.GameEvent} message GameEvent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GameEvent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber(true) : message.timestamp;
            if (message.playerJoined != null && message.hasOwnProperty("playerJoined")) {
                object.playerJoined = $root.battletanks.PlayerJoinedEvent.toObject(message.playerJoined, options);
                if (options.oneofs)
                    object.eventType = "playerJoined";
            }
            if (message.playerLeft != null && message.hasOwnProperty("playerLeft")) {
                object.playerLeft = $root.battletanks.PlayerLeftEvent.toObject(message.playerLeft, options);
                if (options.oneofs)
                    object.eventType = "playerLeft";
            }
            if (message.tankDestroyed != null && message.hasOwnProperty("tankDestroyed")) {
                object.tankDestroyed = $root.battletanks.TankDestroyedEvent.toObject(message.tankDestroyed, options);
                if (options.oneofs)
                    object.eventType = "tankDestroyed";
            }
            if (message.powerUpPickedUp != null && message.hasOwnProperty("powerUpPickedUp")) {
                object.powerUpPickedUp = $root.battletanks.PowerUpPickedUpEvent.toObject(message.powerUpPickedUp, options);
                if (options.oneofs)
                    object.eventType = "powerUpPickedUp";
            }
            if (message.projectileHit != null && message.hasOwnProperty("projectileHit")) {
                object.projectileHit = $root.battletanks.ProjectileHitEvent.toObject(message.projectileHit, options);
                if (options.oneofs)
                    object.eventType = "projectileHit";
            }
            if (message.chatMessage != null && message.hasOwnProperty("chatMessage")) {
                object.chatMessage = $root.battletanks.ChatMessageEvent.toObject(message.chatMessage, options);
                if (options.oneofs)
                    object.eventType = "chatMessage";
            }
            if (message.roundStarted != null && message.hasOwnProperty("roundStarted")) {
                object.roundStarted = $root.battletanks.RoundStartedEvent.toObject(message.roundStarted, options);
                if (options.oneofs)
                    object.eventType = "roundStarted";
            }
            if (message.roundEnded != null && message.hasOwnProperty("roundEnded")) {
                object.roundEnded = $root.battletanks.RoundEndedEvent.toObject(message.roundEnded, options);
                if (options.oneofs)
                    object.eventType = "roundEnded";
            }
            return object;
        };

        /**
         * Converts this GameEvent to JSON.
         * @function toJSON
         * @memberof battletanks.GameEvent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GameEvent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GameEvent
         * @function getTypeUrl
         * @memberof battletanks.GameEvent
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GameEvent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/battletanks.GameEvent";
        };

        return GameEvent;
    })();

    battletanks.PlayerJoinedEvent = (function() {

        /**
         * Properties of a PlayerJoinedEvent.
         * @memberof battletanks
         * @interface IPlayerJoinedEvent
         * @property {string|null} [playerId] PlayerJoinedEvent playerId
         * @property {string|null} [displayName] PlayerJoinedEvent displayName
         * @property {number|null} [entityId] PlayerJoinedEvent entityId
         */

        /**
         * Constructs a new PlayerJoinedEvent.
         * @memberof battletanks
         * @classdesc Represents a PlayerJoinedEvent.
         * @implements IPlayerJoinedEvent
         * @constructor
         * @param {battletanks.IPlayerJoinedEvent=} [properties] Properties to set
         */
        function PlayerJoinedEvent(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PlayerJoinedEvent playerId.
         * @member {string} playerId
         * @memberof battletanks.PlayerJoinedEvent
         * @instance
         */
        PlayerJoinedEvent.prototype.playerId = "";

        /**
         * PlayerJoinedEvent displayName.
         * @member {string} displayName
         * @memberof battletanks.PlayerJoinedEvent
         * @instance
         */
        PlayerJoinedEvent.prototype.displayName = "";

        /**
         * PlayerJoinedEvent entityId.
         * @member {number} entityId
         * @memberof battletanks.PlayerJoinedEvent
         * @instance
         */
        PlayerJoinedEvent.prototype.entityId = 0;

        /**
         * Creates a new PlayerJoinedEvent instance using the specified properties.
         * @function create
         * @memberof battletanks.PlayerJoinedEvent
         * @static
         * @param {battletanks.IPlayerJoinedEvent=} [properties] Properties to set
         * @returns {battletanks.PlayerJoinedEvent} PlayerJoinedEvent instance
         */
        PlayerJoinedEvent.create = function create(properties) {
            return new PlayerJoinedEvent(properties);
        };

        /**
         * Encodes the specified PlayerJoinedEvent message. Does not implicitly {@link battletanks.PlayerJoinedEvent.verify|verify} messages.
         * @function encode
         * @memberof battletanks.PlayerJoinedEvent
         * @static
         * @param {battletanks.IPlayerJoinedEvent} message PlayerJoinedEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerJoinedEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.playerId != null && Object.hasOwnProperty.call(message, "playerId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.playerId);
            if (message.displayName != null && Object.hasOwnProperty.call(message, "displayName"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.displayName);
            if (message.entityId != null && Object.hasOwnProperty.call(message, "entityId"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.entityId);
            return writer;
        };

        /**
         * Encodes the specified PlayerJoinedEvent message, length delimited. Does not implicitly {@link battletanks.PlayerJoinedEvent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof battletanks.PlayerJoinedEvent
         * @static
         * @param {battletanks.IPlayerJoinedEvent} message PlayerJoinedEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerJoinedEvent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PlayerJoinedEvent message from the specified reader or buffer.
         * @function decode
         * @memberof battletanks.PlayerJoinedEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {battletanks.PlayerJoinedEvent} PlayerJoinedEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerJoinedEvent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.battletanks.PlayerJoinedEvent();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.playerId = reader.string();
                        break;
                    }
                case 2: {
                        message.displayName = reader.string();
                        break;
                    }
                case 3: {
                        message.entityId = reader.uint32();
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
         * Decodes a PlayerJoinedEvent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof battletanks.PlayerJoinedEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {battletanks.PlayerJoinedEvent} PlayerJoinedEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerJoinedEvent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PlayerJoinedEvent message.
         * @function verify
         * @memberof battletanks.PlayerJoinedEvent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PlayerJoinedEvent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.playerId != null && message.hasOwnProperty("playerId"))
                if (!$util.isString(message.playerId))
                    return "playerId: string expected";
            if (message.displayName != null && message.hasOwnProperty("displayName"))
                if (!$util.isString(message.displayName))
                    return "displayName: string expected";
            if (message.entityId != null && message.hasOwnProperty("entityId"))
                if (!$util.isInteger(message.entityId))
                    return "entityId: integer expected";
            return null;
        };

        /**
         * Creates a PlayerJoinedEvent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof battletanks.PlayerJoinedEvent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {battletanks.PlayerJoinedEvent} PlayerJoinedEvent
         */
        PlayerJoinedEvent.fromObject = function fromObject(object) {
            if (object instanceof $root.battletanks.PlayerJoinedEvent)
                return object;
            var message = new $root.battletanks.PlayerJoinedEvent();
            if (object.playerId != null)
                message.playerId = String(object.playerId);
            if (object.displayName != null)
                message.displayName = String(object.displayName);
            if (object.entityId != null)
                message.entityId = object.entityId >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a PlayerJoinedEvent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof battletanks.PlayerJoinedEvent
         * @static
         * @param {battletanks.PlayerJoinedEvent} message PlayerJoinedEvent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PlayerJoinedEvent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.playerId = "";
                object.displayName = "";
                object.entityId = 0;
            }
            if (message.playerId != null && message.hasOwnProperty("playerId"))
                object.playerId = message.playerId;
            if (message.displayName != null && message.hasOwnProperty("displayName"))
                object.displayName = message.displayName;
            if (message.entityId != null && message.hasOwnProperty("entityId"))
                object.entityId = message.entityId;
            return object;
        };

        /**
         * Converts this PlayerJoinedEvent to JSON.
         * @function toJSON
         * @memberof battletanks.PlayerJoinedEvent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PlayerJoinedEvent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for PlayerJoinedEvent
         * @function getTypeUrl
         * @memberof battletanks.PlayerJoinedEvent
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        PlayerJoinedEvent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/battletanks.PlayerJoinedEvent";
        };

        return PlayerJoinedEvent;
    })();

    battletanks.PlayerLeftEvent = (function() {

        /**
         * Properties of a PlayerLeftEvent.
         * @memberof battletanks
         * @interface IPlayerLeftEvent
         * @property {string|null} [playerId] PlayerLeftEvent playerId
         * @property {string|null} [displayName] PlayerLeftEvent displayName
         */

        /**
         * Constructs a new PlayerLeftEvent.
         * @memberof battletanks
         * @classdesc Represents a PlayerLeftEvent.
         * @implements IPlayerLeftEvent
         * @constructor
         * @param {battletanks.IPlayerLeftEvent=} [properties] Properties to set
         */
        function PlayerLeftEvent(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PlayerLeftEvent playerId.
         * @member {string} playerId
         * @memberof battletanks.PlayerLeftEvent
         * @instance
         */
        PlayerLeftEvent.prototype.playerId = "";

        /**
         * PlayerLeftEvent displayName.
         * @member {string} displayName
         * @memberof battletanks.PlayerLeftEvent
         * @instance
         */
        PlayerLeftEvent.prototype.displayName = "";

        /**
         * Creates a new PlayerLeftEvent instance using the specified properties.
         * @function create
         * @memberof battletanks.PlayerLeftEvent
         * @static
         * @param {battletanks.IPlayerLeftEvent=} [properties] Properties to set
         * @returns {battletanks.PlayerLeftEvent} PlayerLeftEvent instance
         */
        PlayerLeftEvent.create = function create(properties) {
            return new PlayerLeftEvent(properties);
        };

        /**
         * Encodes the specified PlayerLeftEvent message. Does not implicitly {@link battletanks.PlayerLeftEvent.verify|verify} messages.
         * @function encode
         * @memberof battletanks.PlayerLeftEvent
         * @static
         * @param {battletanks.IPlayerLeftEvent} message PlayerLeftEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerLeftEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.playerId != null && Object.hasOwnProperty.call(message, "playerId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.playerId);
            if (message.displayName != null && Object.hasOwnProperty.call(message, "displayName"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.displayName);
            return writer;
        };

        /**
         * Encodes the specified PlayerLeftEvent message, length delimited. Does not implicitly {@link battletanks.PlayerLeftEvent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof battletanks.PlayerLeftEvent
         * @static
         * @param {battletanks.IPlayerLeftEvent} message PlayerLeftEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerLeftEvent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PlayerLeftEvent message from the specified reader or buffer.
         * @function decode
         * @memberof battletanks.PlayerLeftEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {battletanks.PlayerLeftEvent} PlayerLeftEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerLeftEvent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.battletanks.PlayerLeftEvent();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.playerId = reader.string();
                        break;
                    }
                case 2: {
                        message.displayName = reader.string();
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
         * Decodes a PlayerLeftEvent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof battletanks.PlayerLeftEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {battletanks.PlayerLeftEvent} PlayerLeftEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerLeftEvent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PlayerLeftEvent message.
         * @function verify
         * @memberof battletanks.PlayerLeftEvent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PlayerLeftEvent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.playerId != null && message.hasOwnProperty("playerId"))
                if (!$util.isString(message.playerId))
                    return "playerId: string expected";
            if (message.displayName != null && message.hasOwnProperty("displayName"))
                if (!$util.isString(message.displayName))
                    return "displayName: string expected";
            return null;
        };

        /**
         * Creates a PlayerLeftEvent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof battletanks.PlayerLeftEvent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {battletanks.PlayerLeftEvent} PlayerLeftEvent
         */
        PlayerLeftEvent.fromObject = function fromObject(object) {
            if (object instanceof $root.battletanks.PlayerLeftEvent)
                return object;
            var message = new $root.battletanks.PlayerLeftEvent();
            if (object.playerId != null)
                message.playerId = String(object.playerId);
            if (object.displayName != null)
                message.displayName = String(object.displayName);
            return message;
        };

        /**
         * Creates a plain object from a PlayerLeftEvent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof battletanks.PlayerLeftEvent
         * @static
         * @param {battletanks.PlayerLeftEvent} message PlayerLeftEvent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PlayerLeftEvent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.playerId = "";
                object.displayName = "";
            }
            if (message.playerId != null && message.hasOwnProperty("playerId"))
                object.playerId = message.playerId;
            if (message.displayName != null && message.hasOwnProperty("displayName"))
                object.displayName = message.displayName;
            return object;
        };

        /**
         * Converts this PlayerLeftEvent to JSON.
         * @function toJSON
         * @memberof battletanks.PlayerLeftEvent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PlayerLeftEvent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for PlayerLeftEvent
         * @function getTypeUrl
         * @memberof battletanks.PlayerLeftEvent
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        PlayerLeftEvent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/battletanks.PlayerLeftEvent";
        };

        return PlayerLeftEvent;
    })();

    battletanks.TankDestroyedEvent = (function() {

        /**
         * Properties of a TankDestroyedEvent.
         * @memberof battletanks
         * @interface ITankDestroyedEvent
         * @property {number|null} [victimEntityId] TankDestroyedEvent victimEntityId
         * @property {string|null} [victimPlayerId] TankDestroyedEvent victimPlayerId
         * @property {number|null} [killerEntityId] TankDestroyedEvent killerEntityId
         * @property {string|null} [killerPlayerId] TankDestroyedEvent killerPlayerId
         * @property {battletanks.IVector3|null} [explosionPosition] TankDestroyedEvent explosionPosition
         */

        /**
         * Constructs a new TankDestroyedEvent.
         * @memberof battletanks
         * @classdesc Represents a TankDestroyedEvent.
         * @implements ITankDestroyedEvent
         * @constructor
         * @param {battletanks.ITankDestroyedEvent=} [properties] Properties to set
         */
        function TankDestroyedEvent(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TankDestroyedEvent victimEntityId.
         * @member {number} victimEntityId
         * @memberof battletanks.TankDestroyedEvent
         * @instance
         */
        TankDestroyedEvent.prototype.victimEntityId = 0;

        /**
         * TankDestroyedEvent victimPlayerId.
         * @member {string} victimPlayerId
         * @memberof battletanks.TankDestroyedEvent
         * @instance
         */
        TankDestroyedEvent.prototype.victimPlayerId = "";

        /**
         * TankDestroyedEvent killerEntityId.
         * @member {number} killerEntityId
         * @memberof battletanks.TankDestroyedEvent
         * @instance
         */
        TankDestroyedEvent.prototype.killerEntityId = 0;

        /**
         * TankDestroyedEvent killerPlayerId.
         * @member {string} killerPlayerId
         * @memberof battletanks.TankDestroyedEvent
         * @instance
         */
        TankDestroyedEvent.prototype.killerPlayerId = "";

        /**
         * TankDestroyedEvent explosionPosition.
         * @member {battletanks.IVector3|null|undefined} explosionPosition
         * @memberof battletanks.TankDestroyedEvent
         * @instance
         */
        TankDestroyedEvent.prototype.explosionPosition = null;

        /**
         * Creates a new TankDestroyedEvent instance using the specified properties.
         * @function create
         * @memberof battletanks.TankDestroyedEvent
         * @static
         * @param {battletanks.ITankDestroyedEvent=} [properties] Properties to set
         * @returns {battletanks.TankDestroyedEvent} TankDestroyedEvent instance
         */
        TankDestroyedEvent.create = function create(properties) {
            return new TankDestroyedEvent(properties);
        };

        /**
         * Encodes the specified TankDestroyedEvent message. Does not implicitly {@link battletanks.TankDestroyedEvent.verify|verify} messages.
         * @function encode
         * @memberof battletanks.TankDestroyedEvent
         * @static
         * @param {battletanks.ITankDestroyedEvent} message TankDestroyedEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TankDestroyedEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.victimEntityId != null && Object.hasOwnProperty.call(message, "victimEntityId"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.victimEntityId);
            if (message.victimPlayerId != null && Object.hasOwnProperty.call(message, "victimPlayerId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.victimPlayerId);
            if (message.killerEntityId != null && Object.hasOwnProperty.call(message, "killerEntityId"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.killerEntityId);
            if (message.killerPlayerId != null && Object.hasOwnProperty.call(message, "killerPlayerId"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.killerPlayerId);
            if (message.explosionPosition != null && Object.hasOwnProperty.call(message, "explosionPosition"))
                $root.battletanks.Vector3.encode(message.explosionPosition, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified TankDestroyedEvent message, length delimited. Does not implicitly {@link battletanks.TankDestroyedEvent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof battletanks.TankDestroyedEvent
         * @static
         * @param {battletanks.ITankDestroyedEvent} message TankDestroyedEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TankDestroyedEvent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TankDestroyedEvent message from the specified reader or buffer.
         * @function decode
         * @memberof battletanks.TankDestroyedEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {battletanks.TankDestroyedEvent} TankDestroyedEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TankDestroyedEvent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.battletanks.TankDestroyedEvent();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.victimEntityId = reader.uint32();
                        break;
                    }
                case 2: {
                        message.victimPlayerId = reader.string();
                        break;
                    }
                case 3: {
                        message.killerEntityId = reader.uint32();
                        break;
                    }
                case 4: {
                        message.killerPlayerId = reader.string();
                        break;
                    }
                case 5: {
                        message.explosionPosition = $root.battletanks.Vector3.decode(reader, reader.uint32());
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
         * Decodes a TankDestroyedEvent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof battletanks.TankDestroyedEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {battletanks.TankDestroyedEvent} TankDestroyedEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TankDestroyedEvent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TankDestroyedEvent message.
         * @function verify
         * @memberof battletanks.TankDestroyedEvent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TankDestroyedEvent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.victimEntityId != null && message.hasOwnProperty("victimEntityId"))
                if (!$util.isInteger(message.victimEntityId))
                    return "victimEntityId: integer expected";
            if (message.victimPlayerId != null && message.hasOwnProperty("victimPlayerId"))
                if (!$util.isString(message.victimPlayerId))
                    return "victimPlayerId: string expected";
            if (message.killerEntityId != null && message.hasOwnProperty("killerEntityId"))
                if (!$util.isInteger(message.killerEntityId))
                    return "killerEntityId: integer expected";
            if (message.killerPlayerId != null && message.hasOwnProperty("killerPlayerId"))
                if (!$util.isString(message.killerPlayerId))
                    return "killerPlayerId: string expected";
            if (message.explosionPosition != null && message.hasOwnProperty("explosionPosition")) {
                var error = $root.battletanks.Vector3.verify(message.explosionPosition);
                if (error)
                    return "explosionPosition." + error;
            }
            return null;
        };

        /**
         * Creates a TankDestroyedEvent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof battletanks.TankDestroyedEvent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {battletanks.TankDestroyedEvent} TankDestroyedEvent
         */
        TankDestroyedEvent.fromObject = function fromObject(object) {
            if (object instanceof $root.battletanks.TankDestroyedEvent)
                return object;
            var message = new $root.battletanks.TankDestroyedEvent();
            if (object.victimEntityId != null)
                message.victimEntityId = object.victimEntityId >>> 0;
            if (object.victimPlayerId != null)
                message.victimPlayerId = String(object.victimPlayerId);
            if (object.killerEntityId != null)
                message.killerEntityId = object.killerEntityId >>> 0;
            if (object.killerPlayerId != null)
                message.killerPlayerId = String(object.killerPlayerId);
            if (object.explosionPosition != null) {
                if (typeof object.explosionPosition !== "object")
                    throw TypeError(".battletanks.TankDestroyedEvent.explosionPosition: object expected");
                message.explosionPosition = $root.battletanks.Vector3.fromObject(object.explosionPosition);
            }
            return message;
        };

        /**
         * Creates a plain object from a TankDestroyedEvent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof battletanks.TankDestroyedEvent
         * @static
         * @param {battletanks.TankDestroyedEvent} message TankDestroyedEvent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TankDestroyedEvent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.victimEntityId = 0;
                object.victimPlayerId = "";
                object.killerEntityId = 0;
                object.killerPlayerId = "";
                object.explosionPosition = null;
            }
            if (message.victimEntityId != null && message.hasOwnProperty("victimEntityId"))
                object.victimEntityId = message.victimEntityId;
            if (message.victimPlayerId != null && message.hasOwnProperty("victimPlayerId"))
                object.victimPlayerId = message.victimPlayerId;
            if (message.killerEntityId != null && message.hasOwnProperty("killerEntityId"))
                object.killerEntityId = message.killerEntityId;
            if (message.killerPlayerId != null && message.hasOwnProperty("killerPlayerId"))
                object.killerPlayerId = message.killerPlayerId;
            if (message.explosionPosition != null && message.hasOwnProperty("explosionPosition"))
                object.explosionPosition = $root.battletanks.Vector3.toObject(message.explosionPosition, options);
            return object;
        };

        /**
         * Converts this TankDestroyedEvent to JSON.
         * @function toJSON
         * @memberof battletanks.TankDestroyedEvent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TankDestroyedEvent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for TankDestroyedEvent
         * @function getTypeUrl
         * @memberof battletanks.TankDestroyedEvent
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TankDestroyedEvent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/battletanks.TankDestroyedEvent";
        };

        return TankDestroyedEvent;
    })();

    battletanks.PowerUpPickedUpEvent = (function() {

        /**
         * Properties of a PowerUpPickedUpEvent.
         * @memberof battletanks
         * @interface IPowerUpPickedUpEvent
         * @property {string|null} [playerId] PowerUpPickedUpEvent playerId
         * @property {number|null} [tankEntityId] PowerUpPickedUpEvent tankEntityId
         * @property {battletanks.PowerUpType|null} [powerUpType] PowerUpPickedUpEvent powerUpType
         * @property {number|null} [powerUpEntityId] PowerUpPickedUpEvent powerUpEntityId
         */

        /**
         * Constructs a new PowerUpPickedUpEvent.
         * @memberof battletanks
         * @classdesc Represents a PowerUpPickedUpEvent.
         * @implements IPowerUpPickedUpEvent
         * @constructor
         * @param {battletanks.IPowerUpPickedUpEvent=} [properties] Properties to set
         */
        function PowerUpPickedUpEvent(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PowerUpPickedUpEvent playerId.
         * @member {string} playerId
         * @memberof battletanks.PowerUpPickedUpEvent
         * @instance
         */
        PowerUpPickedUpEvent.prototype.playerId = "";

        /**
         * PowerUpPickedUpEvent tankEntityId.
         * @member {number} tankEntityId
         * @memberof battletanks.PowerUpPickedUpEvent
         * @instance
         */
        PowerUpPickedUpEvent.prototype.tankEntityId = 0;

        /**
         * PowerUpPickedUpEvent powerUpType.
         * @member {battletanks.PowerUpType} powerUpType
         * @memberof battletanks.PowerUpPickedUpEvent
         * @instance
         */
        PowerUpPickedUpEvent.prototype.powerUpType = 0;

        /**
         * PowerUpPickedUpEvent powerUpEntityId.
         * @member {number} powerUpEntityId
         * @memberof battletanks.PowerUpPickedUpEvent
         * @instance
         */
        PowerUpPickedUpEvent.prototype.powerUpEntityId = 0;

        /**
         * Creates a new PowerUpPickedUpEvent instance using the specified properties.
         * @function create
         * @memberof battletanks.PowerUpPickedUpEvent
         * @static
         * @param {battletanks.IPowerUpPickedUpEvent=} [properties] Properties to set
         * @returns {battletanks.PowerUpPickedUpEvent} PowerUpPickedUpEvent instance
         */
        PowerUpPickedUpEvent.create = function create(properties) {
            return new PowerUpPickedUpEvent(properties);
        };

        /**
         * Encodes the specified PowerUpPickedUpEvent message. Does not implicitly {@link battletanks.PowerUpPickedUpEvent.verify|verify} messages.
         * @function encode
         * @memberof battletanks.PowerUpPickedUpEvent
         * @static
         * @param {battletanks.IPowerUpPickedUpEvent} message PowerUpPickedUpEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PowerUpPickedUpEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.playerId != null && Object.hasOwnProperty.call(message, "playerId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.playerId);
            if (message.tankEntityId != null && Object.hasOwnProperty.call(message, "tankEntityId"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.tankEntityId);
            if (message.powerUpType != null && Object.hasOwnProperty.call(message, "powerUpType"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.powerUpType);
            if (message.powerUpEntityId != null && Object.hasOwnProperty.call(message, "powerUpEntityId"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.powerUpEntityId);
            return writer;
        };

        /**
         * Encodes the specified PowerUpPickedUpEvent message, length delimited. Does not implicitly {@link battletanks.PowerUpPickedUpEvent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof battletanks.PowerUpPickedUpEvent
         * @static
         * @param {battletanks.IPowerUpPickedUpEvent} message PowerUpPickedUpEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PowerUpPickedUpEvent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PowerUpPickedUpEvent message from the specified reader or buffer.
         * @function decode
         * @memberof battletanks.PowerUpPickedUpEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {battletanks.PowerUpPickedUpEvent} PowerUpPickedUpEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PowerUpPickedUpEvent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.battletanks.PowerUpPickedUpEvent();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.playerId = reader.string();
                        break;
                    }
                case 2: {
                        message.tankEntityId = reader.uint32();
                        break;
                    }
                case 3: {
                        message.powerUpType = reader.int32();
                        break;
                    }
                case 4: {
                        message.powerUpEntityId = reader.uint32();
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
         * Decodes a PowerUpPickedUpEvent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof battletanks.PowerUpPickedUpEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {battletanks.PowerUpPickedUpEvent} PowerUpPickedUpEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PowerUpPickedUpEvent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PowerUpPickedUpEvent message.
         * @function verify
         * @memberof battletanks.PowerUpPickedUpEvent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PowerUpPickedUpEvent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.playerId != null && message.hasOwnProperty("playerId"))
                if (!$util.isString(message.playerId))
                    return "playerId: string expected";
            if (message.tankEntityId != null && message.hasOwnProperty("tankEntityId"))
                if (!$util.isInteger(message.tankEntityId))
                    return "tankEntityId: integer expected";
            if (message.powerUpType != null && message.hasOwnProperty("powerUpType"))
                switch (message.powerUpType) {
                default:
                    return "powerUpType: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                    break;
                }
            if (message.powerUpEntityId != null && message.hasOwnProperty("powerUpEntityId"))
                if (!$util.isInteger(message.powerUpEntityId))
                    return "powerUpEntityId: integer expected";
            return null;
        };

        /**
         * Creates a PowerUpPickedUpEvent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof battletanks.PowerUpPickedUpEvent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {battletanks.PowerUpPickedUpEvent} PowerUpPickedUpEvent
         */
        PowerUpPickedUpEvent.fromObject = function fromObject(object) {
            if (object instanceof $root.battletanks.PowerUpPickedUpEvent)
                return object;
            var message = new $root.battletanks.PowerUpPickedUpEvent();
            if (object.playerId != null)
                message.playerId = String(object.playerId);
            if (object.tankEntityId != null)
                message.tankEntityId = object.tankEntityId >>> 0;
            switch (object.powerUpType) {
            default:
                if (typeof object.powerUpType === "number") {
                    message.powerUpType = object.powerUpType;
                    break;
                }
                break;
            case "POWER_UP_NONE":
            case 0:
                message.powerUpType = 0;
                break;
            case "POWER_UP_SHIELD":
            case 1:
                message.powerUpType = 1;
                break;
            case "POWER_UP_CLOAK":
            case 2:
                message.powerUpType = 2;
                break;
            case "POWER_UP_SPEED":
            case 3:
                message.powerUpType = 3;
                break;
            case "POWER_UP_RAPID_FIRE":
            case 4:
                message.powerUpType = 4;
                break;
            }
            if (object.powerUpEntityId != null)
                message.powerUpEntityId = object.powerUpEntityId >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a PowerUpPickedUpEvent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof battletanks.PowerUpPickedUpEvent
         * @static
         * @param {battletanks.PowerUpPickedUpEvent} message PowerUpPickedUpEvent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PowerUpPickedUpEvent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.playerId = "";
                object.tankEntityId = 0;
                object.powerUpType = options.enums === String ? "POWER_UP_NONE" : 0;
                object.powerUpEntityId = 0;
            }
            if (message.playerId != null && message.hasOwnProperty("playerId"))
                object.playerId = message.playerId;
            if (message.tankEntityId != null && message.hasOwnProperty("tankEntityId"))
                object.tankEntityId = message.tankEntityId;
            if (message.powerUpType != null && message.hasOwnProperty("powerUpType"))
                object.powerUpType = options.enums === String ? $root.battletanks.PowerUpType[message.powerUpType] === undefined ? message.powerUpType : $root.battletanks.PowerUpType[message.powerUpType] : message.powerUpType;
            if (message.powerUpEntityId != null && message.hasOwnProperty("powerUpEntityId"))
                object.powerUpEntityId = message.powerUpEntityId;
            return object;
        };

        /**
         * Converts this PowerUpPickedUpEvent to JSON.
         * @function toJSON
         * @memberof battletanks.PowerUpPickedUpEvent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PowerUpPickedUpEvent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for PowerUpPickedUpEvent
         * @function getTypeUrl
         * @memberof battletanks.PowerUpPickedUpEvent
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        PowerUpPickedUpEvent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/battletanks.PowerUpPickedUpEvent";
        };

        return PowerUpPickedUpEvent;
    })();

    battletanks.ProjectileHitEvent = (function() {

        /**
         * Properties of a ProjectileHitEvent.
         * @memberof battletanks
         * @interface IProjectileHitEvent
         * @property {number|null} [projectileEntityId] ProjectileHitEvent projectileEntityId
         * @property {number|null} [targetEntityId] ProjectileHitEvent targetEntityId
         * @property {battletanks.IVector3|null} [hitPosition] ProjectileHitEvent hitPosition
         * @property {number|null} [damageDealt] ProjectileHitEvent damageDealt
         */

        /**
         * Constructs a new ProjectileHitEvent.
         * @memberof battletanks
         * @classdesc Represents a ProjectileHitEvent.
         * @implements IProjectileHitEvent
         * @constructor
         * @param {battletanks.IProjectileHitEvent=} [properties] Properties to set
         */
        function ProjectileHitEvent(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ProjectileHitEvent projectileEntityId.
         * @member {number} projectileEntityId
         * @memberof battletanks.ProjectileHitEvent
         * @instance
         */
        ProjectileHitEvent.prototype.projectileEntityId = 0;

        /**
         * ProjectileHitEvent targetEntityId.
         * @member {number} targetEntityId
         * @memberof battletanks.ProjectileHitEvent
         * @instance
         */
        ProjectileHitEvent.prototype.targetEntityId = 0;

        /**
         * ProjectileHitEvent hitPosition.
         * @member {battletanks.IVector3|null|undefined} hitPosition
         * @memberof battletanks.ProjectileHitEvent
         * @instance
         */
        ProjectileHitEvent.prototype.hitPosition = null;

        /**
         * ProjectileHitEvent damageDealt.
         * @member {number} damageDealt
         * @memberof battletanks.ProjectileHitEvent
         * @instance
         */
        ProjectileHitEvent.prototype.damageDealt = 0;

        /**
         * Creates a new ProjectileHitEvent instance using the specified properties.
         * @function create
         * @memberof battletanks.ProjectileHitEvent
         * @static
         * @param {battletanks.IProjectileHitEvent=} [properties] Properties to set
         * @returns {battletanks.ProjectileHitEvent} ProjectileHitEvent instance
         */
        ProjectileHitEvent.create = function create(properties) {
            return new ProjectileHitEvent(properties);
        };

        /**
         * Encodes the specified ProjectileHitEvent message. Does not implicitly {@link battletanks.ProjectileHitEvent.verify|verify} messages.
         * @function encode
         * @memberof battletanks.ProjectileHitEvent
         * @static
         * @param {battletanks.IProjectileHitEvent} message ProjectileHitEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProjectileHitEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.projectileEntityId != null && Object.hasOwnProperty.call(message, "projectileEntityId"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.projectileEntityId);
            if (message.targetEntityId != null && Object.hasOwnProperty.call(message, "targetEntityId"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.targetEntityId);
            if (message.hitPosition != null && Object.hasOwnProperty.call(message, "hitPosition"))
                $root.battletanks.Vector3.encode(message.hitPosition, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.damageDealt != null && Object.hasOwnProperty.call(message, "damageDealt"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.damageDealt);
            return writer;
        };

        /**
         * Encodes the specified ProjectileHitEvent message, length delimited. Does not implicitly {@link battletanks.ProjectileHitEvent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof battletanks.ProjectileHitEvent
         * @static
         * @param {battletanks.IProjectileHitEvent} message ProjectileHitEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProjectileHitEvent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ProjectileHitEvent message from the specified reader or buffer.
         * @function decode
         * @memberof battletanks.ProjectileHitEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {battletanks.ProjectileHitEvent} ProjectileHitEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProjectileHitEvent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.battletanks.ProjectileHitEvent();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.projectileEntityId = reader.uint32();
                        break;
                    }
                case 2: {
                        message.targetEntityId = reader.uint32();
                        break;
                    }
                case 3: {
                        message.hitPosition = $root.battletanks.Vector3.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.damageDealt = reader.uint32();
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
         * Decodes a ProjectileHitEvent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof battletanks.ProjectileHitEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {battletanks.ProjectileHitEvent} ProjectileHitEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProjectileHitEvent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ProjectileHitEvent message.
         * @function verify
         * @memberof battletanks.ProjectileHitEvent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ProjectileHitEvent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.projectileEntityId != null && message.hasOwnProperty("projectileEntityId"))
                if (!$util.isInteger(message.projectileEntityId))
                    return "projectileEntityId: integer expected";
            if (message.targetEntityId != null && message.hasOwnProperty("targetEntityId"))
                if (!$util.isInteger(message.targetEntityId))
                    return "targetEntityId: integer expected";
            if (message.hitPosition != null && message.hasOwnProperty("hitPosition")) {
                var error = $root.battletanks.Vector3.verify(message.hitPosition);
                if (error)
                    return "hitPosition." + error;
            }
            if (message.damageDealt != null && message.hasOwnProperty("damageDealt"))
                if (!$util.isInteger(message.damageDealt))
                    return "damageDealt: integer expected";
            return null;
        };

        /**
         * Creates a ProjectileHitEvent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof battletanks.ProjectileHitEvent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {battletanks.ProjectileHitEvent} ProjectileHitEvent
         */
        ProjectileHitEvent.fromObject = function fromObject(object) {
            if (object instanceof $root.battletanks.ProjectileHitEvent)
                return object;
            var message = new $root.battletanks.ProjectileHitEvent();
            if (object.projectileEntityId != null)
                message.projectileEntityId = object.projectileEntityId >>> 0;
            if (object.targetEntityId != null)
                message.targetEntityId = object.targetEntityId >>> 0;
            if (object.hitPosition != null) {
                if (typeof object.hitPosition !== "object")
                    throw TypeError(".battletanks.ProjectileHitEvent.hitPosition: object expected");
                message.hitPosition = $root.battletanks.Vector3.fromObject(object.hitPosition);
            }
            if (object.damageDealt != null)
                message.damageDealt = object.damageDealt >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a ProjectileHitEvent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof battletanks.ProjectileHitEvent
         * @static
         * @param {battletanks.ProjectileHitEvent} message ProjectileHitEvent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ProjectileHitEvent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.projectileEntityId = 0;
                object.targetEntityId = 0;
                object.hitPosition = null;
                object.damageDealt = 0;
            }
            if (message.projectileEntityId != null && message.hasOwnProperty("projectileEntityId"))
                object.projectileEntityId = message.projectileEntityId;
            if (message.targetEntityId != null && message.hasOwnProperty("targetEntityId"))
                object.targetEntityId = message.targetEntityId;
            if (message.hitPosition != null && message.hasOwnProperty("hitPosition"))
                object.hitPosition = $root.battletanks.Vector3.toObject(message.hitPosition, options);
            if (message.damageDealt != null && message.hasOwnProperty("damageDealt"))
                object.damageDealt = message.damageDealt;
            return object;
        };

        /**
         * Converts this ProjectileHitEvent to JSON.
         * @function toJSON
         * @memberof battletanks.ProjectileHitEvent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ProjectileHitEvent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ProjectileHitEvent
         * @function getTypeUrl
         * @memberof battletanks.ProjectileHitEvent
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ProjectileHitEvent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/battletanks.ProjectileHitEvent";
        };

        return ProjectileHitEvent;
    })();

    battletanks.ChatMessageEvent = (function() {

        /**
         * Properties of a ChatMessageEvent.
         * @memberof battletanks
         * @interface IChatMessageEvent
         * @property {string|null} [playerId] ChatMessageEvent playerId
         * @property {string|null} [displayName] ChatMessageEvent displayName
         * @property {string|null} [message] ChatMessageEvent message
         * @property {number|Long|null} [timestamp] ChatMessageEvent timestamp
         */

        /**
         * Constructs a new ChatMessageEvent.
         * @memberof battletanks
         * @classdesc Represents a ChatMessageEvent.
         * @implements IChatMessageEvent
         * @constructor
         * @param {battletanks.IChatMessageEvent=} [properties] Properties to set
         */
        function ChatMessageEvent(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ChatMessageEvent playerId.
         * @member {string} playerId
         * @memberof battletanks.ChatMessageEvent
         * @instance
         */
        ChatMessageEvent.prototype.playerId = "";

        /**
         * ChatMessageEvent displayName.
         * @member {string} displayName
         * @memberof battletanks.ChatMessageEvent
         * @instance
         */
        ChatMessageEvent.prototype.displayName = "";

        /**
         * ChatMessageEvent message.
         * @member {string} message
         * @memberof battletanks.ChatMessageEvent
         * @instance
         */
        ChatMessageEvent.prototype.message = "";

        /**
         * ChatMessageEvent timestamp.
         * @member {number|Long} timestamp
         * @memberof battletanks.ChatMessageEvent
         * @instance
         */
        ChatMessageEvent.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * Creates a new ChatMessageEvent instance using the specified properties.
         * @function create
         * @memberof battletanks.ChatMessageEvent
         * @static
         * @param {battletanks.IChatMessageEvent=} [properties] Properties to set
         * @returns {battletanks.ChatMessageEvent} ChatMessageEvent instance
         */
        ChatMessageEvent.create = function create(properties) {
            return new ChatMessageEvent(properties);
        };

        /**
         * Encodes the specified ChatMessageEvent message. Does not implicitly {@link battletanks.ChatMessageEvent.verify|verify} messages.
         * @function encode
         * @memberof battletanks.ChatMessageEvent
         * @static
         * @param {battletanks.IChatMessageEvent} message ChatMessageEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ChatMessageEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.playerId != null && Object.hasOwnProperty.call(message, "playerId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.playerId);
            if (message.displayName != null && Object.hasOwnProperty.call(message, "displayName"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.displayName);
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.message);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.timestamp);
            return writer;
        };

        /**
         * Encodes the specified ChatMessageEvent message, length delimited. Does not implicitly {@link battletanks.ChatMessageEvent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof battletanks.ChatMessageEvent
         * @static
         * @param {battletanks.IChatMessageEvent} message ChatMessageEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ChatMessageEvent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ChatMessageEvent message from the specified reader or buffer.
         * @function decode
         * @memberof battletanks.ChatMessageEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {battletanks.ChatMessageEvent} ChatMessageEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ChatMessageEvent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.battletanks.ChatMessageEvent();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.playerId = reader.string();
                        break;
                    }
                case 2: {
                        message.displayName = reader.string();
                        break;
                    }
                case 3: {
                        message.message = reader.string();
                        break;
                    }
                case 4: {
                        message.timestamp = reader.uint64();
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
         * Decodes a ChatMessageEvent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof battletanks.ChatMessageEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {battletanks.ChatMessageEvent} ChatMessageEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ChatMessageEvent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ChatMessageEvent message.
         * @function verify
         * @memberof battletanks.ChatMessageEvent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ChatMessageEvent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.playerId != null && message.hasOwnProperty("playerId"))
                if (!$util.isString(message.playerId))
                    return "playerId: string expected";
            if (message.displayName != null && message.hasOwnProperty("displayName"))
                if (!$util.isString(message.displayName))
                    return "displayName: string expected";
            if (message.message != null && message.hasOwnProperty("message"))
                if (!$util.isString(message.message))
                    return "message: string expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            return null;
        };

        /**
         * Creates a ChatMessageEvent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof battletanks.ChatMessageEvent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {battletanks.ChatMessageEvent} ChatMessageEvent
         */
        ChatMessageEvent.fromObject = function fromObject(object) {
            if (object instanceof $root.battletanks.ChatMessageEvent)
                return object;
            var message = new $root.battletanks.ChatMessageEvent();
            if (object.playerId != null)
                message.playerId = String(object.playerId);
            if (object.displayName != null)
                message.displayName = String(object.displayName);
            if (object.message != null)
                message.message = String(object.message);
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = true;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber(true);
            return message;
        };

        /**
         * Creates a plain object from a ChatMessageEvent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof battletanks.ChatMessageEvent
         * @static
         * @param {battletanks.ChatMessageEvent} message ChatMessageEvent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ChatMessageEvent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.playerId = "";
                object.displayName = "";
                object.message = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
            }
            if (message.playerId != null && message.hasOwnProperty("playerId"))
                object.playerId = message.playerId;
            if (message.displayName != null && message.hasOwnProperty("displayName"))
                object.displayName = message.displayName;
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = message.message;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber(true) : message.timestamp;
            return object;
        };

        /**
         * Converts this ChatMessageEvent to JSON.
         * @function toJSON
         * @memberof battletanks.ChatMessageEvent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ChatMessageEvent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ChatMessageEvent
         * @function getTypeUrl
         * @memberof battletanks.ChatMessageEvent
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ChatMessageEvent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/battletanks.ChatMessageEvent";
        };

        return ChatMessageEvent;
    })();

    battletanks.RoundStartedEvent = (function() {

        /**
         * Properties of a RoundStartedEvent.
         * @memberof battletanks
         * @interface IRoundStartedEvent
         * @property {number|null} [roundNumber] RoundStartedEvent roundNumber
         * @property {number|null} [roundDuration] RoundStartedEvent roundDuration
         */

        /**
         * Constructs a new RoundStartedEvent.
         * @memberof battletanks
         * @classdesc Represents a RoundStartedEvent.
         * @implements IRoundStartedEvent
         * @constructor
         * @param {battletanks.IRoundStartedEvent=} [properties] Properties to set
         */
        function RoundStartedEvent(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RoundStartedEvent roundNumber.
         * @member {number} roundNumber
         * @memberof battletanks.RoundStartedEvent
         * @instance
         */
        RoundStartedEvent.prototype.roundNumber = 0;

        /**
         * RoundStartedEvent roundDuration.
         * @member {number} roundDuration
         * @memberof battletanks.RoundStartedEvent
         * @instance
         */
        RoundStartedEvent.prototype.roundDuration = 0;

        /**
         * Creates a new RoundStartedEvent instance using the specified properties.
         * @function create
         * @memberof battletanks.RoundStartedEvent
         * @static
         * @param {battletanks.IRoundStartedEvent=} [properties] Properties to set
         * @returns {battletanks.RoundStartedEvent} RoundStartedEvent instance
         */
        RoundStartedEvent.create = function create(properties) {
            return new RoundStartedEvent(properties);
        };

        /**
         * Encodes the specified RoundStartedEvent message. Does not implicitly {@link battletanks.RoundStartedEvent.verify|verify} messages.
         * @function encode
         * @memberof battletanks.RoundStartedEvent
         * @static
         * @param {battletanks.IRoundStartedEvent} message RoundStartedEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoundStartedEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roundNumber != null && Object.hasOwnProperty.call(message, "roundNumber"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.roundNumber);
            if (message.roundDuration != null && Object.hasOwnProperty.call(message, "roundDuration"))
                writer.uint32(/* id 2, wireType 5 =*/21).float(message.roundDuration);
            return writer;
        };

        /**
         * Encodes the specified RoundStartedEvent message, length delimited. Does not implicitly {@link battletanks.RoundStartedEvent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof battletanks.RoundStartedEvent
         * @static
         * @param {battletanks.IRoundStartedEvent} message RoundStartedEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoundStartedEvent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RoundStartedEvent message from the specified reader or buffer.
         * @function decode
         * @memberof battletanks.RoundStartedEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {battletanks.RoundStartedEvent} RoundStartedEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoundStartedEvent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.battletanks.RoundStartedEvent();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.roundNumber = reader.uint32();
                        break;
                    }
                case 2: {
                        message.roundDuration = reader.float();
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
         * Decodes a RoundStartedEvent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof battletanks.RoundStartedEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {battletanks.RoundStartedEvent} RoundStartedEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoundStartedEvent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RoundStartedEvent message.
         * @function verify
         * @memberof battletanks.RoundStartedEvent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RoundStartedEvent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roundNumber != null && message.hasOwnProperty("roundNumber"))
                if (!$util.isInteger(message.roundNumber))
                    return "roundNumber: integer expected";
            if (message.roundDuration != null && message.hasOwnProperty("roundDuration"))
                if (typeof message.roundDuration !== "number")
                    return "roundDuration: number expected";
            return null;
        };

        /**
         * Creates a RoundStartedEvent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof battletanks.RoundStartedEvent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {battletanks.RoundStartedEvent} RoundStartedEvent
         */
        RoundStartedEvent.fromObject = function fromObject(object) {
            if (object instanceof $root.battletanks.RoundStartedEvent)
                return object;
            var message = new $root.battletanks.RoundStartedEvent();
            if (object.roundNumber != null)
                message.roundNumber = object.roundNumber >>> 0;
            if (object.roundDuration != null)
                message.roundDuration = Number(object.roundDuration);
            return message;
        };

        /**
         * Creates a plain object from a RoundStartedEvent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof battletanks.RoundStartedEvent
         * @static
         * @param {battletanks.RoundStartedEvent} message RoundStartedEvent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RoundStartedEvent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.roundNumber = 0;
                object.roundDuration = 0;
            }
            if (message.roundNumber != null && message.hasOwnProperty("roundNumber"))
                object.roundNumber = message.roundNumber;
            if (message.roundDuration != null && message.hasOwnProperty("roundDuration"))
                object.roundDuration = options.json && !isFinite(message.roundDuration) ? String(message.roundDuration) : message.roundDuration;
            return object;
        };

        /**
         * Converts this RoundStartedEvent to JSON.
         * @function toJSON
         * @memberof battletanks.RoundStartedEvent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RoundStartedEvent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for RoundStartedEvent
         * @function getTypeUrl
         * @memberof battletanks.RoundStartedEvent
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        RoundStartedEvent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/battletanks.RoundStartedEvent";
        };

        return RoundStartedEvent;
    })();

    battletanks.RoundEndedEvent = (function() {

        /**
         * Properties of a RoundEndedEvent.
         * @memberof battletanks
         * @interface IRoundEndedEvent
         * @property {number|null} [roundNumber] RoundEndedEvent roundNumber
         * @property {Array.<battletanks.IPlayerScore>|null} [finalScores] RoundEndedEvent finalScores
         * @property {string|null} [winnerPlayerId] RoundEndedEvent winnerPlayerId
         */

        /**
         * Constructs a new RoundEndedEvent.
         * @memberof battletanks
         * @classdesc Represents a RoundEndedEvent.
         * @implements IRoundEndedEvent
         * @constructor
         * @param {battletanks.IRoundEndedEvent=} [properties] Properties to set
         */
        function RoundEndedEvent(properties) {
            this.finalScores = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RoundEndedEvent roundNumber.
         * @member {number} roundNumber
         * @memberof battletanks.RoundEndedEvent
         * @instance
         */
        RoundEndedEvent.prototype.roundNumber = 0;

        /**
         * RoundEndedEvent finalScores.
         * @member {Array.<battletanks.IPlayerScore>} finalScores
         * @memberof battletanks.RoundEndedEvent
         * @instance
         */
        RoundEndedEvent.prototype.finalScores = $util.emptyArray;

        /**
         * RoundEndedEvent winnerPlayerId.
         * @member {string} winnerPlayerId
         * @memberof battletanks.RoundEndedEvent
         * @instance
         */
        RoundEndedEvent.prototype.winnerPlayerId = "";

        /**
         * Creates a new RoundEndedEvent instance using the specified properties.
         * @function create
         * @memberof battletanks.RoundEndedEvent
         * @static
         * @param {battletanks.IRoundEndedEvent=} [properties] Properties to set
         * @returns {battletanks.RoundEndedEvent} RoundEndedEvent instance
         */
        RoundEndedEvent.create = function create(properties) {
            return new RoundEndedEvent(properties);
        };

        /**
         * Encodes the specified RoundEndedEvent message. Does not implicitly {@link battletanks.RoundEndedEvent.verify|verify} messages.
         * @function encode
         * @memberof battletanks.RoundEndedEvent
         * @static
         * @param {battletanks.IRoundEndedEvent} message RoundEndedEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoundEndedEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roundNumber != null && Object.hasOwnProperty.call(message, "roundNumber"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.roundNumber);
            if (message.finalScores != null && message.finalScores.length)
                for (var i = 0; i < message.finalScores.length; ++i)
                    $root.battletanks.PlayerScore.encode(message.finalScores[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.winnerPlayerId != null && Object.hasOwnProperty.call(message, "winnerPlayerId"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.winnerPlayerId);
            return writer;
        };

        /**
         * Encodes the specified RoundEndedEvent message, length delimited. Does not implicitly {@link battletanks.RoundEndedEvent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof battletanks.RoundEndedEvent
         * @static
         * @param {battletanks.IRoundEndedEvent} message RoundEndedEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoundEndedEvent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RoundEndedEvent message from the specified reader or buffer.
         * @function decode
         * @memberof battletanks.RoundEndedEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {battletanks.RoundEndedEvent} RoundEndedEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoundEndedEvent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.battletanks.RoundEndedEvent();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.roundNumber = reader.uint32();
                        break;
                    }
                case 2: {
                        if (!(message.finalScores && message.finalScores.length))
                            message.finalScores = [];
                        message.finalScores.push($root.battletanks.PlayerScore.decode(reader, reader.uint32()));
                        break;
                    }
                case 3: {
                        message.winnerPlayerId = reader.string();
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
         * Decodes a RoundEndedEvent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof battletanks.RoundEndedEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {battletanks.RoundEndedEvent} RoundEndedEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoundEndedEvent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RoundEndedEvent message.
         * @function verify
         * @memberof battletanks.RoundEndedEvent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RoundEndedEvent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roundNumber != null && message.hasOwnProperty("roundNumber"))
                if (!$util.isInteger(message.roundNumber))
                    return "roundNumber: integer expected";
            if (message.finalScores != null && message.hasOwnProperty("finalScores")) {
                if (!Array.isArray(message.finalScores))
                    return "finalScores: array expected";
                for (var i = 0; i < message.finalScores.length; ++i) {
                    var error = $root.battletanks.PlayerScore.verify(message.finalScores[i]);
                    if (error)
                        return "finalScores." + error;
                }
            }
            if (message.winnerPlayerId != null && message.hasOwnProperty("winnerPlayerId"))
                if (!$util.isString(message.winnerPlayerId))
                    return "winnerPlayerId: string expected";
            return null;
        };

        /**
         * Creates a RoundEndedEvent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof battletanks.RoundEndedEvent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {battletanks.RoundEndedEvent} RoundEndedEvent
         */
        RoundEndedEvent.fromObject = function fromObject(object) {
            if (object instanceof $root.battletanks.RoundEndedEvent)
                return object;
            var message = new $root.battletanks.RoundEndedEvent();
            if (object.roundNumber != null)
                message.roundNumber = object.roundNumber >>> 0;
            if (object.finalScores) {
                if (!Array.isArray(object.finalScores))
                    throw TypeError(".battletanks.RoundEndedEvent.finalScores: array expected");
                message.finalScores = [];
                for (var i = 0; i < object.finalScores.length; ++i) {
                    if (typeof object.finalScores[i] !== "object")
                        throw TypeError(".battletanks.RoundEndedEvent.finalScores: object expected");
                    message.finalScores[i] = $root.battletanks.PlayerScore.fromObject(object.finalScores[i]);
                }
            }
            if (object.winnerPlayerId != null)
                message.winnerPlayerId = String(object.winnerPlayerId);
            return message;
        };

        /**
         * Creates a plain object from a RoundEndedEvent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof battletanks.RoundEndedEvent
         * @static
         * @param {battletanks.RoundEndedEvent} message RoundEndedEvent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RoundEndedEvent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.finalScores = [];
            if (options.defaults) {
                object.roundNumber = 0;
                object.winnerPlayerId = "";
            }
            if (message.roundNumber != null && message.hasOwnProperty("roundNumber"))
                object.roundNumber = message.roundNumber;
            if (message.finalScores && message.finalScores.length) {
                object.finalScores = [];
                for (var j = 0; j < message.finalScores.length; ++j)
                    object.finalScores[j] = $root.battletanks.PlayerScore.toObject(message.finalScores[j], options);
            }
            if (message.winnerPlayerId != null && message.hasOwnProperty("winnerPlayerId"))
                object.winnerPlayerId = message.winnerPlayerId;
            return object;
        };

        /**
         * Converts this RoundEndedEvent to JSON.
         * @function toJSON
         * @memberof battletanks.RoundEndedEvent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RoundEndedEvent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for RoundEndedEvent
         * @function getTypeUrl
         * @memberof battletanks.RoundEndedEvent
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        RoundEndedEvent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/battletanks.RoundEndedEvent";
        };

        return RoundEndedEvent;
    })();

    battletanks.PlayerScore = (function() {

        /**
         * Properties of a PlayerScore.
         * @memberof battletanks
         * @interface IPlayerScore
         * @property {string|null} [playerId] PlayerScore playerId
         * @property {string|null} [displayName] PlayerScore displayName
         * @property {number|null} [kills] PlayerScore kills
         * @property {number|null} [deaths] PlayerScore deaths
         * @property {number|null} [score] PlayerScore score
         */

        /**
         * Constructs a new PlayerScore.
         * @memberof battletanks
         * @classdesc Represents a PlayerScore.
         * @implements IPlayerScore
         * @constructor
         * @param {battletanks.IPlayerScore=} [properties] Properties to set
         */
        function PlayerScore(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PlayerScore playerId.
         * @member {string} playerId
         * @memberof battletanks.PlayerScore
         * @instance
         */
        PlayerScore.prototype.playerId = "";

        /**
         * PlayerScore displayName.
         * @member {string} displayName
         * @memberof battletanks.PlayerScore
         * @instance
         */
        PlayerScore.prototype.displayName = "";

        /**
         * PlayerScore kills.
         * @member {number} kills
         * @memberof battletanks.PlayerScore
         * @instance
         */
        PlayerScore.prototype.kills = 0;

        /**
         * PlayerScore deaths.
         * @member {number} deaths
         * @memberof battletanks.PlayerScore
         * @instance
         */
        PlayerScore.prototype.deaths = 0;

        /**
         * PlayerScore score.
         * @member {number} score
         * @memberof battletanks.PlayerScore
         * @instance
         */
        PlayerScore.prototype.score = 0;

        /**
         * Creates a new PlayerScore instance using the specified properties.
         * @function create
         * @memberof battletanks.PlayerScore
         * @static
         * @param {battletanks.IPlayerScore=} [properties] Properties to set
         * @returns {battletanks.PlayerScore} PlayerScore instance
         */
        PlayerScore.create = function create(properties) {
            return new PlayerScore(properties);
        };

        /**
         * Encodes the specified PlayerScore message. Does not implicitly {@link battletanks.PlayerScore.verify|verify} messages.
         * @function encode
         * @memberof battletanks.PlayerScore
         * @static
         * @param {battletanks.IPlayerScore} message PlayerScore message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerScore.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.playerId != null && Object.hasOwnProperty.call(message, "playerId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.playerId);
            if (message.displayName != null && Object.hasOwnProperty.call(message, "displayName"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.displayName);
            if (message.kills != null && Object.hasOwnProperty.call(message, "kills"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.kills);
            if (message.deaths != null && Object.hasOwnProperty.call(message, "deaths"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.deaths);
            if (message.score != null && Object.hasOwnProperty.call(message, "score"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.score);
            return writer;
        };

        /**
         * Encodes the specified PlayerScore message, length delimited. Does not implicitly {@link battletanks.PlayerScore.verify|verify} messages.
         * @function encodeDelimited
         * @memberof battletanks.PlayerScore
         * @static
         * @param {battletanks.IPlayerScore} message PlayerScore message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerScore.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PlayerScore message from the specified reader or buffer.
         * @function decode
         * @memberof battletanks.PlayerScore
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {battletanks.PlayerScore} PlayerScore
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerScore.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.battletanks.PlayerScore();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.playerId = reader.string();
                        break;
                    }
                case 2: {
                        message.displayName = reader.string();
                        break;
                    }
                case 3: {
                        message.kills = reader.uint32();
                        break;
                    }
                case 4: {
                        message.deaths = reader.uint32();
                        break;
                    }
                case 5: {
                        message.score = reader.uint32();
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
         * Decodes a PlayerScore message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof battletanks.PlayerScore
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {battletanks.PlayerScore} PlayerScore
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerScore.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PlayerScore message.
         * @function verify
         * @memberof battletanks.PlayerScore
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PlayerScore.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.playerId != null && message.hasOwnProperty("playerId"))
                if (!$util.isString(message.playerId))
                    return "playerId: string expected";
            if (message.displayName != null && message.hasOwnProperty("displayName"))
                if (!$util.isString(message.displayName))
                    return "displayName: string expected";
            if (message.kills != null && message.hasOwnProperty("kills"))
                if (!$util.isInteger(message.kills))
                    return "kills: integer expected";
            if (message.deaths != null && message.hasOwnProperty("deaths"))
                if (!$util.isInteger(message.deaths))
                    return "deaths: integer expected";
            if (message.score != null && message.hasOwnProperty("score"))
                if (!$util.isInteger(message.score))
                    return "score: integer expected";
            return null;
        };

        /**
         * Creates a PlayerScore message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof battletanks.PlayerScore
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {battletanks.PlayerScore} PlayerScore
         */
        PlayerScore.fromObject = function fromObject(object) {
            if (object instanceof $root.battletanks.PlayerScore)
                return object;
            var message = new $root.battletanks.PlayerScore();
            if (object.playerId != null)
                message.playerId = String(object.playerId);
            if (object.displayName != null)
                message.displayName = String(object.displayName);
            if (object.kills != null)
                message.kills = object.kills >>> 0;
            if (object.deaths != null)
                message.deaths = object.deaths >>> 0;
            if (object.score != null)
                message.score = object.score >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a PlayerScore message. Also converts values to other types if specified.
         * @function toObject
         * @memberof battletanks.PlayerScore
         * @static
         * @param {battletanks.PlayerScore} message PlayerScore
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PlayerScore.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.playerId = "";
                object.displayName = "";
                object.kills = 0;
                object.deaths = 0;
                object.score = 0;
            }
            if (message.playerId != null && message.hasOwnProperty("playerId"))
                object.playerId = message.playerId;
            if (message.displayName != null && message.hasOwnProperty("displayName"))
                object.displayName = message.displayName;
            if (message.kills != null && message.hasOwnProperty("kills"))
                object.kills = message.kills;
            if (message.deaths != null && message.hasOwnProperty("deaths"))
                object.deaths = message.deaths;
            if (message.score != null && message.hasOwnProperty("score"))
                object.score = message.score;
            return object;
        };

        /**
         * Converts this PlayerScore to JSON.
         * @function toJSON
         * @memberof battletanks.PlayerScore
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PlayerScore.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for PlayerScore
         * @function getTypeUrl
         * @memberof battletanks.PlayerScore
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        PlayerScore.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/battletanks.PlayerScore";
        };

        return PlayerScore;
    })();

    battletanks.GameStateUpdate = (function() {

        /**
         * Properties of a GameStateUpdate.
         * @memberof battletanks
         * @interface IGameStateUpdate
         * @property {number|Long|null} [tick] GameStateUpdate tick
         * @property {number|null} [roundTimeRemaining] GameStateUpdate roundTimeRemaining
         * @property {Array.<battletanks.ITankState>|null} [tanks] GameStateUpdate tanks
         * @property {Array.<battletanks.IProjectileState>|null} [projectiles] GameStateUpdate projectiles
         * @property {Array.<battletanks.IPowerUpState>|null} [powerUps] GameStateUpdate powerUps
         * @property {Array.<battletanks.IGameEvent>|null} [events] GameStateUpdate events
         * @property {Array.<battletanks.IPlayerScore>|null} [scores] GameStateUpdate scores
         * @property {boolean|null} [isDeltaUpdate] GameStateUpdate isDeltaUpdate
         * @property {number|null} [fullStateTick] GameStateUpdate fullStateTick
         */

        /**
         * Constructs a new GameStateUpdate.
         * @memberof battletanks
         * @classdesc Represents a GameStateUpdate.
         * @implements IGameStateUpdate
         * @constructor
         * @param {battletanks.IGameStateUpdate=} [properties] Properties to set
         */
        function GameStateUpdate(properties) {
            this.tanks = [];
            this.projectiles = [];
            this.powerUps = [];
            this.events = [];
            this.scores = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GameStateUpdate tick.
         * @member {number|Long} tick
         * @memberof battletanks.GameStateUpdate
         * @instance
         */
        GameStateUpdate.prototype.tick = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * GameStateUpdate roundTimeRemaining.
         * @member {number} roundTimeRemaining
         * @memberof battletanks.GameStateUpdate
         * @instance
         */
        GameStateUpdate.prototype.roundTimeRemaining = 0;

        /**
         * GameStateUpdate tanks.
         * @member {Array.<battletanks.ITankState>} tanks
         * @memberof battletanks.GameStateUpdate
         * @instance
         */
        GameStateUpdate.prototype.tanks = $util.emptyArray;

        /**
         * GameStateUpdate projectiles.
         * @member {Array.<battletanks.IProjectileState>} projectiles
         * @memberof battletanks.GameStateUpdate
         * @instance
         */
        GameStateUpdate.prototype.projectiles = $util.emptyArray;

        /**
         * GameStateUpdate powerUps.
         * @member {Array.<battletanks.IPowerUpState>} powerUps
         * @memberof battletanks.GameStateUpdate
         * @instance
         */
        GameStateUpdate.prototype.powerUps = $util.emptyArray;

        /**
         * GameStateUpdate events.
         * @member {Array.<battletanks.IGameEvent>} events
         * @memberof battletanks.GameStateUpdate
         * @instance
         */
        GameStateUpdate.prototype.events = $util.emptyArray;

        /**
         * GameStateUpdate scores.
         * @member {Array.<battletanks.IPlayerScore>} scores
         * @memberof battletanks.GameStateUpdate
         * @instance
         */
        GameStateUpdate.prototype.scores = $util.emptyArray;

        /**
         * GameStateUpdate isDeltaUpdate.
         * @member {boolean} isDeltaUpdate
         * @memberof battletanks.GameStateUpdate
         * @instance
         */
        GameStateUpdate.prototype.isDeltaUpdate = false;

        /**
         * GameStateUpdate fullStateTick.
         * @member {number} fullStateTick
         * @memberof battletanks.GameStateUpdate
         * @instance
         */
        GameStateUpdate.prototype.fullStateTick = 0;

        /**
         * Creates a new GameStateUpdate instance using the specified properties.
         * @function create
         * @memberof battletanks.GameStateUpdate
         * @static
         * @param {battletanks.IGameStateUpdate=} [properties] Properties to set
         * @returns {battletanks.GameStateUpdate} GameStateUpdate instance
         */
        GameStateUpdate.create = function create(properties) {
            return new GameStateUpdate(properties);
        };

        /**
         * Encodes the specified GameStateUpdate message. Does not implicitly {@link battletanks.GameStateUpdate.verify|verify} messages.
         * @function encode
         * @memberof battletanks.GameStateUpdate
         * @static
         * @param {battletanks.IGameStateUpdate} message GameStateUpdate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameStateUpdate.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.tick != null && Object.hasOwnProperty.call(message, "tick"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.tick);
            if (message.roundTimeRemaining != null && Object.hasOwnProperty.call(message, "roundTimeRemaining"))
                writer.uint32(/* id 2, wireType 5 =*/21).float(message.roundTimeRemaining);
            if (message.tanks != null && message.tanks.length)
                for (var i = 0; i < message.tanks.length; ++i)
                    $root.battletanks.TankState.encode(message.tanks[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.projectiles != null && message.projectiles.length)
                for (var i = 0; i < message.projectiles.length; ++i)
                    $root.battletanks.ProjectileState.encode(message.projectiles[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.powerUps != null && message.powerUps.length)
                for (var i = 0; i < message.powerUps.length; ++i)
                    $root.battletanks.PowerUpState.encode(message.powerUps[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.events != null && message.events.length)
                for (var i = 0; i < message.events.length; ++i)
                    $root.battletanks.GameEvent.encode(message.events[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.scores != null && message.scores.length)
                for (var i = 0; i < message.scores.length; ++i)
                    $root.battletanks.PlayerScore.encode(message.scores[i], writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            if (message.isDeltaUpdate != null && Object.hasOwnProperty.call(message, "isDeltaUpdate"))
                writer.uint32(/* id 8, wireType 0 =*/64).bool(message.isDeltaUpdate);
            if (message.fullStateTick != null && Object.hasOwnProperty.call(message, "fullStateTick"))
                writer.uint32(/* id 9, wireType 0 =*/72).uint32(message.fullStateTick);
            return writer;
        };

        /**
         * Encodes the specified GameStateUpdate message, length delimited. Does not implicitly {@link battletanks.GameStateUpdate.verify|verify} messages.
         * @function encodeDelimited
         * @memberof battletanks.GameStateUpdate
         * @static
         * @param {battletanks.IGameStateUpdate} message GameStateUpdate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameStateUpdate.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GameStateUpdate message from the specified reader or buffer.
         * @function decode
         * @memberof battletanks.GameStateUpdate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {battletanks.GameStateUpdate} GameStateUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameStateUpdate.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.battletanks.GameStateUpdate();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.tick = reader.uint64();
                        break;
                    }
                case 2: {
                        message.roundTimeRemaining = reader.float();
                        break;
                    }
                case 3: {
                        if (!(message.tanks && message.tanks.length))
                            message.tanks = [];
                        message.tanks.push($root.battletanks.TankState.decode(reader, reader.uint32()));
                        break;
                    }
                case 4: {
                        if (!(message.projectiles && message.projectiles.length))
                            message.projectiles = [];
                        message.projectiles.push($root.battletanks.ProjectileState.decode(reader, reader.uint32()));
                        break;
                    }
                case 5: {
                        if (!(message.powerUps && message.powerUps.length))
                            message.powerUps = [];
                        message.powerUps.push($root.battletanks.PowerUpState.decode(reader, reader.uint32()));
                        break;
                    }
                case 6: {
                        if (!(message.events && message.events.length))
                            message.events = [];
                        message.events.push($root.battletanks.GameEvent.decode(reader, reader.uint32()));
                        break;
                    }
                case 7: {
                        if (!(message.scores && message.scores.length))
                            message.scores = [];
                        message.scores.push($root.battletanks.PlayerScore.decode(reader, reader.uint32()));
                        break;
                    }
                case 8: {
                        message.isDeltaUpdate = reader.bool();
                        break;
                    }
                case 9: {
                        message.fullStateTick = reader.uint32();
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
         * Decodes a GameStateUpdate message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof battletanks.GameStateUpdate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {battletanks.GameStateUpdate} GameStateUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameStateUpdate.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GameStateUpdate message.
         * @function verify
         * @memberof battletanks.GameStateUpdate
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GameStateUpdate.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.tick != null && message.hasOwnProperty("tick"))
                if (!$util.isInteger(message.tick) && !(message.tick && $util.isInteger(message.tick.low) && $util.isInteger(message.tick.high)))
                    return "tick: integer|Long expected";
            if (message.roundTimeRemaining != null && message.hasOwnProperty("roundTimeRemaining"))
                if (typeof message.roundTimeRemaining !== "number")
                    return "roundTimeRemaining: number expected";
            if (message.tanks != null && message.hasOwnProperty("tanks")) {
                if (!Array.isArray(message.tanks))
                    return "tanks: array expected";
                for (var i = 0; i < message.tanks.length; ++i) {
                    var error = $root.battletanks.TankState.verify(message.tanks[i]);
                    if (error)
                        return "tanks." + error;
                }
            }
            if (message.projectiles != null && message.hasOwnProperty("projectiles")) {
                if (!Array.isArray(message.projectiles))
                    return "projectiles: array expected";
                for (var i = 0; i < message.projectiles.length; ++i) {
                    var error = $root.battletanks.ProjectileState.verify(message.projectiles[i]);
                    if (error)
                        return "projectiles." + error;
                }
            }
            if (message.powerUps != null && message.hasOwnProperty("powerUps")) {
                if (!Array.isArray(message.powerUps))
                    return "powerUps: array expected";
                for (var i = 0; i < message.powerUps.length; ++i) {
                    var error = $root.battletanks.PowerUpState.verify(message.powerUps[i]);
                    if (error)
                        return "powerUps." + error;
                }
            }
            if (message.events != null && message.hasOwnProperty("events")) {
                if (!Array.isArray(message.events))
                    return "events: array expected";
                for (var i = 0; i < message.events.length; ++i) {
                    var error = $root.battletanks.GameEvent.verify(message.events[i]);
                    if (error)
                        return "events." + error;
                }
            }
            if (message.scores != null && message.hasOwnProperty("scores")) {
                if (!Array.isArray(message.scores))
                    return "scores: array expected";
                for (var i = 0; i < message.scores.length; ++i) {
                    var error = $root.battletanks.PlayerScore.verify(message.scores[i]);
                    if (error)
                        return "scores." + error;
                }
            }
            if (message.isDeltaUpdate != null && message.hasOwnProperty("isDeltaUpdate"))
                if (typeof message.isDeltaUpdate !== "boolean")
                    return "isDeltaUpdate: boolean expected";
            if (message.fullStateTick != null && message.hasOwnProperty("fullStateTick"))
                if (!$util.isInteger(message.fullStateTick))
                    return "fullStateTick: integer expected";
            return null;
        };

        /**
         * Creates a GameStateUpdate message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof battletanks.GameStateUpdate
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {battletanks.GameStateUpdate} GameStateUpdate
         */
        GameStateUpdate.fromObject = function fromObject(object) {
            if (object instanceof $root.battletanks.GameStateUpdate)
                return object;
            var message = new $root.battletanks.GameStateUpdate();
            if (object.tick != null)
                if ($util.Long)
                    (message.tick = $util.Long.fromValue(object.tick)).unsigned = true;
                else if (typeof object.tick === "string")
                    message.tick = parseInt(object.tick, 10);
                else if (typeof object.tick === "number")
                    message.tick = object.tick;
                else if (typeof object.tick === "object")
                    message.tick = new $util.LongBits(object.tick.low >>> 0, object.tick.high >>> 0).toNumber(true);
            if (object.roundTimeRemaining != null)
                message.roundTimeRemaining = Number(object.roundTimeRemaining);
            if (object.tanks) {
                if (!Array.isArray(object.tanks))
                    throw TypeError(".battletanks.GameStateUpdate.tanks: array expected");
                message.tanks = [];
                for (var i = 0; i < object.tanks.length; ++i) {
                    if (typeof object.tanks[i] !== "object")
                        throw TypeError(".battletanks.GameStateUpdate.tanks: object expected");
                    message.tanks[i] = $root.battletanks.TankState.fromObject(object.tanks[i]);
                }
            }
            if (object.projectiles) {
                if (!Array.isArray(object.projectiles))
                    throw TypeError(".battletanks.GameStateUpdate.projectiles: array expected");
                message.projectiles = [];
                for (var i = 0; i < object.projectiles.length; ++i) {
                    if (typeof object.projectiles[i] !== "object")
                        throw TypeError(".battletanks.GameStateUpdate.projectiles: object expected");
                    message.projectiles[i] = $root.battletanks.ProjectileState.fromObject(object.projectiles[i]);
                }
            }
            if (object.powerUps) {
                if (!Array.isArray(object.powerUps))
                    throw TypeError(".battletanks.GameStateUpdate.powerUps: array expected");
                message.powerUps = [];
                for (var i = 0; i < object.powerUps.length; ++i) {
                    if (typeof object.powerUps[i] !== "object")
                        throw TypeError(".battletanks.GameStateUpdate.powerUps: object expected");
                    message.powerUps[i] = $root.battletanks.PowerUpState.fromObject(object.powerUps[i]);
                }
            }
            if (object.events) {
                if (!Array.isArray(object.events))
                    throw TypeError(".battletanks.GameStateUpdate.events: array expected");
                message.events = [];
                for (var i = 0; i < object.events.length; ++i) {
                    if (typeof object.events[i] !== "object")
                        throw TypeError(".battletanks.GameStateUpdate.events: object expected");
                    message.events[i] = $root.battletanks.GameEvent.fromObject(object.events[i]);
                }
            }
            if (object.scores) {
                if (!Array.isArray(object.scores))
                    throw TypeError(".battletanks.GameStateUpdate.scores: array expected");
                message.scores = [];
                for (var i = 0; i < object.scores.length; ++i) {
                    if (typeof object.scores[i] !== "object")
                        throw TypeError(".battletanks.GameStateUpdate.scores: object expected");
                    message.scores[i] = $root.battletanks.PlayerScore.fromObject(object.scores[i]);
                }
            }
            if (object.isDeltaUpdate != null)
                message.isDeltaUpdate = Boolean(object.isDeltaUpdate);
            if (object.fullStateTick != null)
                message.fullStateTick = object.fullStateTick >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a GameStateUpdate message. Also converts values to other types if specified.
         * @function toObject
         * @memberof battletanks.GameStateUpdate
         * @static
         * @param {battletanks.GameStateUpdate} message GameStateUpdate
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GameStateUpdate.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.tanks = [];
                object.projectiles = [];
                object.powerUps = [];
                object.events = [];
                object.scores = [];
            }
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.tick = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.tick = options.longs === String ? "0" : 0;
                object.roundTimeRemaining = 0;
                object.isDeltaUpdate = false;
                object.fullStateTick = 0;
            }
            if (message.tick != null && message.hasOwnProperty("tick"))
                if (typeof message.tick === "number")
                    object.tick = options.longs === String ? String(message.tick) : message.tick;
                else
                    object.tick = options.longs === String ? $util.Long.prototype.toString.call(message.tick) : options.longs === Number ? new $util.LongBits(message.tick.low >>> 0, message.tick.high >>> 0).toNumber(true) : message.tick;
            if (message.roundTimeRemaining != null && message.hasOwnProperty("roundTimeRemaining"))
                object.roundTimeRemaining = options.json && !isFinite(message.roundTimeRemaining) ? String(message.roundTimeRemaining) : message.roundTimeRemaining;
            if (message.tanks && message.tanks.length) {
                object.tanks = [];
                for (var j = 0; j < message.tanks.length; ++j)
                    object.tanks[j] = $root.battletanks.TankState.toObject(message.tanks[j], options);
            }
            if (message.projectiles && message.projectiles.length) {
                object.projectiles = [];
                for (var j = 0; j < message.projectiles.length; ++j)
                    object.projectiles[j] = $root.battletanks.ProjectileState.toObject(message.projectiles[j], options);
            }
            if (message.powerUps && message.powerUps.length) {
                object.powerUps = [];
                for (var j = 0; j < message.powerUps.length; ++j)
                    object.powerUps[j] = $root.battletanks.PowerUpState.toObject(message.powerUps[j], options);
            }
            if (message.events && message.events.length) {
                object.events = [];
                for (var j = 0; j < message.events.length; ++j)
                    object.events[j] = $root.battletanks.GameEvent.toObject(message.events[j], options);
            }
            if (message.scores && message.scores.length) {
                object.scores = [];
                for (var j = 0; j < message.scores.length; ++j)
                    object.scores[j] = $root.battletanks.PlayerScore.toObject(message.scores[j], options);
            }
            if (message.isDeltaUpdate != null && message.hasOwnProperty("isDeltaUpdate"))
                object.isDeltaUpdate = message.isDeltaUpdate;
            if (message.fullStateTick != null && message.hasOwnProperty("fullStateTick"))
                object.fullStateTick = message.fullStateTick;
            return object;
        };

        /**
         * Converts this GameStateUpdate to JSON.
         * @function toJSON
         * @memberof battletanks.GameStateUpdate
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GameStateUpdate.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GameStateUpdate
         * @function getTypeUrl
         * @memberof battletanks.GameStateUpdate
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GameStateUpdate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/battletanks.GameStateUpdate";
        };

        return GameStateUpdate;
    })();

    battletanks.JoinGameRequest = (function() {

        /**
         * Properties of a JoinGameRequest.
         * @memberof battletanks
         * @interface IJoinGameRequest
         * @property {string|null} [displayName] JoinGameRequest displayName
         * @property {string|null} [clientVersion] JoinGameRequest clientVersion
         */

        /**
         * Constructs a new JoinGameRequest.
         * @memberof battletanks
         * @classdesc Represents a JoinGameRequest.
         * @implements IJoinGameRequest
         * @constructor
         * @param {battletanks.IJoinGameRequest=} [properties] Properties to set
         */
        function JoinGameRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * JoinGameRequest displayName.
         * @member {string} displayName
         * @memberof battletanks.JoinGameRequest
         * @instance
         */
        JoinGameRequest.prototype.displayName = "";

        /**
         * JoinGameRequest clientVersion.
         * @member {string} clientVersion
         * @memberof battletanks.JoinGameRequest
         * @instance
         */
        JoinGameRequest.prototype.clientVersion = "";

        /**
         * Creates a new JoinGameRequest instance using the specified properties.
         * @function create
         * @memberof battletanks.JoinGameRequest
         * @static
         * @param {battletanks.IJoinGameRequest=} [properties] Properties to set
         * @returns {battletanks.JoinGameRequest} JoinGameRequest instance
         */
        JoinGameRequest.create = function create(properties) {
            return new JoinGameRequest(properties);
        };

        /**
         * Encodes the specified JoinGameRequest message. Does not implicitly {@link battletanks.JoinGameRequest.verify|verify} messages.
         * @function encode
         * @memberof battletanks.JoinGameRequest
         * @static
         * @param {battletanks.IJoinGameRequest} message JoinGameRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        JoinGameRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.displayName != null && Object.hasOwnProperty.call(message, "displayName"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.displayName);
            if (message.clientVersion != null && Object.hasOwnProperty.call(message, "clientVersion"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.clientVersion);
            return writer;
        };

        /**
         * Encodes the specified JoinGameRequest message, length delimited. Does not implicitly {@link battletanks.JoinGameRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof battletanks.JoinGameRequest
         * @static
         * @param {battletanks.IJoinGameRequest} message JoinGameRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        JoinGameRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a JoinGameRequest message from the specified reader or buffer.
         * @function decode
         * @memberof battletanks.JoinGameRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {battletanks.JoinGameRequest} JoinGameRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        JoinGameRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.battletanks.JoinGameRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.displayName = reader.string();
                        break;
                    }
                case 2: {
                        message.clientVersion = reader.string();
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
         * Decodes a JoinGameRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof battletanks.JoinGameRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {battletanks.JoinGameRequest} JoinGameRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        JoinGameRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a JoinGameRequest message.
         * @function verify
         * @memberof battletanks.JoinGameRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        JoinGameRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.displayName != null && message.hasOwnProperty("displayName"))
                if (!$util.isString(message.displayName))
                    return "displayName: string expected";
            if (message.clientVersion != null && message.hasOwnProperty("clientVersion"))
                if (!$util.isString(message.clientVersion))
                    return "clientVersion: string expected";
            return null;
        };

        /**
         * Creates a JoinGameRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof battletanks.JoinGameRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {battletanks.JoinGameRequest} JoinGameRequest
         */
        JoinGameRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.battletanks.JoinGameRequest)
                return object;
            var message = new $root.battletanks.JoinGameRequest();
            if (object.displayName != null)
                message.displayName = String(object.displayName);
            if (object.clientVersion != null)
                message.clientVersion = String(object.clientVersion);
            return message;
        };

        /**
         * Creates a plain object from a JoinGameRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof battletanks.JoinGameRequest
         * @static
         * @param {battletanks.JoinGameRequest} message JoinGameRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        JoinGameRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.displayName = "";
                object.clientVersion = "";
            }
            if (message.displayName != null && message.hasOwnProperty("displayName"))
                object.displayName = message.displayName;
            if (message.clientVersion != null && message.hasOwnProperty("clientVersion"))
                object.clientVersion = message.clientVersion;
            return object;
        };

        /**
         * Converts this JoinGameRequest to JSON.
         * @function toJSON
         * @memberof battletanks.JoinGameRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        JoinGameRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for JoinGameRequest
         * @function getTypeUrl
         * @memberof battletanks.JoinGameRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        JoinGameRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/battletanks.JoinGameRequest";
        };

        return JoinGameRequest;
    })();

    battletanks.JoinGameResponse = (function() {

        /**
         * Properties of a JoinGameResponse.
         * @memberof battletanks
         * @interface IJoinGameResponse
         * @property {boolean|null} [success] JoinGameResponse success
         * @property {string|null} [errorMessage] JoinGameResponse errorMessage
         * @property {string|null} [playerId] JoinGameResponse playerId
         * @property {number|null} [assignedEntityId] JoinGameResponse assignedEntityId
         * @property {battletanks.IGameConfig|null} [gameConfig] JoinGameResponse gameConfig
         */

        /**
         * Constructs a new JoinGameResponse.
         * @memberof battletanks
         * @classdesc Represents a JoinGameResponse.
         * @implements IJoinGameResponse
         * @constructor
         * @param {battletanks.IJoinGameResponse=} [properties] Properties to set
         */
        function JoinGameResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * JoinGameResponse success.
         * @member {boolean} success
         * @memberof battletanks.JoinGameResponse
         * @instance
         */
        JoinGameResponse.prototype.success = false;

        /**
         * JoinGameResponse errorMessage.
         * @member {string} errorMessage
         * @memberof battletanks.JoinGameResponse
         * @instance
         */
        JoinGameResponse.prototype.errorMessage = "";

        /**
         * JoinGameResponse playerId.
         * @member {string} playerId
         * @memberof battletanks.JoinGameResponse
         * @instance
         */
        JoinGameResponse.prototype.playerId = "";

        /**
         * JoinGameResponse assignedEntityId.
         * @member {number} assignedEntityId
         * @memberof battletanks.JoinGameResponse
         * @instance
         */
        JoinGameResponse.prototype.assignedEntityId = 0;

        /**
         * JoinGameResponse gameConfig.
         * @member {battletanks.IGameConfig|null|undefined} gameConfig
         * @memberof battletanks.JoinGameResponse
         * @instance
         */
        JoinGameResponse.prototype.gameConfig = null;

        /**
         * Creates a new JoinGameResponse instance using the specified properties.
         * @function create
         * @memberof battletanks.JoinGameResponse
         * @static
         * @param {battletanks.IJoinGameResponse=} [properties] Properties to set
         * @returns {battletanks.JoinGameResponse} JoinGameResponse instance
         */
        JoinGameResponse.create = function create(properties) {
            return new JoinGameResponse(properties);
        };

        /**
         * Encodes the specified JoinGameResponse message. Does not implicitly {@link battletanks.JoinGameResponse.verify|verify} messages.
         * @function encode
         * @memberof battletanks.JoinGameResponse
         * @static
         * @param {battletanks.IJoinGameResponse} message JoinGameResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        JoinGameResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && Object.hasOwnProperty.call(message, "success"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
            if (message.errorMessage != null && Object.hasOwnProperty.call(message, "errorMessage"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.errorMessage);
            if (message.playerId != null && Object.hasOwnProperty.call(message, "playerId"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.playerId);
            if (message.assignedEntityId != null && Object.hasOwnProperty.call(message, "assignedEntityId"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.assignedEntityId);
            if (message.gameConfig != null && Object.hasOwnProperty.call(message, "gameConfig"))
                $root.battletanks.GameConfig.encode(message.gameConfig, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified JoinGameResponse message, length delimited. Does not implicitly {@link battletanks.JoinGameResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof battletanks.JoinGameResponse
         * @static
         * @param {battletanks.IJoinGameResponse} message JoinGameResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        JoinGameResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a JoinGameResponse message from the specified reader or buffer.
         * @function decode
         * @memberof battletanks.JoinGameResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {battletanks.JoinGameResponse} JoinGameResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        JoinGameResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.battletanks.JoinGameResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.success = reader.bool();
                        break;
                    }
                case 2: {
                        message.errorMessage = reader.string();
                        break;
                    }
                case 3: {
                        message.playerId = reader.string();
                        break;
                    }
                case 4: {
                        message.assignedEntityId = reader.uint32();
                        break;
                    }
                case 5: {
                        message.gameConfig = $root.battletanks.GameConfig.decode(reader, reader.uint32());
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
         * Decodes a JoinGameResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof battletanks.JoinGameResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {battletanks.JoinGameResponse} JoinGameResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        JoinGameResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a JoinGameResponse message.
         * @function verify
         * @memberof battletanks.JoinGameResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        JoinGameResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.success != null && message.hasOwnProperty("success"))
                if (typeof message.success !== "boolean")
                    return "success: boolean expected";
            if (message.errorMessage != null && message.hasOwnProperty("errorMessage"))
                if (!$util.isString(message.errorMessage))
                    return "errorMessage: string expected";
            if (message.playerId != null && message.hasOwnProperty("playerId"))
                if (!$util.isString(message.playerId))
                    return "playerId: string expected";
            if (message.assignedEntityId != null && message.hasOwnProperty("assignedEntityId"))
                if (!$util.isInteger(message.assignedEntityId))
                    return "assignedEntityId: integer expected";
            if (message.gameConfig != null && message.hasOwnProperty("gameConfig")) {
                var error = $root.battletanks.GameConfig.verify(message.gameConfig);
                if (error)
                    return "gameConfig." + error;
            }
            return null;
        };

        /**
         * Creates a JoinGameResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof battletanks.JoinGameResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {battletanks.JoinGameResponse} JoinGameResponse
         */
        JoinGameResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.battletanks.JoinGameResponse)
                return object;
            var message = new $root.battletanks.JoinGameResponse();
            if (object.success != null)
                message.success = Boolean(object.success);
            if (object.errorMessage != null)
                message.errorMessage = String(object.errorMessage);
            if (object.playerId != null)
                message.playerId = String(object.playerId);
            if (object.assignedEntityId != null)
                message.assignedEntityId = object.assignedEntityId >>> 0;
            if (object.gameConfig != null) {
                if (typeof object.gameConfig !== "object")
                    throw TypeError(".battletanks.JoinGameResponse.gameConfig: object expected");
                message.gameConfig = $root.battletanks.GameConfig.fromObject(object.gameConfig);
            }
            return message;
        };

        /**
         * Creates a plain object from a JoinGameResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof battletanks.JoinGameResponse
         * @static
         * @param {battletanks.JoinGameResponse} message JoinGameResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        JoinGameResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.success = false;
                object.errorMessage = "";
                object.playerId = "";
                object.assignedEntityId = 0;
                object.gameConfig = null;
            }
            if (message.success != null && message.hasOwnProperty("success"))
                object.success = message.success;
            if (message.errorMessage != null && message.hasOwnProperty("errorMessage"))
                object.errorMessage = message.errorMessage;
            if (message.playerId != null && message.hasOwnProperty("playerId"))
                object.playerId = message.playerId;
            if (message.assignedEntityId != null && message.hasOwnProperty("assignedEntityId"))
                object.assignedEntityId = message.assignedEntityId;
            if (message.gameConfig != null && message.hasOwnProperty("gameConfig"))
                object.gameConfig = $root.battletanks.GameConfig.toObject(message.gameConfig, options);
            return object;
        };

        /**
         * Converts this JoinGameResponse to JSON.
         * @function toJSON
         * @memberof battletanks.JoinGameResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        JoinGameResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for JoinGameResponse
         * @function getTypeUrl
         * @memberof battletanks.JoinGameResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        JoinGameResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/battletanks.JoinGameResponse";
        };

        return JoinGameResponse;
    })();

    battletanks.GameConfig = (function() {

        /**
         * Properties of a GameConfig.
         * @memberof battletanks
         * @interface IGameConfig
         * @property {number|null} [tickRate] GameConfig tickRate
         * @property {number|null} [maxPlayers] GameConfig maxPlayers
         * @property {number|null} [roundDuration] GameConfig roundDuration
         * @property {number|null} [respawnTime] GameConfig respawnTime
         * @property {number|null} [invulnerabilityTime] GameConfig invulnerabilityTime
         * @property {battletanks.IVector2|null} [mapSize] GameConfig mapSize
         */

        /**
         * Constructs a new GameConfig.
         * @memberof battletanks
         * @classdesc Represents a GameConfig.
         * @implements IGameConfig
         * @constructor
         * @param {battletanks.IGameConfig=} [properties] Properties to set
         */
        function GameConfig(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GameConfig tickRate.
         * @member {number} tickRate
         * @memberof battletanks.GameConfig
         * @instance
         */
        GameConfig.prototype.tickRate = 0;

        /**
         * GameConfig maxPlayers.
         * @member {number} maxPlayers
         * @memberof battletanks.GameConfig
         * @instance
         */
        GameConfig.prototype.maxPlayers = 0;

        /**
         * GameConfig roundDuration.
         * @member {number} roundDuration
         * @memberof battletanks.GameConfig
         * @instance
         */
        GameConfig.prototype.roundDuration = 0;

        /**
         * GameConfig respawnTime.
         * @member {number} respawnTime
         * @memberof battletanks.GameConfig
         * @instance
         */
        GameConfig.prototype.respawnTime = 0;

        /**
         * GameConfig invulnerabilityTime.
         * @member {number} invulnerabilityTime
         * @memberof battletanks.GameConfig
         * @instance
         */
        GameConfig.prototype.invulnerabilityTime = 0;

        /**
         * GameConfig mapSize.
         * @member {battletanks.IVector2|null|undefined} mapSize
         * @memberof battletanks.GameConfig
         * @instance
         */
        GameConfig.prototype.mapSize = null;

        /**
         * Creates a new GameConfig instance using the specified properties.
         * @function create
         * @memberof battletanks.GameConfig
         * @static
         * @param {battletanks.IGameConfig=} [properties] Properties to set
         * @returns {battletanks.GameConfig} GameConfig instance
         */
        GameConfig.create = function create(properties) {
            return new GameConfig(properties);
        };

        /**
         * Encodes the specified GameConfig message. Does not implicitly {@link battletanks.GameConfig.verify|verify} messages.
         * @function encode
         * @memberof battletanks.GameConfig
         * @static
         * @param {battletanks.IGameConfig} message GameConfig message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameConfig.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.tickRate != null && Object.hasOwnProperty.call(message, "tickRate"))
                writer.uint32(/* id 1, wireType 5 =*/13).float(message.tickRate);
            if (message.maxPlayers != null && Object.hasOwnProperty.call(message, "maxPlayers"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.maxPlayers);
            if (message.roundDuration != null && Object.hasOwnProperty.call(message, "roundDuration"))
                writer.uint32(/* id 3, wireType 5 =*/29).float(message.roundDuration);
            if (message.respawnTime != null && Object.hasOwnProperty.call(message, "respawnTime"))
                writer.uint32(/* id 4, wireType 5 =*/37).float(message.respawnTime);
            if (message.invulnerabilityTime != null && Object.hasOwnProperty.call(message, "invulnerabilityTime"))
                writer.uint32(/* id 5, wireType 5 =*/45).float(message.invulnerabilityTime);
            if (message.mapSize != null && Object.hasOwnProperty.call(message, "mapSize"))
                $root.battletanks.Vector2.encode(message.mapSize, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified GameConfig message, length delimited. Does not implicitly {@link battletanks.GameConfig.verify|verify} messages.
         * @function encodeDelimited
         * @memberof battletanks.GameConfig
         * @static
         * @param {battletanks.IGameConfig} message GameConfig message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameConfig.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GameConfig message from the specified reader or buffer.
         * @function decode
         * @memberof battletanks.GameConfig
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {battletanks.GameConfig} GameConfig
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameConfig.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.battletanks.GameConfig();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.tickRate = reader.float();
                        break;
                    }
                case 2: {
                        message.maxPlayers = reader.uint32();
                        break;
                    }
                case 3: {
                        message.roundDuration = reader.float();
                        break;
                    }
                case 4: {
                        message.respawnTime = reader.float();
                        break;
                    }
                case 5: {
                        message.invulnerabilityTime = reader.float();
                        break;
                    }
                case 6: {
                        message.mapSize = $root.battletanks.Vector2.decode(reader, reader.uint32());
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
         * Decodes a GameConfig message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof battletanks.GameConfig
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {battletanks.GameConfig} GameConfig
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameConfig.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GameConfig message.
         * @function verify
         * @memberof battletanks.GameConfig
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GameConfig.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.tickRate != null && message.hasOwnProperty("tickRate"))
                if (typeof message.tickRate !== "number")
                    return "tickRate: number expected";
            if (message.maxPlayers != null && message.hasOwnProperty("maxPlayers"))
                if (!$util.isInteger(message.maxPlayers))
                    return "maxPlayers: integer expected";
            if (message.roundDuration != null && message.hasOwnProperty("roundDuration"))
                if (typeof message.roundDuration !== "number")
                    return "roundDuration: number expected";
            if (message.respawnTime != null && message.hasOwnProperty("respawnTime"))
                if (typeof message.respawnTime !== "number")
                    return "respawnTime: number expected";
            if (message.invulnerabilityTime != null && message.hasOwnProperty("invulnerabilityTime"))
                if (typeof message.invulnerabilityTime !== "number")
                    return "invulnerabilityTime: number expected";
            if (message.mapSize != null && message.hasOwnProperty("mapSize")) {
                var error = $root.battletanks.Vector2.verify(message.mapSize);
                if (error)
                    return "mapSize." + error;
            }
            return null;
        };

        /**
         * Creates a GameConfig message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof battletanks.GameConfig
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {battletanks.GameConfig} GameConfig
         */
        GameConfig.fromObject = function fromObject(object) {
            if (object instanceof $root.battletanks.GameConfig)
                return object;
            var message = new $root.battletanks.GameConfig();
            if (object.tickRate != null)
                message.tickRate = Number(object.tickRate);
            if (object.maxPlayers != null)
                message.maxPlayers = object.maxPlayers >>> 0;
            if (object.roundDuration != null)
                message.roundDuration = Number(object.roundDuration);
            if (object.respawnTime != null)
                message.respawnTime = Number(object.respawnTime);
            if (object.invulnerabilityTime != null)
                message.invulnerabilityTime = Number(object.invulnerabilityTime);
            if (object.mapSize != null) {
                if (typeof object.mapSize !== "object")
                    throw TypeError(".battletanks.GameConfig.mapSize: object expected");
                message.mapSize = $root.battletanks.Vector2.fromObject(object.mapSize);
            }
            return message;
        };

        /**
         * Creates a plain object from a GameConfig message. Also converts values to other types if specified.
         * @function toObject
         * @memberof battletanks.GameConfig
         * @static
         * @param {battletanks.GameConfig} message GameConfig
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GameConfig.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.tickRate = 0;
                object.maxPlayers = 0;
                object.roundDuration = 0;
                object.respawnTime = 0;
                object.invulnerabilityTime = 0;
                object.mapSize = null;
            }
            if (message.tickRate != null && message.hasOwnProperty("tickRate"))
                object.tickRate = options.json && !isFinite(message.tickRate) ? String(message.tickRate) : message.tickRate;
            if (message.maxPlayers != null && message.hasOwnProperty("maxPlayers"))
                object.maxPlayers = message.maxPlayers;
            if (message.roundDuration != null && message.hasOwnProperty("roundDuration"))
                object.roundDuration = options.json && !isFinite(message.roundDuration) ? String(message.roundDuration) : message.roundDuration;
            if (message.respawnTime != null && message.hasOwnProperty("respawnTime"))
                object.respawnTime = options.json && !isFinite(message.respawnTime) ? String(message.respawnTime) : message.respawnTime;
            if (message.invulnerabilityTime != null && message.hasOwnProperty("invulnerabilityTime"))
                object.invulnerabilityTime = options.json && !isFinite(message.invulnerabilityTime) ? String(message.invulnerabilityTime) : message.invulnerabilityTime;
            if (message.mapSize != null && message.hasOwnProperty("mapSize"))
                object.mapSize = $root.battletanks.Vector2.toObject(message.mapSize, options);
            return object;
        };

        /**
         * Converts this GameConfig to JSON.
         * @function toJSON
         * @memberof battletanks.GameConfig
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GameConfig.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GameConfig
         * @function getTypeUrl
         * @memberof battletanks.GameConfig
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GameConfig.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/battletanks.GameConfig";
        };

        return GameConfig;
    })();

    battletanks.PingRequest = (function() {

        /**
         * Properties of a PingRequest.
         * @memberof battletanks
         * @interface IPingRequest
         * @property {number|Long|null} [clientTimestamp] PingRequest clientTimestamp
         * @property {number|null} [sequenceNumber] PingRequest sequenceNumber
         */

        /**
         * Constructs a new PingRequest.
         * @memberof battletanks
         * @classdesc Represents a PingRequest.
         * @implements IPingRequest
         * @constructor
         * @param {battletanks.IPingRequest=} [properties] Properties to set
         */
        function PingRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PingRequest clientTimestamp.
         * @member {number|Long} clientTimestamp
         * @memberof battletanks.PingRequest
         * @instance
         */
        PingRequest.prototype.clientTimestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * PingRequest sequenceNumber.
         * @member {number} sequenceNumber
         * @memberof battletanks.PingRequest
         * @instance
         */
        PingRequest.prototype.sequenceNumber = 0;

        /**
         * Creates a new PingRequest instance using the specified properties.
         * @function create
         * @memberof battletanks.PingRequest
         * @static
         * @param {battletanks.IPingRequest=} [properties] Properties to set
         * @returns {battletanks.PingRequest} PingRequest instance
         */
        PingRequest.create = function create(properties) {
            return new PingRequest(properties);
        };

        /**
         * Encodes the specified PingRequest message. Does not implicitly {@link battletanks.PingRequest.verify|verify} messages.
         * @function encode
         * @memberof battletanks.PingRequest
         * @static
         * @param {battletanks.IPingRequest} message PingRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PingRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.clientTimestamp != null && Object.hasOwnProperty.call(message, "clientTimestamp"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.clientTimestamp);
            if (message.sequenceNumber != null && Object.hasOwnProperty.call(message, "sequenceNumber"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.sequenceNumber);
            return writer;
        };

        /**
         * Encodes the specified PingRequest message, length delimited. Does not implicitly {@link battletanks.PingRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof battletanks.PingRequest
         * @static
         * @param {battletanks.IPingRequest} message PingRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PingRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PingRequest message from the specified reader or buffer.
         * @function decode
         * @memberof battletanks.PingRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {battletanks.PingRequest} PingRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PingRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.battletanks.PingRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.clientTimestamp = reader.uint64();
                        break;
                    }
                case 2: {
                        message.sequenceNumber = reader.uint32();
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
         * Decodes a PingRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof battletanks.PingRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {battletanks.PingRequest} PingRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PingRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PingRequest message.
         * @function verify
         * @memberof battletanks.PingRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PingRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.clientTimestamp != null && message.hasOwnProperty("clientTimestamp"))
                if (!$util.isInteger(message.clientTimestamp) && !(message.clientTimestamp && $util.isInteger(message.clientTimestamp.low) && $util.isInteger(message.clientTimestamp.high)))
                    return "clientTimestamp: integer|Long expected";
            if (message.sequenceNumber != null && message.hasOwnProperty("sequenceNumber"))
                if (!$util.isInteger(message.sequenceNumber))
                    return "sequenceNumber: integer expected";
            return null;
        };

        /**
         * Creates a PingRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof battletanks.PingRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {battletanks.PingRequest} PingRequest
         */
        PingRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.battletanks.PingRequest)
                return object;
            var message = new $root.battletanks.PingRequest();
            if (object.clientTimestamp != null)
                if ($util.Long)
                    (message.clientTimestamp = $util.Long.fromValue(object.clientTimestamp)).unsigned = true;
                else if (typeof object.clientTimestamp === "string")
                    message.clientTimestamp = parseInt(object.clientTimestamp, 10);
                else if (typeof object.clientTimestamp === "number")
                    message.clientTimestamp = object.clientTimestamp;
                else if (typeof object.clientTimestamp === "object")
                    message.clientTimestamp = new $util.LongBits(object.clientTimestamp.low >>> 0, object.clientTimestamp.high >>> 0).toNumber(true);
            if (object.sequenceNumber != null)
                message.sequenceNumber = object.sequenceNumber >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a PingRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof battletanks.PingRequest
         * @static
         * @param {battletanks.PingRequest} message PingRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PingRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.clientTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.clientTimestamp = options.longs === String ? "0" : 0;
                object.sequenceNumber = 0;
            }
            if (message.clientTimestamp != null && message.hasOwnProperty("clientTimestamp"))
                if (typeof message.clientTimestamp === "number")
                    object.clientTimestamp = options.longs === String ? String(message.clientTimestamp) : message.clientTimestamp;
                else
                    object.clientTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.clientTimestamp) : options.longs === Number ? new $util.LongBits(message.clientTimestamp.low >>> 0, message.clientTimestamp.high >>> 0).toNumber(true) : message.clientTimestamp;
            if (message.sequenceNumber != null && message.hasOwnProperty("sequenceNumber"))
                object.sequenceNumber = message.sequenceNumber;
            return object;
        };

        /**
         * Converts this PingRequest to JSON.
         * @function toJSON
         * @memberof battletanks.PingRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PingRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for PingRequest
         * @function getTypeUrl
         * @memberof battletanks.PingRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        PingRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/battletanks.PingRequest";
        };

        return PingRequest;
    })();

    battletanks.PongResponse = (function() {

        /**
         * Properties of a PongResponse.
         * @memberof battletanks
         * @interface IPongResponse
         * @property {number|Long|null} [clientTimestamp] PongResponse clientTimestamp
         * @property {number|Long|null} [serverTimestamp] PongResponse serverTimestamp
         * @property {number|null} [sequenceNumber] PongResponse sequenceNumber
         */

        /**
         * Constructs a new PongResponse.
         * @memberof battletanks
         * @classdesc Represents a PongResponse.
         * @implements IPongResponse
         * @constructor
         * @param {battletanks.IPongResponse=} [properties] Properties to set
         */
        function PongResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PongResponse clientTimestamp.
         * @member {number|Long} clientTimestamp
         * @memberof battletanks.PongResponse
         * @instance
         */
        PongResponse.prototype.clientTimestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * PongResponse serverTimestamp.
         * @member {number|Long} serverTimestamp
         * @memberof battletanks.PongResponse
         * @instance
         */
        PongResponse.prototype.serverTimestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * PongResponse sequenceNumber.
         * @member {number} sequenceNumber
         * @memberof battletanks.PongResponse
         * @instance
         */
        PongResponse.prototype.sequenceNumber = 0;

        /**
         * Creates a new PongResponse instance using the specified properties.
         * @function create
         * @memberof battletanks.PongResponse
         * @static
         * @param {battletanks.IPongResponse=} [properties] Properties to set
         * @returns {battletanks.PongResponse} PongResponse instance
         */
        PongResponse.create = function create(properties) {
            return new PongResponse(properties);
        };

        /**
         * Encodes the specified PongResponse message. Does not implicitly {@link battletanks.PongResponse.verify|verify} messages.
         * @function encode
         * @memberof battletanks.PongResponse
         * @static
         * @param {battletanks.IPongResponse} message PongResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PongResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.clientTimestamp != null && Object.hasOwnProperty.call(message, "clientTimestamp"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.clientTimestamp);
            if (message.serverTimestamp != null && Object.hasOwnProperty.call(message, "serverTimestamp"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.serverTimestamp);
            if (message.sequenceNumber != null && Object.hasOwnProperty.call(message, "sequenceNumber"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.sequenceNumber);
            return writer;
        };

        /**
         * Encodes the specified PongResponse message, length delimited. Does not implicitly {@link battletanks.PongResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof battletanks.PongResponse
         * @static
         * @param {battletanks.IPongResponse} message PongResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PongResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PongResponse message from the specified reader or buffer.
         * @function decode
         * @memberof battletanks.PongResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {battletanks.PongResponse} PongResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PongResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.battletanks.PongResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.clientTimestamp = reader.uint64();
                        break;
                    }
                case 2: {
                        message.serverTimestamp = reader.uint64();
                        break;
                    }
                case 3: {
                        message.sequenceNumber = reader.uint32();
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
         * Decodes a PongResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof battletanks.PongResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {battletanks.PongResponse} PongResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PongResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PongResponse message.
         * @function verify
         * @memberof battletanks.PongResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PongResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.clientTimestamp != null && message.hasOwnProperty("clientTimestamp"))
                if (!$util.isInteger(message.clientTimestamp) && !(message.clientTimestamp && $util.isInteger(message.clientTimestamp.low) && $util.isInteger(message.clientTimestamp.high)))
                    return "clientTimestamp: integer|Long expected";
            if (message.serverTimestamp != null && message.hasOwnProperty("serverTimestamp"))
                if (!$util.isInteger(message.serverTimestamp) && !(message.serverTimestamp && $util.isInteger(message.serverTimestamp.low) && $util.isInteger(message.serverTimestamp.high)))
                    return "serverTimestamp: integer|Long expected";
            if (message.sequenceNumber != null && message.hasOwnProperty("sequenceNumber"))
                if (!$util.isInteger(message.sequenceNumber))
                    return "sequenceNumber: integer expected";
            return null;
        };

        /**
         * Creates a PongResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof battletanks.PongResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {battletanks.PongResponse} PongResponse
         */
        PongResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.battletanks.PongResponse)
                return object;
            var message = new $root.battletanks.PongResponse();
            if (object.clientTimestamp != null)
                if ($util.Long)
                    (message.clientTimestamp = $util.Long.fromValue(object.clientTimestamp)).unsigned = true;
                else if (typeof object.clientTimestamp === "string")
                    message.clientTimestamp = parseInt(object.clientTimestamp, 10);
                else if (typeof object.clientTimestamp === "number")
                    message.clientTimestamp = object.clientTimestamp;
                else if (typeof object.clientTimestamp === "object")
                    message.clientTimestamp = new $util.LongBits(object.clientTimestamp.low >>> 0, object.clientTimestamp.high >>> 0).toNumber(true);
            if (object.serverTimestamp != null)
                if ($util.Long)
                    (message.serverTimestamp = $util.Long.fromValue(object.serverTimestamp)).unsigned = true;
                else if (typeof object.serverTimestamp === "string")
                    message.serverTimestamp = parseInt(object.serverTimestamp, 10);
                else if (typeof object.serverTimestamp === "number")
                    message.serverTimestamp = object.serverTimestamp;
                else if (typeof object.serverTimestamp === "object")
                    message.serverTimestamp = new $util.LongBits(object.serverTimestamp.low >>> 0, object.serverTimestamp.high >>> 0).toNumber(true);
            if (object.sequenceNumber != null)
                message.sequenceNumber = object.sequenceNumber >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a PongResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof battletanks.PongResponse
         * @static
         * @param {battletanks.PongResponse} message PongResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PongResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.clientTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.clientTimestamp = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.serverTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.serverTimestamp = options.longs === String ? "0" : 0;
                object.sequenceNumber = 0;
            }
            if (message.clientTimestamp != null && message.hasOwnProperty("clientTimestamp"))
                if (typeof message.clientTimestamp === "number")
                    object.clientTimestamp = options.longs === String ? String(message.clientTimestamp) : message.clientTimestamp;
                else
                    object.clientTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.clientTimestamp) : options.longs === Number ? new $util.LongBits(message.clientTimestamp.low >>> 0, message.clientTimestamp.high >>> 0).toNumber(true) : message.clientTimestamp;
            if (message.serverTimestamp != null && message.hasOwnProperty("serverTimestamp"))
                if (typeof message.serverTimestamp === "number")
                    object.serverTimestamp = options.longs === String ? String(message.serverTimestamp) : message.serverTimestamp;
                else
                    object.serverTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.serverTimestamp) : options.longs === Number ? new $util.LongBits(message.serverTimestamp.low >>> 0, message.serverTimestamp.high >>> 0).toNumber(true) : message.serverTimestamp;
            if (message.sequenceNumber != null && message.hasOwnProperty("sequenceNumber"))
                object.sequenceNumber = message.sequenceNumber;
            return object;
        };

        /**
         * Converts this PongResponse to JSON.
         * @function toJSON
         * @memberof battletanks.PongResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PongResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for PongResponse
         * @function getTypeUrl
         * @memberof battletanks.PongResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        PongResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/battletanks.PongResponse";
        };

        return PongResponse;
    })();

    battletanks.NetworkMessage = (function() {

        /**
         * Properties of a NetworkMessage.
         * @memberof battletanks
         * @interface INetworkMessage
         * @property {number|Long|null} [timestamp] NetworkMessage timestamp
         * @property {battletanks.IJoinGameRequest|null} [joinGameRequest] NetworkMessage joinGameRequest
         * @property {battletanks.IPlayerInput|null} [playerInput] NetworkMessage playerInput
         * @property {battletanks.IPingRequest|null} [pingRequest] NetworkMessage pingRequest
         * @property {battletanks.IJoinGameResponse|null} [joinGameResponse] NetworkMessage joinGameResponse
         * @property {battletanks.IGameStateUpdate|null} [gameStateUpdate] NetworkMessage gameStateUpdate
         * @property {battletanks.IPongResponse|null} [pongResponse] NetworkMessage pongResponse
         * @property {battletanks.IChatMessageEvent|null} [chatMessage] NetworkMessage chatMessage
         */

        /**
         * Constructs a new NetworkMessage.
         * @memberof battletanks
         * @classdesc Represents a NetworkMessage.
         * @implements INetworkMessage
         * @constructor
         * @param {battletanks.INetworkMessage=} [properties] Properties to set
         */
        function NetworkMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * NetworkMessage timestamp.
         * @member {number|Long} timestamp
         * @memberof battletanks.NetworkMessage
         * @instance
         */
        NetworkMessage.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * NetworkMessage joinGameRequest.
         * @member {battletanks.IJoinGameRequest|null|undefined} joinGameRequest
         * @memberof battletanks.NetworkMessage
         * @instance
         */
        NetworkMessage.prototype.joinGameRequest = null;

        /**
         * NetworkMessage playerInput.
         * @member {battletanks.IPlayerInput|null|undefined} playerInput
         * @memberof battletanks.NetworkMessage
         * @instance
         */
        NetworkMessage.prototype.playerInput = null;

        /**
         * NetworkMessage pingRequest.
         * @member {battletanks.IPingRequest|null|undefined} pingRequest
         * @memberof battletanks.NetworkMessage
         * @instance
         */
        NetworkMessage.prototype.pingRequest = null;

        /**
         * NetworkMessage joinGameResponse.
         * @member {battletanks.IJoinGameResponse|null|undefined} joinGameResponse
         * @memberof battletanks.NetworkMessage
         * @instance
         */
        NetworkMessage.prototype.joinGameResponse = null;

        /**
         * NetworkMessage gameStateUpdate.
         * @member {battletanks.IGameStateUpdate|null|undefined} gameStateUpdate
         * @memberof battletanks.NetworkMessage
         * @instance
         */
        NetworkMessage.prototype.gameStateUpdate = null;

        /**
         * NetworkMessage pongResponse.
         * @member {battletanks.IPongResponse|null|undefined} pongResponse
         * @memberof battletanks.NetworkMessage
         * @instance
         */
        NetworkMessage.prototype.pongResponse = null;

        /**
         * NetworkMessage chatMessage.
         * @member {battletanks.IChatMessageEvent|null|undefined} chatMessage
         * @memberof battletanks.NetworkMessage
         * @instance
         */
        NetworkMessage.prototype.chatMessage = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * NetworkMessage messageType.
         * @member {"joinGameRequest"|"playerInput"|"pingRequest"|"joinGameResponse"|"gameStateUpdate"|"pongResponse"|"chatMessage"|undefined} messageType
         * @memberof battletanks.NetworkMessage
         * @instance
         */
        Object.defineProperty(NetworkMessage.prototype, "messageType", {
            get: $util.oneOfGetter($oneOfFields = ["joinGameRequest", "playerInput", "pingRequest", "joinGameResponse", "gameStateUpdate", "pongResponse", "chatMessage"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new NetworkMessage instance using the specified properties.
         * @function create
         * @memberof battletanks.NetworkMessage
         * @static
         * @param {battletanks.INetworkMessage=} [properties] Properties to set
         * @returns {battletanks.NetworkMessage} NetworkMessage instance
         */
        NetworkMessage.create = function create(properties) {
            return new NetworkMessage(properties);
        };

        /**
         * Encodes the specified NetworkMessage message. Does not implicitly {@link battletanks.NetworkMessage.verify|verify} messages.
         * @function encode
         * @memberof battletanks.NetworkMessage
         * @static
         * @param {battletanks.INetworkMessage} message NetworkMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NetworkMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.timestamp);
            if (message.joinGameRequest != null && Object.hasOwnProperty.call(message, "joinGameRequest"))
                $root.battletanks.JoinGameRequest.encode(message.joinGameRequest, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.playerInput != null && Object.hasOwnProperty.call(message, "playerInput"))
                $root.battletanks.PlayerInput.encode(message.playerInput, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.pingRequest != null && Object.hasOwnProperty.call(message, "pingRequest"))
                $root.battletanks.PingRequest.encode(message.pingRequest, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.joinGameResponse != null && Object.hasOwnProperty.call(message, "joinGameResponse"))
                $root.battletanks.JoinGameResponse.encode(message.joinGameResponse, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.gameStateUpdate != null && Object.hasOwnProperty.call(message, "gameStateUpdate"))
                $root.battletanks.GameStateUpdate.encode(message.gameStateUpdate, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.pongResponse != null && Object.hasOwnProperty.call(message, "pongResponse"))
                $root.battletanks.PongResponse.encode(message.pongResponse, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            if (message.chatMessage != null && Object.hasOwnProperty.call(message, "chatMessage"))
                $root.battletanks.ChatMessageEvent.encode(message.chatMessage, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified NetworkMessage message, length delimited. Does not implicitly {@link battletanks.NetworkMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof battletanks.NetworkMessage
         * @static
         * @param {battletanks.INetworkMessage} message NetworkMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NetworkMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a NetworkMessage message from the specified reader or buffer.
         * @function decode
         * @memberof battletanks.NetworkMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {battletanks.NetworkMessage} NetworkMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NetworkMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.battletanks.NetworkMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.timestamp = reader.uint64();
                        break;
                    }
                case 2: {
                        message.joinGameRequest = $root.battletanks.JoinGameRequest.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.playerInput = $root.battletanks.PlayerInput.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.pingRequest = $root.battletanks.PingRequest.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.joinGameResponse = $root.battletanks.JoinGameResponse.decode(reader, reader.uint32());
                        break;
                    }
                case 6: {
                        message.gameStateUpdate = $root.battletanks.GameStateUpdate.decode(reader, reader.uint32());
                        break;
                    }
                case 7: {
                        message.pongResponse = $root.battletanks.PongResponse.decode(reader, reader.uint32());
                        break;
                    }
                case 8: {
                        message.chatMessage = $root.battletanks.ChatMessageEvent.decode(reader, reader.uint32());
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
         * Decodes a NetworkMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof battletanks.NetworkMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {battletanks.NetworkMessage} NetworkMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NetworkMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a NetworkMessage message.
         * @function verify
         * @memberof battletanks.NetworkMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        NetworkMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.joinGameRequest != null && message.hasOwnProperty("joinGameRequest")) {
                properties.messageType = 1;
                {
                    var error = $root.battletanks.JoinGameRequest.verify(message.joinGameRequest);
                    if (error)
                        return "joinGameRequest." + error;
                }
            }
            if (message.playerInput != null && message.hasOwnProperty("playerInput")) {
                if (properties.messageType === 1)
                    return "messageType: multiple values";
                properties.messageType = 1;
                {
                    var error = $root.battletanks.PlayerInput.verify(message.playerInput);
                    if (error)
                        return "playerInput." + error;
                }
            }
            if (message.pingRequest != null && message.hasOwnProperty("pingRequest")) {
                if (properties.messageType === 1)
                    return "messageType: multiple values";
                properties.messageType = 1;
                {
                    var error = $root.battletanks.PingRequest.verify(message.pingRequest);
                    if (error)
                        return "pingRequest." + error;
                }
            }
            if (message.joinGameResponse != null && message.hasOwnProperty("joinGameResponse")) {
                if (properties.messageType === 1)
                    return "messageType: multiple values";
                properties.messageType = 1;
                {
                    var error = $root.battletanks.JoinGameResponse.verify(message.joinGameResponse);
                    if (error)
                        return "joinGameResponse." + error;
                }
            }
            if (message.gameStateUpdate != null && message.hasOwnProperty("gameStateUpdate")) {
                if (properties.messageType === 1)
                    return "messageType: multiple values";
                properties.messageType = 1;
                {
                    var error = $root.battletanks.GameStateUpdate.verify(message.gameStateUpdate);
                    if (error)
                        return "gameStateUpdate." + error;
                }
            }
            if (message.pongResponse != null && message.hasOwnProperty("pongResponse")) {
                if (properties.messageType === 1)
                    return "messageType: multiple values";
                properties.messageType = 1;
                {
                    var error = $root.battletanks.PongResponse.verify(message.pongResponse);
                    if (error)
                        return "pongResponse." + error;
                }
            }
            if (message.chatMessage != null && message.hasOwnProperty("chatMessage")) {
                if (properties.messageType === 1)
                    return "messageType: multiple values";
                properties.messageType = 1;
                {
                    var error = $root.battletanks.ChatMessageEvent.verify(message.chatMessage);
                    if (error)
                        return "chatMessage." + error;
                }
            }
            return null;
        };

        /**
         * Creates a NetworkMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof battletanks.NetworkMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {battletanks.NetworkMessage} NetworkMessage
         */
        NetworkMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.battletanks.NetworkMessage)
                return object;
            var message = new $root.battletanks.NetworkMessage();
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = true;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber(true);
            if (object.joinGameRequest != null) {
                if (typeof object.joinGameRequest !== "object")
                    throw TypeError(".battletanks.NetworkMessage.joinGameRequest: object expected");
                message.joinGameRequest = $root.battletanks.JoinGameRequest.fromObject(object.joinGameRequest);
            }
            if (object.playerInput != null) {
                if (typeof object.playerInput !== "object")
                    throw TypeError(".battletanks.NetworkMessage.playerInput: object expected");
                message.playerInput = $root.battletanks.PlayerInput.fromObject(object.playerInput);
            }
            if (object.pingRequest != null) {
                if (typeof object.pingRequest !== "object")
                    throw TypeError(".battletanks.NetworkMessage.pingRequest: object expected");
                message.pingRequest = $root.battletanks.PingRequest.fromObject(object.pingRequest);
            }
            if (object.joinGameResponse != null) {
                if (typeof object.joinGameResponse !== "object")
                    throw TypeError(".battletanks.NetworkMessage.joinGameResponse: object expected");
                message.joinGameResponse = $root.battletanks.JoinGameResponse.fromObject(object.joinGameResponse);
            }
            if (object.gameStateUpdate != null) {
                if (typeof object.gameStateUpdate !== "object")
                    throw TypeError(".battletanks.NetworkMessage.gameStateUpdate: object expected");
                message.gameStateUpdate = $root.battletanks.GameStateUpdate.fromObject(object.gameStateUpdate);
            }
            if (object.pongResponse != null) {
                if (typeof object.pongResponse !== "object")
                    throw TypeError(".battletanks.NetworkMessage.pongResponse: object expected");
                message.pongResponse = $root.battletanks.PongResponse.fromObject(object.pongResponse);
            }
            if (object.chatMessage != null) {
                if (typeof object.chatMessage !== "object")
                    throw TypeError(".battletanks.NetworkMessage.chatMessage: object expected");
                message.chatMessage = $root.battletanks.ChatMessageEvent.fromObject(object.chatMessage);
            }
            return message;
        };

        /**
         * Creates a plain object from a NetworkMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof battletanks.NetworkMessage
         * @static
         * @param {battletanks.NetworkMessage} message NetworkMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        NetworkMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber(true) : message.timestamp;
            if (message.joinGameRequest != null && message.hasOwnProperty("joinGameRequest")) {
                object.joinGameRequest = $root.battletanks.JoinGameRequest.toObject(message.joinGameRequest, options);
                if (options.oneofs)
                    object.messageType = "joinGameRequest";
            }
            if (message.playerInput != null && message.hasOwnProperty("playerInput")) {
                object.playerInput = $root.battletanks.PlayerInput.toObject(message.playerInput, options);
                if (options.oneofs)
                    object.messageType = "playerInput";
            }
            if (message.pingRequest != null && message.hasOwnProperty("pingRequest")) {
                object.pingRequest = $root.battletanks.PingRequest.toObject(message.pingRequest, options);
                if (options.oneofs)
                    object.messageType = "pingRequest";
            }
            if (message.joinGameResponse != null && message.hasOwnProperty("joinGameResponse")) {
                object.joinGameResponse = $root.battletanks.JoinGameResponse.toObject(message.joinGameResponse, options);
                if (options.oneofs)
                    object.messageType = "joinGameResponse";
            }
            if (message.gameStateUpdate != null && message.hasOwnProperty("gameStateUpdate")) {
                object.gameStateUpdate = $root.battletanks.GameStateUpdate.toObject(message.gameStateUpdate, options);
                if (options.oneofs)
                    object.messageType = "gameStateUpdate";
            }
            if (message.pongResponse != null && message.hasOwnProperty("pongResponse")) {
                object.pongResponse = $root.battletanks.PongResponse.toObject(message.pongResponse, options);
                if (options.oneofs)
                    object.messageType = "pongResponse";
            }
            if (message.chatMessage != null && message.hasOwnProperty("chatMessage")) {
                object.chatMessage = $root.battletanks.ChatMessageEvent.toObject(message.chatMessage, options);
                if (options.oneofs)
                    object.messageType = "chatMessage";
            }
            return object;
        };

        /**
         * Converts this NetworkMessage to JSON.
         * @function toJSON
         * @memberof battletanks.NetworkMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        NetworkMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for NetworkMessage
         * @function getTypeUrl
         * @memberof battletanks.NetworkMessage
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        NetworkMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/battletanks.NetworkMessage";
        };

        return NetworkMessage;
    })();

    return battletanks;
})();

module.exports = $root;
