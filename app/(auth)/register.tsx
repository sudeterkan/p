import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useLanguage } from "../../contexts/LanguageContext";
import { FontAwesome } from "@expo/vector-icons";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setErrorText("");
    if (!email || !password || !confirmPassword) {
      setErrorText(t("fillAllFields"));
      return;
    }

    if (password !== confirmPassword) {
      setErrorText("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)");
    } catch (error: any) {
      const code = error.code || "";
      const message = error.message || "";
      setErrorText(getFriendlyError(code, message, t));
    } finally {
      setLoading(false);
    }
  };

  const getFriendlyError = (
    code: string,
    message: string,
    t: (key: string) => string
  ) => {
    switch (code) {
      case "auth/invalid-email":
        return t("invalidEmail");
      case "auth/email-already-in-use":
        return "This email is already registered. Please login.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      default:
        return "Registration failed. Please try again.";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🅿️ {t("appName")}</Text>
      <Text style={styles.subtitle}>{t("register")}</Text>

      {errorText ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorText}</Text>
        </View>
      ) : null}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={t("email")}
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={{ position: "relative" }}>
          <TextInput
            style={styles.input}
            placeholder={t("password")}
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={{ position: "absolute", right: 16, top: 18 }}
            onPress={() => setShowPassword((v) => !v)}
          >
            <FontAwesome
              name={showPassword ? "eye-slash" : "eye"}
              size={22}
              color="#666"
            />
          </TouchableOpacity>
        </View>
        <View style={{ position: "relative" }}>
          <TextInput
            style={styles.input}
            placeholder={t("confirmPassword")}
            placeholderTextColor="#666"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            style={{ position: "absolute", right: 16, top: 18 }}
            onPress={() => setShowConfirmPassword((v) => !v)}
          >
            <FontAwesome
              name={showConfirmPassword ? "eye-slash" : "eye"}
              size={22}
              color="#666"
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.registerButton, loading && { opacity: 0.7 }]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.registerButtonText}>{t("registerButton")}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.loginButtonText}>{t("haveAccount")}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#000",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 30,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: "#007aff",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginButton: {
    padding: 15,
  },
  loginButtonText: {
    color: "#007aff",
    fontSize: 16,
  },
  errorBox: {
    backgroundColor: "#ff3b30",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    marginBottom: 20,
  },
  errorText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default RegisterScreen;
