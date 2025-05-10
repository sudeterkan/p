import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { db, ref, get } from "../../constants/firebaseConfig";
import { remove } from "firebase/database";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Colors } from "../../constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

export default function PaymentsScreen() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const colors = Colors[theme];
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const snapshot = await get(ref(db, "logs"));
      if (snapshot.exists()) {
        const data = snapshot.val();
        const arr = Object.values(data);
        setPayments(arr.filter((item: any) => item.price));
      } else {
        setPayments([]);
      }
    } catch (e) {
      setError("Failed to load payments");
      console.error("Error fetching payments:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleDeleteAll = () => {
    Alert.alert(
      t("navPayments"),
      "Are you sure you want to delete all payment records?",
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            try {
              await remove(ref(db, "logs"));
              await fetchPayments();
            } catch (e) {
              console.error("Error deleting payments:", e);
              Alert.alert("Error", "Failed to delete payments");
            }
          },
        },
      ]
    );
  };

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
            {t("navPayments")}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setMenuVisible(true)}
          style={styles.menuButton}
        >
          <MaterialIcons name="more-vert" size={28} color={colors.text} />
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 30 }}
        />
      ) : (
        <>
          <FlatList
            data={payments}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.item,
                  {
                    backgroundColor: colors.card,
                    shadowColor: colors.text,
                    shadowOpacity: 0.12,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 4,
                    marginHorizontal: 12,
                    marginBottom: 28,
                    padding: 22,
                  },
                ]}
              >
                <View style={styles.row}>
                  <FontAwesome
                    name="calendar"
                    size={18}
                    color={colors.primary}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={[styles.date, { color: colors.secondary }]}>
                    {item.time ? item.time.substring(0, 10) : ""}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <FontAwesome
                    name="money"
                    size={16}
                    color={colors.primary}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[
                      styles.info,
                      { color: colors.text, fontWeight: "bold" },
                    ]}
                  >
                    {t("price")}: {item.price} {t("currency")}
                  </Text>
                </View>
                {item.pin && (
                  <View style={styles.infoRow}>
                    <FontAwesome
                      name="key"
                      size={16}
                      color={colors.primary}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={[styles.info, { color: colors.text }]}>
                      {t("pin")}: {item.pin}
                    </Text>
                  </View>
                )}
              </View>
            )}
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
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 0,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
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
    borderRadius: 18,
    // padding, marginHorizontal, marginBottom will be set inline
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  date: {
    fontSize: 15,
    fontWeight: "bold",
  },
  info: {
    fontSize: 15,
  },
  empty: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
  },
});
