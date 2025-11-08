import { Theme } from "@/constants/Theme"
import { KeyboardAvoidingView, Platform } from "react-native"

interface Props {
  children: React.ReactNode
  padding?: number
}

export function Screen({ children, padding }: Props) {
  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{
        flex: 1,
        backgroundColor: Theme.colors.background,
        padding: padding ?? 16,
        width: "100%",
      }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      {children}
    </KeyboardAvoidingView>
  )
}
