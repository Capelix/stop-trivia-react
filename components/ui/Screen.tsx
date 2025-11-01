import { Theme } from "@/constants/Theme"
import { KeyboardAvoidingView, Platform, View } from "react-native"

interface Props {
  children: React.ReactNode
  padding?: number
}

export function Screen({ children, padding }: Props) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: Theme.colors.background,
          padding: padding ?? 16,
          width: "100%",
        }}
      >
        {children}
      </View>
    </KeyboardAvoidingView>
  )
}
