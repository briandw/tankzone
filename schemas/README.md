# Battlezone Message Validation System

This directory contains JSON schemas and validation utilities for the Battlezone multiplayer game to ensure robust client-server communication.

## Overview

The validation system provides:

- **JSON Schemas** - Formal definitions of message formats
- **Client-side Validation** - JavaScript validation for messages sent to server
- **Server-side Validation** - Rust validation for incoming client messages and outgoing server messages
- **Comprehensive Testing** - Test suite to ensure validation catches errors correctly

## Schema Files

### `game-objects.json`
Defines shared game objects used in messages:
- `Player` - Player state with position, rotation, health, etc.
- `Enemy` - AI enemy with position, rotation, health
- `Bullet` - Projectile with position and velocity
- Common types: `position`, `rotation`, `velocity`, `uuid`, `playerId`

### `client-messages.json`
Defines messages sent from client to server:
- `playerInput` - Real-time WASD + mouse input (high frequency)
- `fireCommand` - Fire bullet command
- `chatMessage` - Chat message text
- `ping` - Latency test
- Legacy messages: `playerUpdate`, `bulletFired`, `bulletHit` (deprecated)

### `server-messages.json`
Defines messages sent from server to client:
- `playerAssigned` - Assign player ID to new client
- `playerJoined`/`playerLeft` - Player connection events
- `gameStateUpdate` - Complete game state (players + enemies)
- `playerMoved` - Individual player position update
- `bulletSpawned`/`bulletDestroyed` - Bullet lifecycle
- `enemySpawned`/`enemyMoved`/`enemyHit`/`enemyDestroyed` - Enemy events
- `chatMessage` - Chat broadcast
- `error`/`serverInfo` - System messages

## Client-side Validation

### Setup
The validator is automatically loaded in `public/index.html`:
```html
<script src="schema-validator.js"></script>
```

### Usage
Validation is **optional** and enabled via URL parameter:
```
http://localhost:3000/?validate=true
```

Or programmatically:
```javascript
await window.BattlezoneValidator.enable();
```

### Integration
The game automatically validates messages:
```javascript
// Outgoing messages
sendMessage(message) {
    if (!window.BattlezoneValidator.validateClientMessage(message)) {
        console.error('Invalid message, not sending');
        return;
    }
    // ... send message
}

// Incoming messages
processServerMessage(message) {
    if (!window.BattlezoneValidator.validateServerMessage(message)) {
        console.error('Invalid server message');
        return;
    }
    // ... process message
}
```

## Server-side Validation

### Usage
```rust
use battlezone_server::validation::{ClientMessageValidator, ServerMessageValidator};

// Validate client messages
let mut client_validator = ClientMessageValidator::new();
let result = client_validator.validate(player_id, &message);
if !result.valid {
    eprintln!("Invalid client message: {:?}", result.errors);
    return;
}

// Validate server messages before broadcasting
let server_validator = ServerMessageValidator::new();
let result = server_validator.validate(&message);
if !result.valid {
    eprintln!("Invalid server message: {:?}", result.errors);
    return;
}
```

### Features
- **Rate Limiting** - Prevents message spam (60 messages/second per player)
- **Data Validation** - Checks for NaN, infinity, out-of-bounds values
- **Type Safety** - Ensures required fields and correct types
- **Deprecation Warnings** - Warns about deprecated message types
- **Comprehensive Logging** - Detailed error messages for debugging

## Testing

Run schema validation tests:
```bash
cargo test --test schema_validation_tests
```

Tests cover:
- ✅ Valid message acceptance
- ❌ Invalid message rejection  
- ⚠️ Warning generation (conflicting input, deprecated messages)
- 🚫 Rate limiting enforcement
- 🔢 Boundary value testing (NaN, infinity, out-of-bounds)

## Error Categories

### Critical Errors (Message Rejected)
- Missing required fields
- Invalid data types
- NaN or infinite numeric values
- Empty required strings
- Out-of-bounds values
- Rate limit exceeded

### Warnings (Message Accepted)
- Conflicting input (W+S pressed simultaneously)
- Deprecated message types
- Zero timestamps
- Very low bullet speeds

## Best Practices

### For Developers
1. **Always validate before sending** - Use the validation utilities
2. **Check validation results** - Handle errors gracefully
3. **Monitor logs** - Watch for validation warnings during development
4. **Test edge cases** - Include boundary values in testing
5. **Update schemas** - Keep schemas in sync with message changes

### For Debugging
1. **Enable validation** - Use `?validate=true` during development
2. **Check browser console** - Validation errors are logged clearly
3. **Monitor server logs** - Server-side validation provides detailed errors
4. **Use test suite** - Run validation tests when changing message formats

## Future Enhancements

Potential improvements:
- **JSON Schema Library** - Replace custom validation with `Ajv` (client) / `jsonschema` (server)
- **Schema Evolution** - Version schemas for backward compatibility
- **Performance Monitoring** - Track validation overhead
- **Schema Generation** - Auto-generate schemas from Rust types
- **IDE Integration** - Provide schema files for IDE autocomplete/validation

## Troubleshooting

### Common Issues

**"Schema validation disabled"**
- Schemas failed to load from `/schemas/` directory
- Check that schema files are served by the web server

**"Unknown message type"**
- Message type not defined in schema
- Check spelling and add new message types to appropriate schema

**"Field X is not finite"**
- NaN or infinite values in numeric fields
- Check for division by zero or invalid calculations

**"Rate limit exceeded"**
- Too many messages sent too quickly
- Implement proper input throttling (max 60fps for input)

### Debugging Tips
1. Check browser network tab for schema loading errors
2. Use `window.BattlezoneValidator.getStats()` to check validator status
3. Look for validation errors in both client and server logs
4. Test with simple valid messages first to verify setup 