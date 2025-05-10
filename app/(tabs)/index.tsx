import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { getAuth, signOut } from "firebase/auth";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Colors } from "../../constants/Colors";
import { db, ref, push } from "../../constants/firebaseConfig";

export default function HomeScreen() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const colors = Colors[theme];
  const [lastPin, setLastPin] = React.useState<string | null>(null);
  const [pinLoading, setPinLoading] = React.useState(false);

  function generatePinCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  const handleEntry = async () => {
    setPinLoading(true);
    const pin = generatePinCode();
    const now = new Date();
    await push(ref(db, "logs"), {
      type: "GIRIS",
      pin,
      time: now.toISOString(),
    });
    setPinLoading(false);
    router.push({ pathname: "/pin", params: { pin } });
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      router.replace("/(auth)/login");
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text, textAlign: "center" }]}>
        {t("appName")}
      </Text>
      <Text
        style={[styles.subtitle, { color: colors.text, textAlign: "center" }]}
      >
        {t("welcome")}
      </Text>

      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.card }]}
          onPress={handleEntry}
          disabled={pinLoading}
        >
          <FontAwesome name="sign-in" size={40} color={colors.primary} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>Entry</Text>
          <Text style={[styles.cardDescription, { color: colors.secondary }]}>
            Perform vehicle entry operation with PIN code
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.card }]}
          onPress={() =>
            router.push({ pathname: "/qr", params: { type: "exit" } })
          }
        >
          <FontAwesome name="sign-out" size={40} color={colors.primary} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>Exit</Text>
          <Text style={[styles.cardDescription, { color: colors.secondary }]}>
            Perform vehicle exit operation with PIN code
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 24,
    marginBottom: 30,
    textAlign: "center",
  },
  logoutButton: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 10,
  },
  logoutText: {
    color: "#ff3b30",
    fontSize: 16,
  },
  cardContainer: {
    gap: 20,
  },
  card: {
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  cardDescription: {
    textAlign: "center",
    fontSize: 14,
  },
});
