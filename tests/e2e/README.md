# Stop Trivia E2E Tests

This directory contains comprehensive end-to-end tests for the Stop Trivia React Native application using Detox.

## 📁 Test Structure

```
tests/e2e/
├── .detoxrc.js              # Detox configuration
├── setup.js                 # Test setup and mocking
├── jest.config.js           # Jest configuration
├── package.json             # Test dependencies and scripts
├── README.md               # This file
├── app.e2e.test.js         # Main comprehensive test suite
├── stop-game.e2e.test.js   # Stop game specific tests
├── ttt-game.e2e.test.js    # Tic Tac Toe specific tests
└── utils/
    ├── TestUtils.js         # Test utility functions
    └── TestData.js          # Test data and constants
```

## 🎯 Test Coverage

The E2E tests comprehensively cover:

### 1. **App Launch and Authentication**
- ✅ Splash screen display and timing
- ✅ Login form navigation
- ✅ Google authentication flow
- ✅ Authentication state management

### 2. **Main Navigation**
- ✅ Tab navigation between Stop and TTT games
- ✅ Settings screen access
- ✅ Header navigation elements
- ✅ Back button functionality

### 3. **Stop Game Features**
- ✅ Game mode selection (offline, online, join)
- ✅ Input field handling and validation
- ✅ Points scoring system (25, 50, 75, 100 points)
- ✅ Game restart functionality
- ✅ Online game creation with time selection
- ✅ Room code generation and sharing
- ✅ Join game with code validation
- ✅ Multiple rounds gameplay
- ✅ Keyboard interactions

### 4. **Tic Tac Toe Game Features**
- ✅ Game mode selection
- ✅ 3x3 game board interactions
- ✅ Move validation and turn management
- ✅ All winning conditions (rows, columns, diagonals)
- ✅ Draw condition detection
- ✅ Game restart functionality
- ✅ Visual feedback and animations

### 5. **Settings Screen**
- ✅ User profile management
- ✅ Vibration settings toggle
- ✅ Language selection (English/Spanish)
- ✅ App sharing functionality
- ✅ External links (rate game, website, privacy, terms, GitHub, feedback)
- ✅ Sign out functionality
- ✅ Profile image upload with progress

### 6. **App State Management**
- ✅ Background/foreground handling
- ✅ Network connectivity changes
- ✅ Offline state management
- ✅ App state persistence

### 7. **Error Handling**
- ✅ Invalid input handling
- ✅ Network error recovery
- ✅ Graceful error messages
- ✅ Edge case scenarios

### 8. **Performance Tests**
- ✅ App load time validation (< 10 seconds)
- ✅ Rapid navigation stability
- ✅ Memory usage optimization
- ✅ Animation performance

## 🚀 Getting Started

### Prerequisites

1. **Install Detox CLI globally:**
```bash
npm install -g detox-cli
```

2. **Install test dependencies:**
```bash
cd tests/e2e
npm install
```

3. **Build the app for testing:**
```bash
# For iOS
npm run build:ios

# For Android
npm run build:android
```

### Running Tests

```bash
# Run all tests
npm test

# Run iOS tests
npm run test:ios

# Run Android tests
npm run test:android

# Run on specific device
npm run device:ios
npm run device:android

# Run with verbose logging
detox test --loglevel verbose
```

## 📱 Test Configuration

### Supported Platforms
- **iOS**: iPhone 14 Simulator
- **Android**: Pixel 4 API 30 Emulator

### Test Environments
- **Debug**: Development builds with debugging enabled
- **Release**: Production builds for final validation

## 🧪 Test Data and Mocking

### Comprehensive Mocking
- ✅ Firebase Authentication
- ✅ Firebase Firestore
- ✅ Firebase Storage
- ✅ Google Mobile Ads
- ✅ Network connectivity
- ✅ Device information
- ✅ Image picker
- ✅ Clipboard operations
- ✅ Localization

### Test Scenarios
- ✅ Valid and invalid game codes
- ✅ Winning and draw scenarios
- ✅ Performance benchmarks
- ✅ Error conditions
- ✅ Edge cases

## 🏷️ Required Test IDs

To run these tests, add the following test IDs to your app components:

### Main Navigation
```javascript
testID="main-tabs"
testID="stop-tab"
testID="ttt-tab"
testID="settings-button"
```

### Stop Game
```javascript
testID="stop-screen"
testID="offline-mode-button"
testID="online-mode-button"
testID="join-game-button"
testID="stop-game-screen"
testID="game-inputs-container"
testID="name-input"
testID="country-input"
testID="animal-input"
testID="food-input"
testID="object-input"
testID="lastName-input"
testID="color-input"
testID="artist-input"
testID="fruit-input"
testID="profession-input"
testID="points-buttons-container"
testID="points-50-button"
testID="points-100-button"
testID="points-display"
testID="restart-button"
testID="restart-confirm-modal"
testID="confirm-restart-button"
testID="time-selection-modal"
testID="time-3min-button"
testID="room-code-display"
testID="players-count"
testID="game-code-input"
testID="error-message"
```

### TTT Game
```javascript
testID="ttt-screen"
testID="ttt-offline-mode-button"
testID="ttt-game-screen"
testID="ttt-game-board"
testID="current-player-display"
testID="ttt-square-0" // through ttt-square-8
testID="ttt-restart-button"
testID="winner-display"
```

### Settings
```javascript
testID="settings-screen"
testID="user-profile-section"
testID="user-name-display"
testID="user-email-display"
testID="user-id-display"
testID="vibration-switch"
testID="language-button"
testID="language-selection-modal"
testID="language-spanish-option"
testID="share-app-button"
testID="rate-game-button"
testID="website-button"
testID="privacy-policy-button"
testID="terms-conditions-button"
testID="github-button"
testID="feedback-button"
testID="sign-out-button"
testID="profile-image-button"
testID="image-upload-modal"
testID="confirm-upload-button"
```

### Authentication
```javascript
testID="splash-screen"
testID="login-form"
testID="google-signin-button"
```

### System
```javascript
testID="offline-indicator"
testID="offline-toast"
testID="copy-confirmation-toast"
```

## 🔧 Test Utilities

### TestUtils Class
The `TestUtils` class provides helper methods for:
- Element interaction (tap, type, clear)
- Element visibility checks
- Navigation helpers
- Game state management
- Performance measurement
- Error handling
- Network simulation

### TestData Constants
The `TestData` object contains:
- Sample user data
- Game scenarios
- Timeout configurations
- Error messages
- Performance thresholds

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Ensure the main app builds successfully
   - Check simulator/emulator availability
   - Verify Detox configuration

2. **Device Not Found**
   - Start iOS Simulator: `xcrun simctl boot "iPhone 14"`
   - Start Android Emulator: `emulator -avd Pixel_4_API_30`

3. **Test Timeouts**
   - Increase timeout values in `jest.config.js`
   - Check device performance
   - Verify test IDs are correctly added

4. **Mock Issues**
   - Verify all mocks in `setup.js`
   - Check Firebase configuration
   - Ensure network mocking is working

### Debug Mode

Run tests with detailed logging:
```bash
detox test --loglevel verbose --record-videos all
```

### Performance Issues

If tests are slow:
1. Use release builds for performance tests
2. Close unnecessary applications
3. Increase device resources
4. Use faster simulators/emulators

## 📊 Test Reports

Tests generate detailed reports including:
- Test execution time
- Pass/fail status
- Error messages
- Performance metrics
- Screenshots (if enabled)

## 🔄 Continuous Integration

These tests are designed for CI/CD pipelines:
- ✅ Proper cleanup after each test
- ✅ Timeout handling
- ✅ Error recovery
- ✅ Performance monitoring
- ✅ Cross-platform compatibility

## 📈 Best Practices

1. **Test Isolation**: Each test runs independently
2. **Data Cleanup**: Tests clean up after themselves
3. **Error Handling**: Graceful error recovery
4. **Performance**: Optimized for speed
5. **Maintainability**: Well-structured and documented

## 🤝 Contributing

When adding new tests:
1. Follow the existing structure
2. Add appropriate test IDs
3. Update documentation
4. Include error scenarios
5. Test on both platforms

## 📞 Support

For issues with these tests:
1. Check the troubleshooting section
2. Review Detox documentation
3. Verify test ID implementation
4. Check device/simulator status