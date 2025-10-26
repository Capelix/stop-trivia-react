const { cleanup, init } = require("detox")

beforeAll(async () => {
  await init()
})

afterAll(async () => {
  await cleanup()
})

// Global test timeout
jest.setTimeout(120000)

// Mock Firebase for testing
jest.mock("@react-native-firebase/auth", () => ({
  auth: () => ({
    currentUser: {
      uid: "test-user-id",
      displayName: "Test User",
      email: "test@example.com",
      photoURL: null,
      emailVerified: true,
    },
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn(),
  }),
}))

jest.mock("@react-native-firebase/firestore", () => ({
  firestore: () => ({
    collection: jest.fn(),
    doc: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    onSnapshot: jest.fn(),
  }),
}))

jest.mock("@react-native-firebase/storage", () => ({
  storage: () => ({
    ref: jest.fn(),
    uploadBytesResumable: jest.fn(),
    getDownloadURL: jest.fn(),
  }),
}))

jest.mock("react-native-google-mobile-ads", () => ({
  default: () => ({
    initialize: jest.fn(),
  }),
  InterstitialAd: {
    createForAdRequest: jest.fn(() => ({
      addAdEventListener: jest.fn(),
      load: jest.fn(),
      show: jest.fn(),
    })),
  },
  TestIds: {
    INTERSTITIAL: "test-interstitial-id",
  },
  AdEventType: {
    LOADED: "loaded",
    OPENED: "opened",
    CLOSED: "closed",
  },
}))

jest.mock("@react-native-community/netinfo", () => ({
  addEventListener: jest.fn(() => () => {}),
  getCurrentConnectivity: jest.fn(() => Promise.resolve({ isConnected: true })),
}))

jest.mock("react-native-device-info", () => ({
  getVersion: jest.fn(() => "2.4.4"),
}))

jest.mock("react-native-localize", () => ({
  getLocales: jest.fn(() => [{ languageCode: "en" }]),
}))

jest.mock("@react-native-clipboard/clipboard", () => ({
  setString: jest.fn(),
}))

jest.mock("expo-image-picker", () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: "granted" })
  ),
  launchImageLibraryAsync: jest.fn(() =>
    Promise.resolve({ canceled: false, assets: [{ uri: "test-image-uri" }] })
  ),
}))
