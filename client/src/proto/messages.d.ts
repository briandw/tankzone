import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace battletanks. */
export namespace battletanks {

    /** Properties of a Vector3. */
    interface IVector3 {

        /** Vector3 x */
        x?: (number|null);

        /** Vector3 y */
        y?: (number|null);

        /** Vector3 z */
        z?: (number|null);
    }

    /** Represents a Vector3. */
    class Vector3 implements IVector3 {

        /**
         * Constructs a new Vector3.
         * @param [properties] Properties to set
         */
        constructor(properties?: battletanks.IVector3);

        /** Vector3 x. */
        public x: number;

        /** Vector3 y. */
        public y: number;

        /** Vector3 z. */
        public z: number;

        /**
         * Creates a new Vector3 instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Vector3 instance
         */
        public static create(properties?: battletanks.IVector3): battletanks.Vector3;

        /**
         * Encodes the specified Vector3 message. Does not implicitly {@link battletanks.Vector3.verify|verify} messages.
         * @param message Vector3 message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: battletanks.IVector3, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Vector3 message, length delimited. Does not implicitly {@link battletanks.Vector3.verify|verify} messages.
         * @param message Vector3 message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: battletanks.IVector3, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Vector3 message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Vector3
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): battletanks.Vector3;

        /**
         * Decodes a Vector3 message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Vector3
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): battletanks.Vector3;

        /**
         * Verifies a Vector3 message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Vector3 message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Vector3
         */
        public static fromObject(object: { [k: string]: any }): battletanks.Vector3;

        /**
         * Creates a plain object from a Vector3 message. Also converts values to other types if specified.
         * @param message Vector3
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: battletanks.Vector3, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Vector3 to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Vector3
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Vector2. */
    interface IVector2 {

        /** Vector2 x */
        x?: (number|null);

        /** Vector2 y */
        y?: (number|null);
    }

    /** Represents a Vector2. */
    class Vector2 implements IVector2 {

        /**
         * Constructs a new Vector2.
         * @param [properties] Properties to set
         */
        constructor(properties?: battletanks.IVector2);

        /** Vector2 x. */
        public x: number;

        /** Vector2 y. */
        public y: number;

        /**
         * Creates a new Vector2 instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Vector2 instance
         */
        public static create(properties?: battletanks.IVector2): battletanks.Vector2;

        /**
         * Encodes the specified Vector2 message. Does not implicitly {@link battletanks.Vector2.verify|verify} messages.
         * @param message Vector2 message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: battletanks.IVector2, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Vector2 message, length delimited. Does not implicitly {@link battletanks.Vector2.verify|verify} messages.
         * @param message Vector2 message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: battletanks.IVector2, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Vector2 message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Vector2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): battletanks.Vector2;

        /**
         * Decodes a Vector2 message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Vector2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): battletanks.Vector2;

        /**
         * Verifies a Vector2 message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Vector2 message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Vector2
         */
        public static fromObject(object: { [k: string]: any }): battletanks.Vector2;

        /**
         * Creates a plain object from a Vector2 message. Also converts values to other types if specified.
         * @param message Vector2
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: battletanks.Vector2, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Vector2 to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Vector2
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** TeamColor enum. */
    enum TeamColor {
        TEAM_NEUTRAL = 0,
        TEAM_RED = 1,
        TEAM_BLUE = 2,
        TEAM_NPC = 3
    }

    /** PowerUpType enum. */
    enum PowerUpType {
        POWER_UP_NONE = 0,
        POWER_UP_SHIELD = 1,
        POWER_UP_CLOAK = 2,
        POWER_UP_SPEED = 3,
        POWER_UP_RAPID_FIRE = 4
    }

    /** Properties of a PlayerInput. */
    interface IPlayerInput {

        /** PlayerInput forward */
        forward?: (boolean|null);

        /** PlayerInput backward */
        backward?: (boolean|null);

        /** PlayerInput rotateLeft */
        rotateLeft?: (boolean|null);

        /** PlayerInput rotateRight */
        rotateRight?: (boolean|null);

        /** PlayerInput fire */
        fire?: (boolean|null);

        /** PlayerInput turretAngle */
        turretAngle?: (number|null);

        /** PlayerInput timestamp */
        timestamp?: (number|Long|null);

        /** PlayerInput sequenceNumber */
        sequenceNumber?: (number|null);
    }

    /** Represents a PlayerInput. */
    class PlayerInput implements IPlayerInput {

        /**
         * Constructs a new PlayerInput.
         * @param [properties] Properties to set
         */
        constructor(properties?: battletanks.IPlayerInput);

        /** PlayerInput forward. */
        public forward: boolean;

        /** PlayerInput backward. */
        public backward: boolean;

        /** PlayerInput rotateLeft. */
        public rotateLeft: boolean;

        /** PlayerInput rotateRight. */
        public rotateRight: boolean;

        /** PlayerInput fire. */
        public fire: boolean;

        /** PlayerInput turretAngle. */
        public turretAngle: number;

        /** PlayerInput timestamp. */
        public timestamp: (number|Long);

        /** PlayerInput sequenceNumber. */
        public sequenceNumber: number;

        /**
         * Creates a new PlayerInput instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PlayerInput instance
         */
        public static create(properties?: battletanks.IPlayerInput): battletanks.PlayerInput;

        /**
         * Encodes the specified PlayerInput message. Does not implicitly {@link battletanks.PlayerInput.verify|verify} messages.
         * @param message PlayerInput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: battletanks.IPlayerInput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PlayerInput message, length delimited. Does not implicitly {@link battletanks.PlayerInput.verify|verify} messages.
         * @param message PlayerInput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: battletanks.IPlayerInput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PlayerInput message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PlayerInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): battletanks.PlayerInput;

        /**
         * Decodes a PlayerInput message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PlayerInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): battletanks.PlayerInput;

        /**
         * Verifies a PlayerInput message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PlayerInput message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PlayerInput
         */
        public static fromObject(object: { [k: string]: any }): battletanks.PlayerInput;

        /**
         * Creates a plain object from a PlayerInput message. Also converts values to other types if specified.
         * @param message PlayerInput
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: battletanks.PlayerInput, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PlayerInput to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PlayerInput
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a TankState. */
    interface ITankState {

        /** TankState entityId */
        entityId?: (number|null);

        /** TankState playerId */
        playerId?: (string|null);

        /** TankState displayName */
        displayName?: (string|null);

        /** TankState position */
        position?: (battletanks.IVector3|null);

        /** TankState bodyRotation */
        bodyRotation?: (number|null);

        /** TankState turretRotation */
        turretRotation?: (number|null);

        /** TankState health */
        health?: (number|null);

        /** TankState maxHealth */
        maxHealth?: (number|null);

        /** TankState team */
        team?: (battletanks.TeamColor|null);

        /** TankState activePowerups */
        activePowerups?: (battletanks.IActivePowerUp[]|null);

        /** TankState isInvulnerable */
        isInvulnerable?: (boolean|null);

        /** TankState invulnerabilityRemaining */
        invulnerabilityRemaining?: (number|null);
    }

    /** Represents a TankState. */
    class TankState implements ITankState {

        /**
         * Constructs a new TankState.
         * @param [properties] Properties to set
         */
        constructor(properties?: battletanks.ITankState);

        /** TankState entityId. */
        public entityId: number;

        /** TankState playerId. */
        public playerId: string;

        /** TankState displayName. */
        public displayName: string;

        /** TankState position. */
        public position?: (battletanks.IVector3|null);

        /** TankState bodyRotation. */
        public bodyRotation: number;

        /** TankState turretRotation. */
        public turretRotation: number;

        /** TankState health. */
        public health: number;

        /** TankState maxHealth. */
        public maxHealth: number;

        /** TankState team. */
        public team: battletanks.TeamColor;

        /** TankState activePowerups. */
        public activePowerups: battletanks.IActivePowerUp[];

        /** TankState isInvulnerable. */
        public isInvulnerable: boolean;

        /** TankState invulnerabilityRemaining. */
        public invulnerabilityRemaining: number;

        /**
         * Creates a new TankState instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TankState instance
         */
        public static create(properties?: battletanks.ITankState): battletanks.TankState;

        /**
         * Encodes the specified TankState message. Does not implicitly {@link battletanks.TankState.verify|verify} messages.
         * @param message TankState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: battletanks.ITankState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TankState message, length delimited. Does not implicitly {@link battletanks.TankState.verify|verify} messages.
         * @param message TankState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: battletanks.ITankState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TankState message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TankState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): battletanks.TankState;

        /**
         * Decodes a TankState message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TankState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): battletanks.TankState;

        /**
         * Verifies a TankState message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TankState message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TankState
         */
        public static fromObject(object: { [k: string]: any }): battletanks.TankState;

        /**
         * Creates a plain object from a TankState message. Also converts values to other types if specified.
         * @param message TankState
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: battletanks.TankState, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TankState to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for TankState
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ProjectileState. */
    interface IProjectileState {

        /** ProjectileState entityId */
        entityId?: (number|null);

        /** ProjectileState ownerId */
        ownerId?: (string|null);

        /** ProjectileState position */
        position?: (battletanks.IVector3|null);

        /** ProjectileState velocity */
        velocity?: (battletanks.IVector3|null);

        /** ProjectileState damage */
        damage?: (number|null);

        /** ProjectileState team */
        team?: (battletanks.TeamColor|null);

        /** ProjectileState lifetimeRemaining */
        lifetimeRemaining?: (number|null);
    }

    /** Represents a ProjectileState. */
    class ProjectileState implements IProjectileState {

        /**
         * Constructs a new ProjectileState.
         * @param [properties] Properties to set
         */
        constructor(properties?: battletanks.IProjectileState);

        /** ProjectileState entityId. */
        public entityId: number;

        /** ProjectileState ownerId. */
        public ownerId: string;

        /** ProjectileState position. */
        public position?: (battletanks.IVector3|null);

        /** ProjectileState velocity. */
        public velocity?: (battletanks.IVector3|null);

        /** ProjectileState damage. */
        public damage: number;

        /** ProjectileState team. */
        public team: battletanks.TeamColor;

        /** ProjectileState lifetimeRemaining. */
        public lifetimeRemaining: number;

        /**
         * Creates a new ProjectileState instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ProjectileState instance
         */
        public static create(properties?: battletanks.IProjectileState): battletanks.ProjectileState;

        /**
         * Encodes the specified ProjectileState message. Does not implicitly {@link battletanks.ProjectileState.verify|verify} messages.
         * @param message ProjectileState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: battletanks.IProjectileState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ProjectileState message, length delimited. Does not implicitly {@link battletanks.ProjectileState.verify|verify} messages.
         * @param message ProjectileState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: battletanks.IProjectileState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ProjectileState message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ProjectileState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): battletanks.ProjectileState;

        /**
         * Decodes a ProjectileState message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ProjectileState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): battletanks.ProjectileState;

        /**
         * Verifies a ProjectileState message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ProjectileState message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ProjectileState
         */
        public static fromObject(object: { [k: string]: any }): battletanks.ProjectileState;

        /**
         * Creates a plain object from a ProjectileState message. Also converts values to other types if specified.
         * @param message ProjectileState
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: battletanks.ProjectileState, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ProjectileState to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ProjectileState
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PowerUpState. */
    interface IPowerUpState {

        /** PowerUpState entityId */
        entityId?: (number|null);

        /** PowerUpState powerUpType */
        powerUpType?: (battletanks.PowerUpType|null);

        /** PowerUpState position */
        position?: (battletanks.IVector3|null);

        /** PowerUpState isAvailable */
        isAvailable?: (boolean|null);

        /** PowerUpState respawnTimer */
        respawnTimer?: (number|null);
    }

    /** Represents a PowerUpState. */
    class PowerUpState implements IPowerUpState {

        /**
         * Constructs a new PowerUpState.
         * @param [properties] Properties to set
         */
        constructor(properties?: battletanks.IPowerUpState);

        /** PowerUpState entityId. */
        public entityId: number;

        /** PowerUpState powerUpType. */
        public powerUpType: battletanks.PowerUpType;

        /** PowerUpState position. */
        public position?: (battletanks.IVector3|null);

        /** PowerUpState isAvailable. */
        public isAvailable: boolean;

        /** PowerUpState respawnTimer. */
        public respawnTimer: number;

        /**
         * Creates a new PowerUpState instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PowerUpState instance
         */
        public static create(properties?: battletanks.IPowerUpState): battletanks.PowerUpState;

        /**
         * Encodes the specified PowerUpState message. Does not implicitly {@link battletanks.PowerUpState.verify|verify} messages.
         * @param message PowerUpState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: battletanks.IPowerUpState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PowerUpState message, length delimited. Does not implicitly {@link battletanks.PowerUpState.verify|verify} messages.
         * @param message PowerUpState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: battletanks.IPowerUpState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PowerUpState message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PowerUpState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): battletanks.PowerUpState;

        /**
         * Decodes a PowerUpState message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PowerUpState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): battletanks.PowerUpState;

        /**
         * Verifies a PowerUpState message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PowerUpState message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PowerUpState
         */
        public static fromObject(object: { [k: string]: any }): battletanks.PowerUpState;

        /**
         * Creates a plain object from a PowerUpState message. Also converts values to other types if specified.
         * @param message PowerUpState
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: battletanks.PowerUpState, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PowerUpState to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PowerUpState
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an ActivePowerUp. */
    interface IActivePowerUp {

        /** ActivePowerUp powerUpType */
        powerUpType?: (battletanks.PowerUpType|null);

        /** ActivePowerUp durationRemaining */
        durationRemaining?: (number|null);

        /** ActivePowerUp totalDuration */
        totalDuration?: (number|null);
    }

    /** Represents an ActivePowerUp. */
    class ActivePowerUp implements IActivePowerUp {

        /**
         * Constructs a new ActivePowerUp.
         * @param [properties] Properties to set
         */
        constructor(properties?: battletanks.IActivePowerUp);

        /** ActivePowerUp powerUpType. */
        public powerUpType: battletanks.PowerUpType;

        /** ActivePowerUp durationRemaining. */
        public durationRemaining: number;

        /** ActivePowerUp totalDuration. */
        public totalDuration: number;

        /**
         * Creates a new ActivePowerUp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ActivePowerUp instance
         */
        public static create(properties?: battletanks.IActivePowerUp): battletanks.ActivePowerUp;

        /**
         * Encodes the specified ActivePowerUp message. Does not implicitly {@link battletanks.ActivePowerUp.verify|verify} messages.
         * @param message ActivePowerUp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: battletanks.IActivePowerUp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ActivePowerUp message, length delimited. Does not implicitly {@link battletanks.ActivePowerUp.verify|verify} messages.
         * @param message ActivePowerUp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: battletanks.IActivePowerUp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ActivePowerUp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ActivePowerUp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): battletanks.ActivePowerUp;

        /**
         * Decodes an ActivePowerUp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ActivePowerUp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): battletanks.ActivePowerUp;

        /**
         * Verifies an ActivePowerUp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ActivePowerUp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ActivePowerUp
         */
        public static fromObject(object: { [k: string]: any }): battletanks.ActivePowerUp;

        /**
         * Creates a plain object from an ActivePowerUp message. Also converts values to other types if specified.
         * @param message ActivePowerUp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: battletanks.ActivePowerUp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ActivePowerUp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ActivePowerUp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GameEvent. */
    interface IGameEvent {

        /** GameEvent timestamp */
        timestamp?: (number|Long|null);

        /** GameEvent playerJoined */
        playerJoined?: (battletanks.IPlayerJoinedEvent|null);

        /** GameEvent playerLeft */
        playerLeft?: (battletanks.IPlayerLeftEvent|null);

        /** GameEvent tankDestroyed */
        tankDestroyed?: (battletanks.ITankDestroyedEvent|null);

        /** GameEvent powerUpPickedUp */
        powerUpPickedUp?: (battletanks.IPowerUpPickedUpEvent|null);

        /** GameEvent projectileHit */
        projectileHit?: (battletanks.IProjectileHitEvent|null);

        /** GameEvent chatMessage */
        chatMessage?: (battletanks.IChatMessageEvent|null);

        /** GameEvent roundStarted */
        roundStarted?: (battletanks.IRoundStartedEvent|null);

        /** GameEvent roundEnded */
        roundEnded?: (battletanks.IRoundEndedEvent|null);
    }

    /** Represents a GameEvent. */
    class GameEvent implements IGameEvent {

        /**
         * Constructs a new GameEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: battletanks.IGameEvent);

        /** GameEvent timestamp. */
        public timestamp: (number|Long);

        /** GameEvent playerJoined. */
        public playerJoined?: (battletanks.IPlayerJoinedEvent|null);

        /** GameEvent playerLeft. */
        public playerLeft?: (battletanks.IPlayerLeftEvent|null);

        /** GameEvent tankDestroyed. */
        public tankDestroyed?: (battletanks.ITankDestroyedEvent|null);

        /** GameEvent powerUpPickedUp. */
        public powerUpPickedUp?: (battletanks.IPowerUpPickedUpEvent|null);

        /** GameEvent projectileHit. */
        public projectileHit?: (battletanks.IProjectileHitEvent|null);

        /** GameEvent chatMessage. */
        public chatMessage?: (battletanks.IChatMessageEvent|null);

        /** GameEvent roundStarted. */
        public roundStarted?: (battletanks.IRoundStartedEvent|null);

        /** GameEvent roundEnded. */
        public roundEnded?: (battletanks.IRoundEndedEvent|null);

        /** GameEvent eventType. */
        public eventType?: ("playerJoined"|"playerLeft"|"tankDestroyed"|"powerUpPickedUp"|"projectileHit"|"chatMessage"|"roundStarted"|"roundEnded");

        /**
         * Creates a new GameEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GameEvent instance
         */
        public static create(properties?: battletanks.IGameEvent): battletanks.GameEvent;

        /**
         * Encodes the specified GameEvent message. Does not implicitly {@link battletanks.GameEvent.verify|verify} messages.
         * @param message GameEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: battletanks.IGameEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GameEvent message, length delimited. Does not implicitly {@link battletanks.GameEvent.verify|verify} messages.
         * @param message GameEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: battletanks.IGameEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GameEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GameEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): battletanks.GameEvent;

        /**
         * Decodes a GameEvent message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GameEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): battletanks.GameEvent;

        /**
         * Verifies a GameEvent message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GameEvent message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GameEvent
         */
        public static fromObject(object: { [k: string]: any }): battletanks.GameEvent;

        /**
         * Creates a plain object from a GameEvent message. Also converts values to other types if specified.
         * @param message GameEvent
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: battletanks.GameEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GameEvent to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GameEvent
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PlayerJoinedEvent. */
    interface IPlayerJoinedEvent {

        /** PlayerJoinedEvent playerId */
        playerId?: (string|null);

        /** PlayerJoinedEvent displayName */
        displayName?: (string|null);

        /** PlayerJoinedEvent entityId */
        entityId?: (number|null);
    }

    /** Represents a PlayerJoinedEvent. */
    class PlayerJoinedEvent implements IPlayerJoinedEvent {

        /**
         * Constructs a new PlayerJoinedEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: battletanks.IPlayerJoinedEvent);

        /** PlayerJoinedEvent playerId. */
        public playerId: string;

        /** PlayerJoinedEvent displayName. */
        public displayName: string;

        /** PlayerJoinedEvent entityId. */
        public entityId: number;

        /**
         * Creates a new PlayerJoinedEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PlayerJoinedEvent instance
         */
        public static create(properties?: battletanks.IPlayerJoinedEvent): battletanks.PlayerJoinedEvent;

        /**
         * Encodes the specified PlayerJoinedEvent message. Does not implicitly {@link battletanks.PlayerJoinedEvent.verify|verify} messages.
         * @param message PlayerJoinedEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: battletanks.IPlayerJoinedEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PlayerJoinedEvent message, length delimited. Does not implicitly {@link battletanks.PlayerJoinedEvent.verify|verify} messages.
         * @param message PlayerJoinedEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: battletanks.IPlayerJoinedEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PlayerJoinedEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PlayerJoinedEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): battletanks.PlayerJoinedEvent;

        /**
         * Decodes a PlayerJoinedEvent message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PlayerJoinedEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): battletanks.PlayerJoinedEvent;

        /**
         * Verifies a PlayerJoinedEvent message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PlayerJoinedEvent message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PlayerJoinedEvent
         */
        public static fromObject(object: { [k: string]: any }): battletanks.PlayerJoinedEvent;

        /**
         * Creates a plain object from a PlayerJoinedEvent message. Also converts values to other types if specified.
         * @param message PlayerJoinedEvent
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: battletanks.PlayerJoinedEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PlayerJoinedEvent to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PlayerJoinedEvent
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PlayerLeftEvent. */
    interface IPlayerLeftEvent {

        /** PlayerLeftEvent playerId */
        playerId?: (string|null);

        /** PlayerLeftEvent displayName */
        displayName?: (string|null);
    }

    /** Represents a PlayerLeftEvent. */
    class PlayerLeftEvent implements IPlayerLeftEvent {

        /**
         * Constructs a new PlayerLeftEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: battletanks.IPlayerLeftEvent);

        /** PlayerLeftEvent playerId. */
        public playerId: string;

        /** PlayerLeftEvent displayName. */
        public displayName: string;

        /**
         * Creates a new PlayerLeftEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PlayerLeftEvent instance
         */
        public static create(properties?: battletanks.IPlayerLeftEvent): battletanks.PlayerLeftEvent;

        /**
         * Encodes the specified PlayerLeftEvent message. Does not implicitly {@link battletanks.PlayerLeftEvent.verify|verify} messages.
         * @param message PlayerLeftEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: battletanks.IPlayerLeftEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PlayerLeftEvent message, length delimited. Does not implicitly {@link battletanks.PlayerLeftEvent.verify|verify} messages.
         * @param message PlayerLeftEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: battletanks.IPlayerLeftEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PlayerLeftEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PlayerLeftEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): battletanks.PlayerLeftEvent;

        /**
         * Decodes a PlayerLeftEvent message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PlayerLeftEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): battletanks.PlayerLeftEvent;

        /**
         * Verifies a PlayerLeftEvent message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PlayerLeftEvent message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PlayerLeftEvent
         */
        public static fromObject(object: { [k: string]: any }): battletanks.PlayerLeftEvent;

        /**
         * Creates a plain object from a PlayerLeftEvent message. Also converts values to other types if specified.
         * @param message PlayerLeftEvent
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: battletanks.PlayerLeftEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PlayerLeftEvent to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PlayerLeftEvent
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a TankDestroyedEvent. */
    interface ITankDestroyedEvent {

        /** TankDestroyedEvent victimEntityId */
        victimEntityId?: (number|null);

        /** TankDestroyedEvent victimPlayerId */
        victimPlayerId?: (string|null);

        /** TankDestroyedEvent killerEntityId */
        killerEntityId?: (number|null);

        /** TankDestroyedEvent killerPlayerId */
        killerPlayerId?: (string|null);

        /** TankDestroyedEvent explosionPosition */
        explosionPosition?: (battletanks.IVector3|null);
    }

    /** Represents a TankDestroyedEvent. */
    class TankDestroyedEvent implements ITankDestroyedEvent {

        /**
         * Constructs a new TankDestroyedEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: battletanks.ITankDestroyedEvent);

        /** TankDestroyedEvent victimEntityId. */
        public victimEntityId: number;

        /** TankDestroyedEvent victimPlayerId. */
        public victimPlayerId: string;

        /** TankDestroyedEvent killerEntityId. */
        public killerEntityId: number;

        /** TankDestroyedEvent killerPlayerId. */
        public killerPlayerId: string;

        /** TankDestroyedEvent explosionPosition. */
        public explosionPosition?: (battletanks.IVector3|null);

        /**
         * Creates a new TankDestroyedEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TankDestroyedEvent instance
         */
        public static create(properties?: battletanks.ITankDestroyedEvent): battletanks.TankDestroyedEvent;

        /**
         * Encodes the specified TankDestroyedEvent message. Does not implicitly {@link battletanks.TankDestroyedEvent.verify|verify} messages.
         * @param message TankDestroyedEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: battletanks.ITankDestroyedEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TankDestroyedEvent message, length delimited. Does not implicitly {@link battletanks.TankDestroyedEvent.verify|verify} messages.
         * @param message TankDestroyedEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: battletanks.ITankDestroyedEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TankDestroyedEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TankDestroyedEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): battletanks.TankDestroyedEvent;

        /**
         * Decodes a TankDestroyedEvent message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TankDestroyedEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): battletanks.TankDestroyedEvent;

        /**
         * Verifies a TankDestroyedEvent message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TankDestroyedEvent message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TankDestroyedEvent
         */
        public static fromObject(object: { [k: string]: any }): battletanks.TankDestroyedEvent;

        /**
         * Creates a plain object from a TankDestroyedEvent message. Also converts values to other types if specified.
         * @param message TankDestroyedEvent
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: battletanks.TankDestroyedEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TankDestroyedEvent to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for TankDestroyedEvent
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PowerUpPickedUpEvent. */
    interface IPowerUpPickedUpEvent {

        /** PowerUpPickedUpEvent playerId */
        playerId?: (string|null);

        /** PowerUpPickedUpEvent tankEntityId */
        tankEntityId?: (number|null);

        /** PowerUpPickedUpEvent powerUpType */
        powerUpType?: (battletanks.PowerUpType|null);

        /** PowerUpPickedUpEvent powerUpEntityId */
        powerUpEntityId?: (number|null);
    }

    /** Represents a PowerUpPickedUpEvent. */
    class PowerUpPickedUpEvent implements IPowerUpPickedUpEvent {

        /**
         * Constructs a new PowerUpPickedUpEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: battletanks.IPowerUpPickedUpEvent);

        /** PowerUpPickedUpEvent playerId. */
        public playerId: string;

        /** PowerUpPickedUpEvent tankEntityId. */
        public tankEntityId: number;

        /** PowerUpPickedUpEvent powerUpType. */
        public powerUpType: battletanks.PowerUpType;

        /** PowerUpPickedUpEvent powerUpEntityId. */
        public powerUpEntityId: number;

        /**
         * Creates a new PowerUpPickedUpEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PowerUpPickedUpEvent instance
         */
        public static create(properties?: battletanks.IPowerUpPickedUpEvent): battletanks.PowerUpPickedUpEvent;

        /**
         * Encodes the specified PowerUpPickedUpEvent message. Does not implicitly {@link battletanks.PowerUpPickedUpEvent.verify|verify} messages.
         * @param message PowerUpPickedUpEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: battletanks.IPowerUpPickedUpEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PowerUpPickedUpEvent message, length delimited. Does not implicitly {@link battletanks.PowerUpPickedUpEvent.verify|verify} messages.
         * @param message PowerUpPickedUpEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: battletanks.IPowerUpPickedUpEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PowerUpPickedUpEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PowerUpPickedUpEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): battletanks.PowerUpPickedUpEvent;

        /**
         * Decodes a PowerUpPickedUpEvent message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PowerUpPickedUpEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): battletanks.PowerUpPickedUpEvent;

        /**
         * Verifies a PowerUpPickedUpEvent message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PowerUpPickedUpEvent message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PowerUpPickedUpEvent
         */
        public static fromObject(object: { [k: string]: any }): battletanks.PowerUpPickedUpEvent;

        /**
         * Creates a plain object from a PowerUpPickedUpEvent message. Also converts values to other types if specified.
         * @param message PowerUpPickedUpEvent
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: battletanks.PowerUpPickedUpEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PowerUpPickedUpEvent to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PowerUpPickedUpEvent
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ProjectileHitEvent. */
    interface IProjectileHitEvent {

        /** ProjectileHitEvent projectileEntityId */
        projectileEntityId?: (number|null);

        /** ProjectileHitEvent targetEntityId */
        targetEntityId?: (number|null);

        /** ProjectileHitEvent hitPosition */
        hitPosition?: (battletanks.IVector3|null);

        /** ProjectileHitEvent damageDealt */
        damageDealt?: (number|null);
    }

    /** Represents a ProjectileHitEvent. */
    class ProjectileHitEvent implements IProjectileHitEvent {

        /**
         * Constructs a new ProjectileHitEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: battletanks.IProjectileHitEvent);

        /** ProjectileHitEvent projectileEntityId. */
        public projectileEntityId: number;

        /** ProjectileHitEvent targetEntityId. */
        public targetEntityId: number;

        /** ProjectileHitEvent hitPosition. */
        public hitPosition?: (battletanks.IVector3|null);

        /** ProjectileHitEvent damageDealt. */
        public damageDealt: number;

        /**
         * Creates a new ProjectileHitEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ProjectileHitEvent instance
         */
        public static create(properties?: battletanks.IProjectileHitEvent): battletanks.ProjectileHitEvent;

        /**
         * Encodes the specified ProjectileHitEvent message. Does not implicitly {@link battletanks.ProjectileHitEvent.verify|verify} messages.
         * @param message ProjectileHitEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: battletanks.IProjectileHitEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ProjectileHitEvent message, length delimited. Does not implicitly {@link battletanks.ProjectileHitEvent.verify|verify} messages.
         * @param message ProjectileHitEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: battletanks.IProjectileHitEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ProjectileHitEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ProjectileHitEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): battletanks.ProjectileHitEvent;

        /**
         * Decodes a ProjectileHitEvent message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ProjectileHitEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): battletanks.ProjectileHitEvent;

        /**
         * Verifies a ProjectileHitEvent message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ProjectileHitEvent message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ProjectileHitEvent
         */
        public static fromObject(object: { [k: string]: any }): battletanks.ProjectileHitEvent;

        /**
         * Creates a plain object from a ProjectileHitEvent message. Also converts values to other types if specified.
         * @param message ProjectileHitEvent
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: battletanks.ProjectileHitEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ProjectileHitEvent to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ProjectileHitEvent
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ChatMessageEvent. */
    interface IChatMessageEvent {

        /** ChatMessageEvent playerId */
        playerId?: (string|null);

        /** ChatMessageEvent displayName */
        displayName?: (string|null);

        /** ChatMessageEvent message */
        message?: (string|null);

        /** ChatMessageEvent timestamp */
        timestamp?: (number|Long|null);
    }

    /** Represents a ChatMessageEvent. */
    class ChatMessageEvent implements IChatMessageEvent {

        /**
         * Constructs a new ChatMessageEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: battletanks.IChatMessageEvent);

        /** ChatMessageEvent playerId. */
        public playerId: string;

        /** ChatMessageEvent displayName. */
        public displayName: string;

        /** ChatMessageEvent message. */
        public message: string;

        /** ChatMessageEvent timestamp. */
        public timestamp: (number|Long);

        /**
         * Creates a new ChatMessageEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChatMessageEvent instance
         */
        public static create(properties?: battletanks.IChatMessageEvent): battletanks.ChatMessageEvent;

        /**
         * Encodes the specified ChatMessageEvent message. Does not implicitly {@link battletanks.ChatMessageEvent.verify|verify} messages.
         * @param message ChatMessageEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: battletanks.IChatMessageEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChatMessageEvent message, length delimited. Does not implicitly {@link battletanks.ChatMessageEvent.verify|verify} messages.
         * @param message ChatMessageEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: battletanks.IChatMessageEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChatMessageEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChatMessageEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): battletanks.ChatMessageEvent;

        /**
         * Decodes a ChatMessageEvent message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChatMessageEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): battletanks.ChatMessageEvent;

        /**
         * Verifies a ChatMessageEvent message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChatMessageEvent message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChatMessageEvent
         */
        public static fromObject(object: { [k: string]: any }): battletanks.ChatMessageEvent;

        /**
         * Creates a plain object from a ChatMessageEvent message. Also converts values to other types if specified.
         * @param message ChatMessageEvent
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: battletanks.ChatMessageEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChatMessageEvent to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ChatMessageEvent
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a RoundStartedEvent. */
    interface IRoundStartedEvent {

        /** RoundStartedEvent roundNumber */
        roundNumber?: (number|null);

        /** RoundStartedEvent roundDuration */
        roundDuration?: (number|null);
    }

    /** Represents a RoundStartedEvent. */
    class RoundStartedEvent implements IRoundStartedEvent {

        /**
         * Constructs a new RoundStartedEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: battletanks.IRoundStartedEvent);

        /** RoundStartedEvent roundNumber. */
        public roundNumber: number;

        /** RoundStartedEvent roundDuration. */
        public roundDuration: number;

        /**
         * Creates a new RoundStartedEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoundStartedEvent instance
         */
        public static create(properties?: battletanks.IRoundStartedEvent): battletanks.RoundStartedEvent;

        /**
         * Encodes the specified RoundStartedEvent message. Does not implicitly {@link battletanks.RoundStartedEvent.verify|verify} messages.
         * @param message RoundStartedEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: battletanks.IRoundStartedEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RoundStartedEvent message, length delimited. Does not implicitly {@link battletanks.RoundStartedEvent.verify|verify} messages.
         * @param message RoundStartedEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: battletanks.IRoundStartedEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RoundStartedEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoundStartedEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): battletanks.RoundStartedEvent;

        /**
         * Decodes a RoundStartedEvent message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RoundStartedEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): battletanks.RoundStartedEvent;

        /**
         * Verifies a RoundStartedEvent message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RoundStartedEvent message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RoundStartedEvent
         */
        public static fromObject(object: { [k: string]: any }): battletanks.RoundStartedEvent;

        /**
         * Creates a plain object from a RoundStartedEvent message. Also converts values to other types if specified.
         * @param message RoundStartedEvent
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: battletanks.RoundStartedEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RoundStartedEvent to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for RoundStartedEvent
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a RoundEndedEvent. */
    interface IRoundEndedEvent {

        /** RoundEndedEvent roundNumber */
        roundNumber?: (number|null);

        /** RoundEndedEvent finalScores */
        finalScores?: (battletanks.IPlayerScore[]|null);

        /** RoundEndedEvent winnerPlayerId */
        winnerPlayerId?: (string|null);
    }

    /** Represents a RoundEndedEvent. */
    class RoundEndedEvent implements IRoundEndedEvent {

        /**
         * Constructs a new RoundEndedEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: battletanks.IRoundEndedEvent);

        /** RoundEndedEvent roundNumber. */
        public roundNumber: number;

        /** RoundEndedEvent finalScores. */
        public finalScores: battletanks.IPlayerScore[];

        /** RoundEndedEvent winnerPlayerId. */
        public winnerPlayerId: string;

        /**
         * Creates a new RoundEndedEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoundEndedEvent instance
         */
        public static create(properties?: battletanks.IRoundEndedEvent): battletanks.RoundEndedEvent;

        /**
         * Encodes the specified RoundEndedEvent message. Does not implicitly {@link battletanks.RoundEndedEvent.verify|verify} messages.
         * @param message RoundEndedEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: battletanks.IRoundEndedEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RoundEndedEvent message, length delimited. Does not implicitly {@link battletanks.RoundEndedEvent.verify|verify} messages.
         * @param message RoundEndedEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: battletanks.IRoundEndedEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RoundEndedEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoundEndedEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): battletanks.RoundEndedEvent;

        /**
         * Decodes a RoundEndedEvent message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RoundEndedEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): battletanks.RoundEndedEvent;

        /**
         * Verifies a RoundEndedEvent message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RoundEndedEvent message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RoundEndedEvent
         */
        public static fromObject(object: { [k: string]: any }): battletanks.RoundEndedEvent;

        /**
         * Creates a plain object from a RoundEndedEvent message. Also converts values to other types if specified.
         * @param message RoundEndedEvent
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: battletanks.RoundEndedEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RoundEndedEvent to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for RoundEndedEvent
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PlayerScore. */
    interface IPlayerScore {

        /** PlayerScore playerId */
        playerId?: (string|null);

        /** PlayerScore displayName */
        displayName?: (string|null);

        /** PlayerScore kills */
        kills?: (number|null);

        /** PlayerScore deaths */
        deaths?: (number|null);

        /** PlayerScore score */
        score?: (number|null);
    }

    /** Represents a PlayerScore. */
    class PlayerScore implements IPlayerScore {

        /**
         * Constructs a new PlayerScore.
         * @param [properties] Properties to set
         */
        constructor(properties?: battletanks.IPlayerScore);

        /** PlayerScore playerId. */
        public playerId: string;

        /** PlayerScore displayName. */
        public displayName: string;

        /** PlayerScore kills. */
        public kills: number;

        /** PlayerScore deaths. */
        public deaths: number;

        /** PlayerScore score. */
        public score: number;

        /**
         * Creates a new PlayerScore instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PlayerScore instance
         */
        public static create(properties?: battletanks.IPlayerScore): battletanks.PlayerScore;

        /**
         * Encodes the specified PlayerScore message. Does not implicitly {@link battletanks.PlayerScore.verify|verify} messages.
         * @param message PlayerScore message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: battletanks.IPlayerScore, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PlayerScore message, length delimited. Does not implicitly {@link battletanks.PlayerScore.verify|verify} messages.
         * @param message PlayerScore message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: battletanks.IPlayerScore, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PlayerScore message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PlayerScore
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): battletanks.PlayerScore;

        /**
         * Decodes a PlayerScore message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PlayerScore
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): battletanks.PlayerScore;

        /**
         * Verifies a PlayerScore message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PlayerScore message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PlayerScore
         */
        public static fromObject(object: { [k: string]: any }): battletanks.PlayerScore;

        /**
         * Creates a plain object from a PlayerScore message. Also converts values to other types if specified.
         * @param message PlayerScore
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: battletanks.PlayerScore, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PlayerScore to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PlayerScore
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GameStateUpdate. */
    interface IGameStateUpdate {

        /** GameStateUpdate tick */
        tick?: (number|Long|null);

        /** GameStateUpdate roundTimeRemaining */
        roundTimeRemaining?: (number|null);

        /** GameStateUpdate tanks */
        tanks?: (battletanks.ITankState[]|null);

        /** GameStateUpdate projectiles */
        projectiles?: (battletanks.IProjectileState[]|null);

        /** GameStateUpdate powerUps */
        powerUps?: (battletanks.IPowerUpState[]|null);

        /** GameStateUpdate events */
        events?: (battletanks.IGameEvent[]|null);

        /** GameStateUpdate scores */
        scores?: (battletanks.IPlayerScore[]|null);

        /** GameStateUpdate isDeltaUpdate */
        isDeltaUpdate?: (boolean|null);

        /** GameStateUpdate fullStateTick */
        fullStateTick?: (number|null);
    }

    /** Represents a GameStateUpdate. */
    class GameStateUpdate implements IGameStateUpdate {

        /**
         * Constructs a new GameStateUpdate.
         * @param [properties] Properties to set
         */
        constructor(properties?: battletanks.IGameStateUpdate);

        /** GameStateUpdate tick. */
        public tick: (number|Long);

        /** GameStateUpdate roundTimeRemaining. */
        public roundTimeRemaining: number;

        /** GameStateUpdate tanks. */
        public tanks: battletanks.ITankState[];

        /** GameStateUpdate projectiles. */
        public projectiles: battletanks.IProjectileState[];

        /** GameStateUpdate powerUps. */
        public powerUps: battletanks.IPowerUpState[];

        /** GameStateUpdate events. */
        public events: battletanks.IGameEvent[];

        /** GameStateUpdate scores. */
        public scores: battletanks.IPlayerScore[];

        /** GameStateUpdate isDeltaUpdate. */
        public isDeltaUpdate: boolean;

        /** GameStateUpdate fullStateTick. */
        public fullStateTick: number;

        /**
         * Creates a new GameStateUpdate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GameStateUpdate instance
         */
        public static create(properties?: battletanks.IGameStateUpdate): battletanks.GameStateUpdate;

        /**
         * Encodes the specified GameStateUpdate message. Does not implicitly {@link battletanks.GameStateUpdate.verify|verify} messages.
         * @param message GameStateUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: battletanks.IGameStateUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GameStateUpdate message, length delimited. Does not implicitly {@link battletanks.GameStateUpdate.verify|verify} messages.
         * @param message GameStateUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: battletanks.IGameStateUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GameStateUpdate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GameStateUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): battletanks.GameStateUpdate;

        /**
         * Decodes a GameStateUpdate message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GameStateUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): battletanks.GameStateUpdate;

        /**
         * Verifies a GameStateUpdate message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GameStateUpdate message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GameStateUpdate
         */
        public static fromObject(object: { [k: string]: any }): battletanks.GameStateUpdate;

        /**
         * Creates a plain object from a GameStateUpdate message. Also converts values to other types if specified.
         * @param message GameStateUpdate
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: battletanks.GameStateUpdate, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GameStateUpdate to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GameStateUpdate
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a JoinGameRequest. */
    interface IJoinGameRequest {

        /** JoinGameRequest displayName */
        displayName?: (string|null);

        /** JoinGameRequest clientVersion */
        clientVersion?: (string|null);
    }

    /** Represents a JoinGameRequest. */
    class JoinGameRequest implements IJoinGameRequest {

        /**
         * Constructs a new JoinGameRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: battletanks.IJoinGameRequest);

        /** JoinGameRequest displayName. */
        public displayName: string;

        /** JoinGameRequest clientVersion. */
        public clientVersion: string;

        /**
         * Creates a new JoinGameRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns JoinGameRequest instance
         */
        public static create(properties?: battletanks.IJoinGameRequest): battletanks.JoinGameRequest;

        /**
         * Encodes the specified JoinGameRequest message. Does not implicitly {@link battletanks.JoinGameRequest.verify|verify} messages.
         * @param message JoinGameRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: battletanks.IJoinGameRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified JoinGameRequest message, length delimited. Does not implicitly {@link battletanks.JoinGameRequest.verify|verify} messages.
         * @param message JoinGameRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: battletanks.IJoinGameRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a JoinGameRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns JoinGameRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): battletanks.JoinGameRequest;

        /**
         * Decodes a JoinGameRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns JoinGameRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): battletanks.JoinGameRequest;

        /**
         * Verifies a JoinGameRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a JoinGameRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns JoinGameRequest
         */
        public static fromObject(object: { [k: string]: any }): battletanks.JoinGameRequest;

        /**
         * Creates a plain object from a JoinGameRequest message. Also converts values to other types if specified.
         * @param message JoinGameRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: battletanks.JoinGameRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this JoinGameRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for JoinGameRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a JoinGameResponse. */
    interface IJoinGameResponse {

        /** JoinGameResponse success */
        success?: (boolean|null);

        /** JoinGameResponse errorMessage */
        errorMessage?: (string|null);

        /** JoinGameResponse playerId */
        playerId?: (string|null);

        /** JoinGameResponse assignedEntityId */
        assignedEntityId?: (number|null);

        /** JoinGameResponse gameConfig */
        gameConfig?: (battletanks.IGameConfig|null);
    }

    /** Represents a JoinGameResponse. */
    class JoinGameResponse implements IJoinGameResponse {

        /**
         * Constructs a new JoinGameResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: battletanks.IJoinGameResponse);

        /** JoinGameResponse success. */
        public success: boolean;

        /** JoinGameResponse errorMessage. */
        public errorMessage: string;

        /** JoinGameResponse playerId. */
        public playerId: string;

        /** JoinGameResponse assignedEntityId. */
        public assignedEntityId: number;

        /** JoinGameResponse gameConfig. */
        public gameConfig?: (battletanks.IGameConfig|null);

        /**
         * Creates a new JoinGameResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns JoinGameResponse instance
         */
        public static create(properties?: battletanks.IJoinGameResponse): battletanks.JoinGameResponse;

        /**
         * Encodes the specified JoinGameResponse message. Does not implicitly {@link battletanks.JoinGameResponse.verify|verify} messages.
         * @param message JoinGameResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: battletanks.IJoinGameResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified JoinGameResponse message, length delimited. Does not implicitly {@link battletanks.JoinGameResponse.verify|verify} messages.
         * @param message JoinGameResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: battletanks.IJoinGameResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a JoinGameResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns JoinGameResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): battletanks.JoinGameResponse;

        /**
         * Decodes a JoinGameResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns JoinGameResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): battletanks.JoinGameResponse;

        /**
         * Verifies a JoinGameResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a JoinGameResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns JoinGameResponse
         */
        public static fromObject(object: { [k: string]: any }): battletanks.JoinGameResponse;

        /**
         * Creates a plain object from a JoinGameResponse message. Also converts values to other types if specified.
         * @param message JoinGameResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: battletanks.JoinGameResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this JoinGameResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for JoinGameResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GameConfig. */
    interface IGameConfig {

        /** GameConfig tickRate */
        tickRate?: (number|null);

        /** GameConfig maxPlayers */
        maxPlayers?: (number|null);

        /** GameConfig roundDuration */
        roundDuration?: (number|null);

        /** GameConfig respawnTime */
        respawnTime?: (number|null);

        /** GameConfig invulnerabilityTime */
        invulnerabilityTime?: (number|null);

        /** GameConfig mapSize */
        mapSize?: (battletanks.IVector2|null);
    }

    /** Represents a GameConfig. */
    class GameConfig implements IGameConfig {

        /**
         * Constructs a new GameConfig.
         * @param [properties] Properties to set
         */
        constructor(properties?: battletanks.IGameConfig);

        /** GameConfig tickRate. */
        public tickRate: number;

        /** GameConfig maxPlayers. */
        public maxPlayers: number;

        /** GameConfig roundDuration. */
        public roundDuration: number;

        /** GameConfig respawnTime. */
        public respawnTime: number;

        /** GameConfig invulnerabilityTime. */
        public invulnerabilityTime: number;

        /** GameConfig mapSize. */
        public mapSize?: (battletanks.IVector2|null);

        /**
         * Creates a new GameConfig instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GameConfig instance
         */
        public static create(properties?: battletanks.IGameConfig): battletanks.GameConfig;

        /**
         * Encodes the specified GameConfig message. Does not implicitly {@link battletanks.GameConfig.verify|verify} messages.
         * @param message GameConfig message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: battletanks.IGameConfig, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GameConfig message, length delimited. Does not implicitly {@link battletanks.GameConfig.verify|verify} messages.
         * @param message GameConfig message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: battletanks.IGameConfig, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GameConfig message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GameConfig
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): battletanks.GameConfig;

        /**
         * Decodes a GameConfig message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GameConfig
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): battletanks.GameConfig;

        /**
         * Verifies a GameConfig message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GameConfig message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GameConfig
         */
        public static fromObject(object: { [k: string]: any }): battletanks.GameConfig;

        /**
         * Creates a plain object from a GameConfig message. Also converts values to other types if specified.
         * @param message GameConfig
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: battletanks.GameConfig, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GameConfig to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GameConfig
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PingRequest. */
    interface IPingRequest {

        /** PingRequest clientTimestamp */
        clientTimestamp?: (number|Long|null);

        /** PingRequest sequenceNumber */
        sequenceNumber?: (number|null);
    }

    /** Represents a PingRequest. */
    class PingRequest implements IPingRequest {

        /**
         * Constructs a new PingRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: battletanks.IPingRequest);

        /** PingRequest clientTimestamp. */
        public clientTimestamp: (number|Long);

        /** PingRequest sequenceNumber. */
        public sequenceNumber: number;

        /**
         * Creates a new PingRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PingRequest instance
         */
        public static create(properties?: battletanks.IPingRequest): battletanks.PingRequest;

        /**
         * Encodes the specified PingRequest message. Does not implicitly {@link battletanks.PingRequest.verify|verify} messages.
         * @param message PingRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: battletanks.IPingRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PingRequest message, length delimited. Does not implicitly {@link battletanks.PingRequest.verify|verify} messages.
         * @param message PingRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: battletanks.IPingRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PingRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PingRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): battletanks.PingRequest;

        /**
         * Decodes a PingRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PingRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): battletanks.PingRequest;

        /**
         * Verifies a PingRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PingRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PingRequest
         */
        public static fromObject(object: { [k: string]: any }): battletanks.PingRequest;

        /**
         * Creates a plain object from a PingRequest message. Also converts values to other types if specified.
         * @param message PingRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: battletanks.PingRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PingRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PingRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PongResponse. */
    interface IPongResponse {

        /** PongResponse clientTimestamp */
        clientTimestamp?: (number|Long|null);

        /** PongResponse serverTimestamp */
        serverTimestamp?: (number|Long|null);

        /** PongResponse sequenceNumber */
        sequenceNumber?: (number|null);
    }

    /** Represents a PongResponse. */
    class PongResponse implements IPongResponse {

        /**
         * Constructs a new PongResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: battletanks.IPongResponse);

        /** PongResponse clientTimestamp. */
        public clientTimestamp: (number|Long);

        /** PongResponse serverTimestamp. */
        public serverTimestamp: (number|Long);

        /** PongResponse sequenceNumber. */
        public sequenceNumber: number;

        /**
         * Creates a new PongResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PongResponse instance
         */
        public static create(properties?: battletanks.IPongResponse): battletanks.PongResponse;

        /**
         * Encodes the specified PongResponse message. Does not implicitly {@link battletanks.PongResponse.verify|verify} messages.
         * @param message PongResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: battletanks.IPongResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PongResponse message, length delimited. Does not implicitly {@link battletanks.PongResponse.verify|verify} messages.
         * @param message PongResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: battletanks.IPongResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PongResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PongResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): battletanks.PongResponse;

        /**
         * Decodes a PongResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PongResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): battletanks.PongResponse;

        /**
         * Verifies a PongResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PongResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PongResponse
         */
        public static fromObject(object: { [k: string]: any }): battletanks.PongResponse;

        /**
         * Creates a plain object from a PongResponse message. Also converts values to other types if specified.
         * @param message PongResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: battletanks.PongResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PongResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PongResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a NetworkMessage. */
    interface INetworkMessage {

        /** NetworkMessage timestamp */
        timestamp?: (number|Long|null);

        /** NetworkMessage joinGameRequest */
        joinGameRequest?: (battletanks.IJoinGameRequest|null);

        /** NetworkMessage playerInput */
        playerInput?: (battletanks.IPlayerInput|null);

        /** NetworkMessage pingRequest */
        pingRequest?: (battletanks.IPingRequest|null);

        /** NetworkMessage joinGameResponse */
        joinGameResponse?: (battletanks.IJoinGameResponse|null);

        /** NetworkMessage gameStateUpdate */
        gameStateUpdate?: (battletanks.IGameStateUpdate|null);

        /** NetworkMessage pongResponse */
        pongResponse?: (battletanks.IPongResponse|null);

        /** NetworkMessage chatMessage */
        chatMessage?: (battletanks.IChatMessageEvent|null);
    }

    /** Represents a NetworkMessage. */
    class NetworkMessage implements INetworkMessage {

        /**
         * Constructs a new NetworkMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: battletanks.INetworkMessage);

        /** NetworkMessage timestamp. */
        public timestamp: (number|Long);

        /** NetworkMessage joinGameRequest. */
        public joinGameRequest?: (battletanks.IJoinGameRequest|null);

        /** NetworkMessage playerInput. */
        public playerInput?: (battletanks.IPlayerInput|null);

        /** NetworkMessage pingRequest. */
        public pingRequest?: (battletanks.IPingRequest|null);

        /** NetworkMessage joinGameResponse. */
        public joinGameResponse?: (battletanks.IJoinGameResponse|null);

        /** NetworkMessage gameStateUpdate. */
        public gameStateUpdate?: (battletanks.IGameStateUpdate|null);

        /** NetworkMessage pongResponse. */
        public pongResponse?: (battletanks.IPongResponse|null);

        /** NetworkMessage chatMessage. */
        public chatMessage?: (battletanks.IChatMessageEvent|null);

        /** NetworkMessage messageType. */
        public messageType?: ("joinGameRequest"|"playerInput"|"pingRequest"|"joinGameResponse"|"gameStateUpdate"|"pongResponse"|"chatMessage");

        /**
         * Creates a new NetworkMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NetworkMessage instance
         */
        public static create(properties?: battletanks.INetworkMessage): battletanks.NetworkMessage;

        /**
         * Encodes the specified NetworkMessage message. Does not implicitly {@link battletanks.NetworkMessage.verify|verify} messages.
         * @param message NetworkMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: battletanks.INetworkMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NetworkMessage message, length delimited. Does not implicitly {@link battletanks.NetworkMessage.verify|verify} messages.
         * @param message NetworkMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: battletanks.INetworkMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NetworkMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NetworkMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): battletanks.NetworkMessage;

        /**
         * Decodes a NetworkMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NetworkMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): battletanks.NetworkMessage;

        /**
         * Verifies a NetworkMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NetworkMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NetworkMessage
         */
        public static fromObject(object: { [k: string]: any }): battletanks.NetworkMessage;

        /**
         * Creates a plain object from a NetworkMessage message. Also converts values to other types if specified.
         * @param message NetworkMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: battletanks.NetworkMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NetworkMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for NetworkMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}
