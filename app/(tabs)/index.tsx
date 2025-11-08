import { Theme } from "@/constants/Theme"
import React, { useCallback, useEffect, useRef, useState } from "react"
import {
  View,
  Text,
  Vibration,
  Pressable,
  Keyboard,
  ActivityIndicator,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  ToastAndroid,
  ScrollView,
} from "react-native"
import { ForwardIcon, HashIcon, LinkIcon } from "@/components/ui/Icons"
import { useFocusEffect, useRouter } from "expo-router"
import { useStorage } from "@/hooks/useStorage"
import { parseBoolean } from "@/libs/parseBoolean"
import LottieView from "lottie-react-native"
import ic from "@/assets/lotties/ic_gamepad.json"
import ic_launcher from "@/assets/lotties/ic_brand.json"
import { ModesButton } from "@/components/ModesButton"
import { FocusInput } from "@/components/FocusInput"
import Fire from "@/db/Fire"
import { GameStatus, StopModel, TTTModel } from "@/interfaces/Game"
import { useTranslation } from "react-i18next"
import NetInfo from "@react-native-community/netinfo"
import { Screen } from "@/components/ui/Screen"
import { WhiteSpace } from "@/components/WhiteSpace"
import BottomSheet from "@gorhom/bottom-sheet"
import { BottomSheetModal } from "@/components/BottomSheetModal"

export default function Index() {
  const [vibrationEnabled, setVibrationEnabled] = useState(true)
  const [id, setId] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [onlineLoading, setOnlineLoading] = useState(false)
  const [connection, setConnection] = useState(true)

  const { navigate } = useRouter()
  const { getItem } = useStorage()
  const { t } = useTranslation()

  const sheetRef = useRef<BottomSheet>(null)

  useFocusEffect(
    useCallback(() => {
      const loadSettings = async () => {
        const vibrationValue = await getItem("vibration")
        setVibrationEnabled(parseBoolean(vibrationValue))
      }
      loadSettings()
    }, [])
  )

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnection(state.isConnected ?? false)
    })

    return unsubscribe()
  }, [])

  const handleCodeChange = (text: string) => {
    setError(null)
    setId(text.trim().toLocaleLowerCase())
  }

  const handlePress = (flag: string, time: number = 300) => {
    if (loading) return

    vibrationEnabled && Vibration.vibrate(10)
    setError(null)

    if (flag === "stop-online") {
      if (!connection) {
        ToastAndroid.showWithGravity(
          t("you_are_offline"),
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        )
        return
      }

      if (onlineLoading) return

      setOnlineLoading(true)
      setModalVisible(true)

      return
    }

    if (flag === "ttt-online") {
      if (!connection) {
        ToastAndroid.showWithGravity(
          t("you_are_offline"),
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        )
        return
      }

      if (onlineLoading) return

      setOnlineLoading(true)
      navigate({
        pathname: "ttt",
        params: { mode: flag.split("-")[1], id },
      })
      setOnlineLoading(false)

      return
    }

    if (flag === "stop-join") {
      if (!connection) {
        ToastAndroid.showWithGravity(
          t("you_are_offline"),
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        )
        sheetRef.current?.close()
        return
      }

      setLoading(true)

      if (id.length !== 6) {
        vibrationEnabled && Vibration.vibrate(100)
        setError(t("error_game_invalid_code"))
        setLoading(false)
        sheetRef.current?.close()
        return
      }

      if (id.length === 6) {
        Fire.getGame("stop", id).then((game) => {
          let gameGot: StopModel = game as StopModel

          if (!gameGot) {
            vibrationEnabled && Vibration.vibrate(100)
            setError(t("error_game_not_found"))
            setLoading(false)
            sheetRef.current?.close()
            return
          }

          if (gameGot.players.length >= 4) {
            vibrationEnabled && Vibration.vibrate(100)
            setError(t("error_game_full"))
            setLoading(false)
            sheetRef.current?.close()
            return
          }

          if (gameGot) {
            if (gameGot.gameStatus === GameStatus.IN_PROGRESS) {
              vibrationEnabled && Vibration.vibrate(100)
              setError(t("error_game_started"))
              setLoading(false)
              sheetRef.current?.close()
              return
            }

            setLoading(false)
            setError(null)
            setId("")
            sheetRef.current?.close()

            navigate({
              pathname: "stop",
              params: {
                mode: flag.split("-")[1],
                id: gameGot.gameId,
                time: gameGot.currentTime,
              },
            })
          }
        })
      }
    }

    if (flag === "ttt-join") {
      if (!connection) {
        ToastAndroid.showWithGravity(
          t("you_are_offline"),
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        )
        sheetRef.current?.close()
        return
      }

      setLoading(true)

      if (id.length !== 6) {
        vibrationEnabled && Vibration.vibrate(100)
        setError(t("error_game_invalid_code"))
        setLoading(false)
        sheetRef.current?.close()
        return
      }

      if (id.length === 6) {
        Fire.getGame("ttt", id).then((game) => {
          let gameGot: TTTModel = game as TTTModel

          if (!gameGot) {
            vibrationEnabled && Vibration.vibrate(100)
            setError(t("error_game_not_found"))
            setLoading(false)
            sheetRef.current?.close()
            return
          }

          if (gameGot.players.length >= 4) {
            vibrationEnabled && Vibration.vibrate(100)
            setError(t("error_game_full"))
            setLoading(false)
            sheetRef.current?.close()
            return
          }

          if (gameGot) {
            if (gameGot.gameStatus === GameStatus.IN_PROGRESS) {
              vibrationEnabled && Vibration.vibrate(100)
              setError(t("error_game_started"))
              setLoading(false)
              sheetRef.current?.close()
              return
            }

            setLoading(false)
            setError(null)
            setId("")
            sheetRef.current?.close()

            navigate({
              pathname: "ttt",
              params: {
                mode: flag.split("-")[1],
                id: gameGot.gameId,
              },
            })
          }
        })
      }
    }
  }

  const handleCreateStopGame = (mode: string, id: string, time: number) => {
    vibrationEnabled && Vibration.vibrate(10)

    setLoading(false)
    setError(null)
    setId("")
    setOnlineLoading(false)
    setModalVisible(false)
    navigate({
      pathname: "stop",
      params: { mode, id, time },
    })
  }

  const handleBottomSheet = () => {
    if (!id || id === "") {
      vibrationEnabled && Vibration.vibrate(100)
      ToastAndroid.showWithGravity(
        t("error_game_invalid_code"),
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      )
      return
    }

    sheetRef.current?.expand()
  }

  return (
    <Screen padding={0}>
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false)
          setOnlineLoading(false)
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setModalVisible(false)
            setOnlineLoading(false)
          }}
        >
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <Text
                  style={{
                    color: Theme.colors.accent,
                    fontFamily: Theme.fonts.onestBold,
                    fontSize: Theme.sizes.h3,
                    alignSelf: "center",
                    marginBottom: 16,
                  }}
                >
                  {t("select_time")}
                </Text>

                <View style={{ flexDirection: "row", gap: 8 }}>
                  <Pressable
                    onPress={() => handleCreateStopGame("online", id, 60)}
                    style={({ pressed }) => [
                      { opacity: pressed ? 0.6 : 1 },
                      styles.buttons,
                    ]}
                  >
                    <Text style={styles.texts}>1 min</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => handleCreateStopGame("online", id, 180)}
                    style={({ pressed }) => [
                      { opacity: pressed ? 0.6 : 1 },
                      styles.buttons,
                    ]}
                  >
                    <Text style={styles.texts}>3 mins</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => handleCreateStopGame("online", id, 300)}
                    style={({ pressed }) => [
                      { opacity: pressed ? 0.6 : 1 },
                      styles.buttons,
                    ]}
                  >
                    <Text style={styles.texts}>5 mins</Text>
                  </Pressable>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <ScrollView
        style={{
          flex: 1,
          height: "100%",
          width: "100%",
          paddingHorizontal: 16,
        }}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={() => {
            id === "" && setError(null)
            Keyboard.dismiss()
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 16,
              marginBottom: 26,
              gap: 12,
            }}
          >
            <LottieView
              source={ic}
              autoPlay
              loop={false}
              duration={2000}
              style={{
                width: 24,
                height: 24,
              }}
            />

            <Text
              style={{
                color: Theme.colors.text,
                fontSize: Theme.sizes.h2,
                fontFamily: Theme.fonts.onestBold,
              }}
            >
              {t("online_modes")}
            </Text>

            <LottieView
              source={ic}
              autoPlay
              loop={false}
              duration={2000}
              style={{
                width: 24,
                height: 24,
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <ModesButton
              icon={
                <LottieView
                  source={ic_launcher}
                  autoPlay
                  loop={false}
                  duration={3000}
                  style={{ width: 32, height: 32 }}
                />
              }
              rightIcon={
                onlineLoading ? (
                  <ActivityIndicator
                    color={Theme.colors.accent}
                    style={{ width: 32, height: 32 }}
                  ></ActivityIndicator>
                ) : undefined
              }
              title={`Stop ${t("online")}`}
              subtitle={t("play_stop_online_desc")}
              flag="stop-online"
              image="stopOnline"
              onPress={() => handlePress("stop-online")}
            />
            <ModesButton
              icon={<HashIcon size={32} color={Theme.colors.accent} />}
              rightIcon={
                onlineLoading ? (
                  <ActivityIndicator
                    color={Theme.colors.accent}
                    style={{ width: 32, height: 32 }}
                  ></ActivityIndicator>
                ) : undefined
              }
              title={`Tic Tac Toe ${t("online")}`}
              subtitle={t("play_ttt_online_desc")}
              flag="ttt-online"
              image="tttOnline"
              onPress={() => handlePress("ttt-online")}
            />
            <ModesButton
              icon={<LinkIcon size={32} color={Theme.colors.accent} />}
              rightIcon={
                loading ? (
                  <ActivityIndicator
                    color={Theme.colors.accent}
                    style={{ width: 32, height: 32 }}
                  ></ActivityIndicator>
                ) : undefined
              }
              title={t("join_game")}
              flag="join"
              onPress={handleBottomSheet}
            >
              <FocusInput
                editable={!loading}
                value={id}
                capitalize="none"
                onChange={handleCodeChange}
                placeholder="Code"
                type="default"
                returnKeyType="done"
                onSubmitEditing={handleBottomSheet}
              />

              {error && (
                <Text
                  style={{
                    color: Theme.colors.red,
                    fontFamily: Theme.fonts.onest,
                    fontSize: Theme.sizes.h5,
                  }}
                >
                  {error}
                </Text>
              )}
            </ModesButton>
          </View>

          <WhiteSpace />
        </Pressable>
      </ScrollView>

      <BottomSheetModal title={t("join")} ref={sheetRef}>
        <View style={{ marginBottom: 8, gap: 8 }}>
          <Pressable
            onPress={() => handlePress("stop-join")}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.6 : 1,
                backgroundColor: Theme.colors.background2,
                padding: 16,
                borderRadius: 14,
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                gap: 8,
              },
            ]}
          >
            <Text
              style={{
                color: Theme.colors.text,
                fontFamily: Theme.fonts.onest,
                fontSize: Theme.sizes.h5,
              }}
            >
              Stop {t("online")}
            </Text>

            <ForwardIcon size={32} color={Theme.colors.text} />
          </Pressable>

          <Pressable
            onPress={() => handlePress("ttt-join")}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.6 : 1,
                backgroundColor: Theme.colors.background2,
                padding: 16,
                borderRadius: 14,
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                gap: 8,
              },
            ]}
          >
            <Text
              style={{
                color: Theme.colors.text,
                fontFamily: Theme.fonts.onest,
                fontSize: Theme.sizes.h5,
              }}
            >
              Tic Tac Toe {t("online")}
            </Text>

            <ForwardIcon size={32} color={Theme.colors.text} />
          </Pressable>
        </View>
      </BottomSheetModal>
    </Screen>
  )
}

const styles = StyleSheet.create({
  columns: {
    flex: 1,
    flexDirection: "column",
    gap: 18,
  },
  buttons: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignSelf: "flex-start",
    backgroundColor: Theme.colors.primary2,
  },
  texts: {
    color: Theme.colors.lightGray,
    alignSelf: "flex-start",
    fontFamily: Theme.fonts.onestBold,
  },
  modalView: {
    margin: 20,
    backgroundColor: Theme.colors.modal,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalBottomButtons: {
    padding: 12,
    borderRadius: 16,
  },
})
