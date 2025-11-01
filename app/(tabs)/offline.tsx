import { Theme } from "@/constants/Theme"
import React, { useCallback, useState } from "react"
import {
  View,
  Text,
  Vibration,
  Pressable,
  Keyboard,
  ScrollView,
} from "react-native"
import { HashIcon } from "@/components/ui/Icons"
import { Screen } from "@/components/ui/Screen"
import { useFocusEffect, useRouter } from "expo-router"
import { useStorage } from "@/hooks/useStorage"
import { parseBoolean } from "@/libs/parseBoolean"
import LottieView from "lottie-react-native"
import ic from "@/assets/lotties/ic_gamepad.json"
import ic_launcher from "@/assets/lotties/ic_brand.json"
import { ModesButton } from "@/components/ModesButton"
import { useTranslation } from "react-i18next"
import { WhiteSpace } from "@/components/WhiteSpace"

export default function Offline() {
  const [vibrationEnabled, setVibrationEnabled] = useState(true)

  const { navigate } = useRouter()
  const { getItem } = useStorage()
  const { t } = useTranslation()

  useFocusEffect(
    useCallback(() => {
      const loadSettings = async () => {
        const vibrationValue = await getItem("vibration")
        setVibrationEnabled(parseBoolean(vibrationValue))
      }
      loadSettings()
    }, [])
  )

  const handlePress = (flag: string) => {
    vibrationEnabled && Vibration.vibrate(10)

    if (flag === "stop-offline") {
      navigate({
        pathname: "stop",
        params: { mode: flag.split("-")[1], id: "", time: 300 },
      })
    }

    if (flag === "ttt-offline") {
      navigate({
        pathname: "ttt",
        params: { mode: flag.split("-")[1], id: "" },
      })
    }

    if (flag === "tttt-offline") {
      navigate({
        pathname: "tttt",
        params: { mode: flag.split("-")[1], id: "" },
      })
    }

    if (flag === "ttt-computer") {
      navigate({
        pathname: "ttt",
        params: { mode: flag.split("-")[1], id: "" },
      })
    }
  }

  return (
    <Screen padding={0}>
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
                fontSize: Theme.sizes.h3,
                fontFamily: Theme.fonts.onest,
              }}
            >
              {t("offline_modes")}
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
              title={`Stop ${t("offline")}`}
              flag="stop-offline"
              image="stopOffline"
              onPress={() => handlePress("stop-offline")}
            />

            <ModesButton
              icon={<HashIcon size={32} color={Theme.colors.accent} />}
              title={`Tic Tac Toe ${t("offline")}`}
              flag="ttt-offline"
              image="tttOffline"
              onPress={() => handlePress("ttt-offline")}
            />

            <ModesButton
              icon={<HashIcon size={32} color={Theme.colors.accent} />}
              title={`Tic Tac Tuc Toe ${t("offline")}`}
              flag="tttt-offline"
              image="tttComputer"
              onPress={() => handlePress("tttt-offline")}
              isNew={true}
            />
          </View>

          <WhiteSpace />
        </Pressable>
      </ScrollView>
    </Screen>
  )
}
