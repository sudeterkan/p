import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { db, ref, get } from "../../constants/firebaseConfig";
import { remove } from "firebase/database";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Colors } from "../../constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function HistoryScreen() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();
  const { theme } = useTheme();
  const colors = Colors[theme];
  const [menuVisible, setMenuVisible] = useState(false);

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

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleDeleteAll = () => {
    Alert.alert(
      t("historyTitle"),
      "Tüm geçmişi silmek istediğinize emin misiniz?",
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              await remove(ref(db, "logs"));
              await fetchLogs();
            } catch (e) {
              console.error("Error deleting logs:", e);
              Alert.alert("Error", "Failed to delete history");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <ActivityIndicator size="large" color="#00c3ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <Text style={{ color: "#fff" }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <Text
            style={[styles.title, { color: colors.text, textAlign: "center" }]}
          >
            {t("historyTitle")}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setMenuVisible(true)}
          style={styles.menuButton}
        >
          <MaterialIcons name="more-vert" size={28} color={colors.text} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={logs}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item, index }) => {
          let entryTime = item.time;
          let exitTime = null;
          if (item.type === "CIKIS") {
            // Find the last GIRIS with the same PIN before this CIKIS
            const lastEntry = logs
              .slice(0, index)
              .reverse()
              .find((log) => log.type === "GIRIS" && log.pin === item.pin);
            if (lastEntry) entryTime = lastEntry.time;
            exitTime = item.time;
          }
          return (
            <View
              style={[
                styles.item,
                {
                  backgroundColor: colors.card,
                  shadowColor: colors.text,
                  shadowOpacity: 0.08,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 3 },
                  elevation: 3,
                  borderRadius: 20,
                  marginBottom: 16,
                  marginHorizontal: 4,
                  paddingHorizontal: 14,
                  paddingVertical: 16,
                },
              ]}
            >
              <View style={styles.topRow}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesome
                    name={item.type === "GIRIS" ? "sign-in" : "sign-out"}
                    size={18}
                    color={
                      item.type === "GIRIS" ? colors.primary : colors.danger
                    }
                    style={{ marginRight: 8 }}
                  />
                  <Text style={[styles.dateText, { color: colors.text }]}>
                    {entryTime ? entryTime.substring(0, 10) : ""} •{" "}
                    {t("entryTime")}:{" "}
                    {entryTime ? entryTime.substring(11, 16) : "-"}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBox,
                    {
                      backgroundColor:
                        item.type === "GIRIS" &&
                        !logs.some(
                          (log, i) =>
                            i > index &&
                            log.type === "CIKIS" &&
                            log.pin === item.pin
                        )
                          ? theme === "dark"
                            ? "rgba(0, 195, 255, 0.15)"
                            : "rgba(0, 195, 255, 0.1)"
                          : theme === "dark"
                          ? "rgba(255, 59, 48, 0.15)"
                          : "rgba(255, 59, 48, 0.1)",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          item.type === "GIRIS" &&
                          !logs.some(
                            (log, i) =>
                              i > index &&
                              log.type === "CIKIS" &&
                              log.pin === item.pin
                          )
                            ? colors.primary
                            : colors.danger,
                      },
                    ]}
                  >
                    {item.type === "GIRIS" &&
                    !logs.some(
                      (log, i) =>
                        i > index &&
                        log.type === "CIKIS" &&
                        log.pin === item.pin
                    )
                      ? t("statusActive")
                      : t("statusCompleted")}
                  </Text>
                </View>
              </View>

              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <MaterialIcons
                    name={item.type === "GIRIS" ? "login" : "logout"}
                    size={18}
                    color={
                      item.type === "GIRIS" ? colors.primary : colors.danger
                    }
                    style={styles.detailIcon}
                  />
                  <Text style={[styles.detailText, { color: colors.text }]}>
                    {t("type")}: {t(item.type === "GIRIS" ? "entry" : "exit")}
                  </Text>
                </View>
                {/* Display PIN for user reference in case they forget */}
                <View style={styles.detailRow}>
                  <FontAwesome
                    name="key"
                    size={14}
                    color={colors.primary}
                    style={styles.detailIcon}
                  />
                  <Text style={[styles.detailText, { color: colors.text }]}>
                    {t("pin")}: {item.pin}
                  </Text>
                </View>

                {exitTime && (
                  <View style={styles.detailRow}>
                    <FontAwesome
                      name="sign-out"
                      size={14}
                      color={colors.danger}
                      style={styles.detailIcon}
                    />
                    <Text style={[styles.detailText, { color: colors.text }]}>
                      {t("exitTime")}: {exitTime.substring(11, 16)}
                    </Text>
                  </View>
                )}

                {item.duration && (
                  <View style={styles.detailRow}>
                    <FontAwesome
                      name="clock-o"
                      size={14}
                      color={colors.primary}
                      style={styles.detailIcon}
                    />
                    <Text style={[styles.detailText, { color: colors.text }]}>
                      {t("duration")}: {item.duration} {t("minutes")}
                    </Text>
                  </View>
                )}

                {item.price && (
                  <View style={styles.priceRow}>
                    <Text
                      style={[
                        styles.priceText,
                        {
                          color: theme === "dark" ? "#00ffb3" : "#009966",
                        },
                      ]}
                    >
                      {item.price} {t("currency")}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        }}
        contentContainerStyle={{ paddingBottom: 60 }}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.secondary }]}>
            {t("noRecords")}
          </Text>
        }
      />
      {/* Delete All Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={[styles.menuBox, { backgroundColor: colors.card }]}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                handleDeleteAll();
              }}
            >
              <FontAwesome
                name="trash"
                size={16}
                color={colors.danger}
                style={{ marginRight: 8 }}
              />
              <Text style={{ color: colors.danger, fontWeight: "bold" }}>
                Delete All
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  menuButton: {
    padding: 4,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  menuBox: {
    marginTop: 60,
    marginRight: 18,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    elevation: 8,
    minWidth: 140,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  item: {
    // Styles are defined inline
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "500",
  },
  statusBox: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusText: {
    fontWeight: "600",
    fontSize: 11,
  },
  detailsContainer: {
    marginTop: 4,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  detailIcon: {
    marginRight: 8,
    width: 16,
    textAlign: "center",
  },
  detailText: {
    fontSize: 14,
  },
  priceRow: {
    marginTop: 8,
    alignItems: "flex-end",
  },
  priceText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  empty: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
  },
});
