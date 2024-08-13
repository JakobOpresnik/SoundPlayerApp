import { StyleSheet, View, Text } from "react-native";
import sounds_data from "../../sounds.json";
import { Avatar, Button, Title } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import colors from "../../constants/colors";

export interface SoundItem {
  id: number;
  title: string;
  file: string;
  description: string;
  benefits?: string[];
}

/**
 * function to retrieve item from list of items by id
 * @param sounds list of items
 * @param id id of the item being retrieved
 * @returns retrieved item
 */
export function findSound(
  sounds: SoundItem[],
  id: number
): SoundItem | undefined {
  return sounds.find((item: SoundItem) => item.id === id);
}

export default function SoundDetailScreen() {
  const { id } = useLocalSearchParams();

  // retrieve specific sound item
  const sound: SoundItem | undefined = findSound(sounds_data.items, +id);

  // handle missing data
  if (!sound) {
    return (
      <View style={styles.container}>
        <Text style={styles.error_text}>Sound not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.header}>
      <Title style={styles.title}>Title</Title>
      <Avatar.Image
        size={170}
        source={require("../../assets/images/background.png")}
      />
      <View style={styles.container}>
        <Title style={styles.subtitle}>{sound?.title}</Title>
        <Text style={styles.description}>{sound?.description}</Text>
        {sound?.benefits && (
          <Title style={styles.benefits_title}>
            {sound.benefits.length === 1 ? "Benefit:" : "Benefits:"}
          </Title>
        )}
        <View style={styles.benefits_list}>
          {sound?.benefits?.map((benefit: string) => (
            <Text key={benefit}>
              <Avatar.Icon size={10} icon={"checkbox-blank-circle"} /> {benefit}
            </Text>
          ))}
        </View>
      </View>
      <Button
        mode="contained"
        style={styles.button}
        onPress={() => router.push(`/sounds/play/${sound?.id}`)}
        accessibilityLabel={`Play sound ${sound.title}.`}
      >
        <Text style={styles.button_text}>To sound</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    alignItems: "center",
    gap: 30,
  },
  title: {
    fontSize: 20,
    marginTop: 50,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    marginLeft: 50,
  },
  subtitle: {
    fontSize: 30,
    fontWeight: "bold",
  },
  description: {
    marginTop: 30,
    marginLeft: 5,
    marginRight: 60,
    lineHeight: 20,
    color: colors.textPrimary,
    textAlign: "justify",
  },
  benefits_title: {
    marginTop: 30,
    fontSize: 20,
    fontWeight: "bold",
  },
  benefits_list: {
    marginTop: 12,
    marginLeft: 5,
    gap: 6,
  },
  button: {
    width: "40%",
    height: 55,
    marginBottom: 50,
    borderRadius: 30,
    display: "flex",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  button_text: {
    fontSize: 17,
    fontWeight: "medium",
  },
  error_text: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 50,
  },
});
