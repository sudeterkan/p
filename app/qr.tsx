import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { db, ref, push, get } from "../constants/firebaseConfig";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { Colors } from "../constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

function generatePinCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export default function QrPage() {
  const [lastPin, setLastPin] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const { t } = useLanguage();
  const { theme } = useTheme();
  const colors = Colors[theme];
  const { type } = useLocalSearchParams<{ type?: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState([]);

  const handleEntry = async () => {
    const pin = generatePinCode();
    const now = new Date();
    await push(ref(db, "logs"), {
      type: "GIRIS",
      pin,
      time: now.toISOString(),
    });
    setLastPin(pin);
    setDuration(null);
    setPrice(null);
    Alert.alert(t("pinCode"), pin);
  };

  const handleExit = async () => {
    if (!enteredPin) return;
    const snapshot = await get(ref(db, "logs"));
    if (snapshot.exists()) {
      const logs = snapshot.val();
      const entries = Object.values(logs).filter(
        (log: any) => log.type === "GIRIS" && log.pin === enteredPin
      );
      if (entries.length > 0) {
        const lastEntry = entries[entries.length - 1] as { time: string };
        const entryTime = new Date(lastEntry.time);
        const now = new Date();
        const diffMs = now.getTime() - entryTime.getTime();
        const diffMins = Math.ceil(diffMs / (1000 * 60));
        const totalPrice = diffMins * 10;
        setDuration(diffMins);
        setPrice(totalPrice);
        await push(ref(db, "logs"), {
          type: "CIKIS",
          pin: enteredPin,
          time: now.toISOString(),
          duration: diffMins,
          price: totalPrice,
        });
        setShowModal(false);
        setEnteredPin("");
      } else {
        Alert.alert(t("invalidPin"), t("pinNotFound"));
      }
    }
  };

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const snapshot = await get(ref(db, "logs"));
      if (snapshot.exists()) {
        const data = snapshot.val();
        const arr = Object.values(data);
        setLogs(
          arr.filter(
            (item: any) => item.type === "GIRIS" || item.type === "CIKIS"
          )
        );
      } else {
        setLogs([]);
      }
    } catch (e) {
      setError("Failed to load history");
      console.error("Error fetching logs:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <FontAwesome name="arrow-left" size={24} color={colors.primary} />
      </TouchableOpacity>
      <Text style={[styles.title, { color: colors.text }]}>
        {type === "exit" ? "Exit" : t("pinOperations")}
      </Text>
      <View style={[styles.cardBox, { backgroundColor: colors.card }]}>
        {type === "exit" ? (
          <>
            <Text style={[styles.cardLabel, { color: colors.primary }]}>
              Enter PIN Code
            </Text>
            <TextInput
              placeholder={t("enterPinPlaceholder")}
              keyboardType="number-pad"
              style={[
                styles.input,
                {
                  backgroundColor: colors.background,
                  color: colors.text,
                  fontSize: 32,
                  letterSpacing: 8,
                  textAlign: "center",
                  marginBottom: 8,
                },
              ]}
              value={enteredPin}
              onChangeText={setEnteredPin}
              maxLength={4}
              autoFocus
            />
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: colors.primary,
                  marginBottom: 8,
                  opacity: enteredPin.length === 4 ? 1 : 0.5,
                },
              ]}
              onPress={handleExit}
              disabled={enteredPin.length !== 4}
            >
              <Text style={[styles.buttonText, { color: colors.background }]}>
                Show
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                color: colors.secondary,
                marginBottom: 8,
                fontSize: 16,
                textAlign: "center",
              }}
            ></Text>
            {duration !== null && price !== null && (
              <View
                style={[
                  styles.resultBox,
                  { backgroundColor: colors.background, marginTop: 12 },
                ]}
              >
                <Text style={[styles.resultText, { color: colors.text }]}>
                  {" "}
                  {t("duration")}: {duration} {t("minutes")}{" "}
                </Text>
                <Text style={[styles.resultText, { color: colors.text }]}>
                  {" "}
                  {t("price")}: {price} {t("currency")}{" "}
                </Text>
              </View>
            )}
          </>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleEntry}
            >
              <Text style={[styles.buttonText, { color: colors.background }]}>
                {" "}
                {t("pinCode")} {t("create")}{" "}
              </Text>
            </TouchableOpacity>
            {lastPin && (
              <View
                style={[styles.pinBox, { backgroundColor: colors.background }]}
              >
                <Text style={[styles.pinText, { color: colors.primary }]}>
                  {" "}
                  {t("pinCode")}: {lastPin}{" "}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={() => setShowModal(true)}
            >
              <Text style={[styles.buttonText, { color: colors.background }]}>
                {" "}
                {t("exit")}{" "}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {t("enterPin")}
            </Text>
            <TextInput
              placeholder={t("enterPinPlaceholder")}
              keyboardType="number-pad"
              style={[
                styles.input,
                { backgroundColor: colors.background, color: colors.text },
              ]}
              value={enteredPin}
              onChangeText={setEnteredPin}
              maxLength={4}
            />
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleExit}
            >
              <Text style={[styles.buttonText, { color: colors.background }]}>
                {t("confirm")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={[styles.cancelText, { color: colors.secondary }]}>
                {t("cancel")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginBottom: 18,
    marginTop: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  pinBox: {
    borderRadius: 10,
    padding: 18,
    marginBottom: 18,
    alignItems: "center",
    width: 260,
    maxWidth: "90%",
  },
  pinText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  resultBox: {
    borderRadius: 10,
    padding: 18,
    marginBottom: 18,
    alignItems: "center",
    width: 260,
    maxWidth: "90%",
  },
  resultText: {
    fontSize: 18,
    marginBottom: 5,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    borderRadius: 15,
    padding: 24,
    width: 300,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    marginBottom: 18,
    textAlign: "center",
  },
  cancelText: {
    fontSize: 16,
    marginTop: 10,
  },
  cardBox: {
    borderRadius: 18,
    padding: 28,
    marginBottom: 24,
    alignItems: "center",
    width: 320,
    maxWidth: "95%",
    elevation: 6,
    alignSelf: "center",
  },
  cardLabel: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
});
