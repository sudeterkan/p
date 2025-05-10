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
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useLanguage } from "../../contexts/LanguageContext";
import { FontAwesome } from "@expo/vector-icons";

const getFriendlyError = (
  code: string,
  message: string,
  t: (key: string) => string
) => {
  switch (code) {
    case "auth/invalid-email":
      return t("invalidEmail");
    case "auth/user-not-found":
      return t("userNotFound");
    case "auth/wrong-password":
      return t("wrongPassword");
    default:
      return t("loginFailed");
  }
};

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const handleLogin = async () => {
    setErrorText("");
    if (!email || !password) {
      setErrorText(t("fillAllFields"));
      return;
    }
    setLoading(true);
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)");
    } catch (error: any) {
      const code = error.code || "";
      const message = error.message || "";
      setErrorText(getFriendlyError(code, message, t));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center", marginBottom: 24 }}>
        <Text style={{ fontSize: 36, fontWeight: "bold", color: "#fff" }}>
          ParkMate
        </Text>
        <FontAwesome
          name="car"
          size={48}
          color="#007aff"
          style={{ marginVertical: 8 }}
        />
        <Text style={{ fontSize: 15, color: "#007aff", marginTop: 4 }}>
          welcome back!
        </Text>
      </View>

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
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>{t("loginButton")}</Text>
        )}
      </TouchableOpacity>

      <View style={{ alignItems: "center", width: "100%" }}>
        <TouchableOpacity onPress={() => router.push("../forgot-password")}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.registerButtonText}>{t("noAccount")}</Text>
        </TouchableOpacity>
      </View>
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
  loginButton: {
    backgroundColor: "#007aff",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerButton: {
    padding: 15,
  },
  registerButtonText: {
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
  welcome: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007aff",
    marginBottom: 8,
    textAlign: "center",
  },
  forgotText: {
    color: "#007aff",
    fontSize: 16,
    marginTop: 8,
    marginBottom: 4,
    textAlign: "center",
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
