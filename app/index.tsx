import { Pressable, StyleSheet, View, Text, FlatList } from "react-native";
import sounds_data from "../sounds.json";
import { Avatar, Card } from "react-native-paper";
import { router } from "expo-router";
import colors from "../constants/colors";
import { useMemo } from "react";

export interface SoundItem {
  id: number;
  title: string;
  file: string; // asset path to file
  description: string;
  benefits?: string[];
}

export default function HomeScreen() {
  // memoization for improved performance in case the list gets long
  const soundItems = useMemo(() => sounds_data.items, []);

  // individual flat list item
  const renderSoundItem = ({ item }: { item: SoundItem }) => (
    <Pressable
      style={styles.pressable}
      onPress={() => router.push(`/sounds/${item.id}`)}
      accessibilityLabel={`Navigate to sound ${item.title}.`}
    >
      <Card.Title
        title={item.title}
        titleStyle={{ fontWeight: "bold" }}
        style={styles.card}
        left={(props) => (
          <Avatar.Image
            {...props}
            size={55}
            source={require("../assets/images/background.png")}
          />
        )}
      />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sounds</Text>
      <FlatList
        data={soundItems}
        style={{ marginTop: 30 }}
        renderItem={renderSoundItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 15,
  },
  title: {
    fontSize: 20,
    marginTop: 50,
    marginBottom: 20,
  },
  pressable: {
    width: "100%",
    marginBottom: 20,
  },
  card: {
    width: "90%",
    fontSize: 20,
    paddingLeft: 25,
    marginLeft: 20,
    marginRight: 20,
    gap: 25,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: colors.border,
    height: 100,
  },
});
