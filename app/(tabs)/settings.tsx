import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme, ThemeType } from "../../contexts/ThemeContext";
import { Colors } from "../../constants/Colors";
import {
  getAuth,
  signOut,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function SettingsScreen() {
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const colors = Colors[theme];
  const [aboutVisible, setAboutVisible] = useState(false);
  const [changePwVisible, setChangePwVisible] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      router.replace("/(auth)/login");
    });
  };

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleAbout = () => {
    setAboutVisible(true);
  };

  const handleChangePw = () => {
    setCurrentPw("");
    setNewPw("");
    setNewPw2("");
    setPwError("");
    setChangePwVisible(true);
  };

  const doChangePassword = async () => {
    setPwError("");
    if (!currentPw || !newPw || !newPw2) {
      setPwError("Please fill in all fields.");
      return;
    }
    if (newPw !== newPw2) {
      setPwError("New passwords do not match.");
      return;
    }
    if (newPw.length < 6) {
      setPwError("New password must be at least 6 characters.");
      return;
    }
    setPwLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user || !user.email) throw new Error("No user");
      const credential = EmailAuthProvider.credential(user.email, currentPw);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPw);
      setChangePwVisible(false);
      Alert.alert("Success", "Password changed successfully.");
    } catch (e: any) {
      setPwError(e.message || "Password change failed.");
    } finally {
      setPwLoading(false);
    }
  };

  const settingsOptions = [
    {
      key: "theme",
      title: t("theme"),
      icon: "moon-o" as const,
      color: colors.primary,
      onPress: handleThemeToggle,
      right: t(theme === "dark" ? "themeDark" : "themeLight"),
    },
    {
      key: "changePw",
      title: "Change Password",
      icon: "lock" as const,
      color: "#f39c12",
      onPress: handleChangePw,
    },
    {
      key: "logout",
      title: t("logout"),
      icon: "sign-out" as const,
      color: colors.danger,
      onPress: handleLogout,
    },
    {
      key: "about",
      title: "About",
      icon: "info-circle" as const,
      color: "#8e44ad",
      onPress: handleAbout,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        {t("navSettings")}
      </Text>
      <FlatList
        data={settingsOptions}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, { backgroundColor: colors.card }]}
            onPress={item.onPress}
          >
            <FontAwesome
              name={item.icon}
              size={22}
              color={item.color || colors.primary}
              style={styles.icon}
            />
            <Text
              style={[
                styles.itemText,
                { color: colors.text },
                item.color ? { color: item.color } : null,
              ]}
            >
              {item.title}
            </Text>
            {item.right && <Text style={styles.rightText}>{item.right}</Text>}
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
      {/* Change Password Modal */}
      <Modal
        visible={changePwVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setChangePwVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={[styles.aboutBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.aboutTitle, { color: colors.primary }]}>
              Change Password
            </Text>
            <TextInput
              style={[
                styles.input,
                { color: colors.text, backgroundColor: colors.background },
              ]}
              placeholder="Current Password"
              placeholderTextColor={colors.secondary}
              secureTextEntry
              value={currentPw}
              onChangeText={setCurrentPw}
            />
            <TextInput
              style={[
                styles.input,
                { color: colors.text, backgroundColor: colors.background },
              ]}
              placeholder="New Password"
              placeholderTextColor={colors.secondary}
              secureTextEntry
              value={newPw}
              onChangeText={setNewPw}
            />
            <TextInput
              style={[
                styles.input,
                { color: colors.text, backgroundColor: colors.background },
              ]}
              placeholder="Repeat New Password"
              placeholderTextColor={colors.secondary}
              secureTextEntry
              value={newPw2}
              onChangeText={setNewPw2}
            />
            {pwError ? (
              <Text style={{ color: colors.danger, marginBottom: 8 }}>
                {pwError}
              </Text>
            ) : null}
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: colors.primary, marginTop: 8 },
              ]}
              onPress={doChangePassword}
              disabled={pwLoading}
            >
              <Text
                style={{
                  color: colors.background,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                {pwLoading ? "Saving..." : "Change Password"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setChangePwVisible(false)}
              style={styles.closeButton}
            >
              <Text
                style={{
                  color: colors.primary,
                  fontWeight: "bold",
                  fontSize: 16,
                  marginTop: 12,
                }}
              >
                {t("cancel")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* About Modal */}
      <Modal
        visible={aboutVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAboutVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={[styles.aboutBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.aboutTitle, { color: colors.primary }]}>
              About
            </Text>
            <Text style={[styles.aboutText, { color: colors.text }]}>
              ParkMate v1.0.0
            </Text>
            <Text style={[styles.aboutText, { color: colors.text }]}>
              developed by ss.
            </Text>
            <Text style={[styles.aboutText, { color: colors.text }]}>
              Contact: ParkMate@gmail.com
            </Text>
            <TouchableOpacity
              onPress={() => setAboutVisible(false)}
              style={styles.closeButton}
            >
              <Text
                style={{
                  color: colors.primary,
                  fontWeight: "bold",
                  fontSize: 16,
                  marginTop: 12,
                }}
              >
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
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  item: {
    borderRadius: 18,
    marginHorizontal: 12,
    marginBottom: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 16,
  },
  itemText: {
    fontSize: 18,
    fontWeight: "500",
    flex: 1,
  },
  rightText: {
    color: "#bbb",
    fontSize: 16,
    marginLeft: 10,
  },
  aboutBox: {
    borderRadius: 14,
    padding: 22,
    alignItems: "center",
    width: 300,
    maxWidth: "90%",
    elevation: 6,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  aboutText: {
    fontSize: 14,
    marginBottom: 2,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    marginTop: 10,
  },
  input: {
    width: "100%",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
  },
});
