import { Link, Stack } from "expo-router";
import { StyleSheet, View, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <ThemedView style={styles.container}>
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <FontAwesome
            name="car"
            size={48}
            color="#007aff"
            style={{ marginBottom: 4 }}
          />
          <Text style={{ fontSize: 36, fontWeight: "bold", color: "#fff" }}>
            ParkMate
          </Text>
          <Text style={{ fontSize: 20, color: "#007aff", marginTop: 4 }}>
            Welcome Back!
          </Text>
        </View>
        <ThemedText type="title">This screen doesn't exist.</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">Go to home screen!</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
