import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { Colors } from "../constants/Colors";
import { FontAwesome } from "@expo/vector-icons";

export default function PinScreen() {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const { pin } = useLocalSearchParams<{ pin?: string }>();

  React.useEffect(() => {
    if (!pin) {
      router.replace("/");
    }
  }, [pin]);

  if (!pin) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FontAwesome
        name="key"
        size={64}
        color={colors.primary}
        style={{ marginBottom: 24 }}
      />
      <Text style={[styles.title, { color: colors.primary }]}>PIN Code</Text>
      <View style={[styles.pinBox, { backgroundColor: colors.card }]}>
        <Text style={[styles.pinText, { color: colors.primary }]}>{pin}</Text>
      </View>
      <Text style={[styles.info, { color: colors.secondary }]}>
        Please use this code for exit.
      </Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => router.replace("/")}
      >
        <Text
          style={{ color: colors.background, fontWeight: "bold", fontSize: 16 }}
        >
          Back to Home
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 18,
  },
  pinBox: {
    borderRadius: 12,
    padding: 28,
    marginBottom: 18,
    alignItems: "center",
    width: 220,
    maxWidth: "90%",
    elevation: 4,
  },
  pinText: {
    fontSize: 40,
    fontWeight: "bold",
    letterSpacing: 6,
  },
  info: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: "center",
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: "center",
  },
});
