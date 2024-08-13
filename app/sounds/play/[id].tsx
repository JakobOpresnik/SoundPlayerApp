import {
  Pressable,
  StyleSheet,
  View,
  Text,
  ImageBackground,
} from "react-native";
import sounds_data from "../../../sounds.json";
import { Avatar } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { Audio } from "expo-av";
import { useCallback, useEffect, useState } from "react";
import colors from "../../../constants/colors";
import { findSound } from "../[id]";

export interface SoundItem {
  id: number;
  title: string;
  file: string;
  description: string;
  benefits?: string[];
}

export default function SoundPlayerScreen() {
  const { id } = useLocalSearchParams();

  const [soundInstance, setSoundInstance] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const currentSound: SoundItem | undefined = findSound(sounds_data.items, +id);

  // useCallback to cache function for playing sound between re-renders
  const playSound = useCallback(async () => {
    try {
      if (!soundInstance) {
        setIsLoading(true);
        const filepath = "../../../assets/sounds/sound.mp3"; // dynamic strings don't seem to work because filepath is not known at compile time
        const { sound } = await Audio.Sound.createAsync(require(filepath));
        setSoundInstance(sound);

        await sound.playAsync();
        setIsPlaying(true);
        setIsLoading(false);
      } else {
        if (isPlaying) {
          await soundInstance.pauseAsync();
        } else {
          await soundInstance.playAsync();
        }
        setIsPlaying(!isPlaying);
      }
    } catch (error) {
      console.error(`error handling sound file: ${error}`);
      setIsLoading(false);
    }
  }, [soundInstance, isPlaying, isLoading]);

  // clean-up function for unloading sound file preventing potential memory leaks
  useEffect(() => {
    return () => {
      if (soundInstance) {
        soundInstance.unloadAsync();
      }
    };
  }, [soundInstance]);

  if (!currentSound) {
    return (
      <View style={styles.container}>
        <Text style={styles.error_text}>Sound not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.header}>
      <Text style={styles.title}>Sounds</Text>
      <View style={styles.container}>
        <ImageBackground
          style={styles.image}
          source={require("../../../assets/images/background.png")}
        />
        <Pressable style={styles.play_button} onPress={playSound}>
          <Avatar.Icon
            size={60}
            style={styles.play_icon}
            color={colors.white}
            icon={
              isLoading
                ? "loading"
                : isPlaying
                ? "pause-circle-outline"
                : "play-circle-outline"
            }
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginTop: 50,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    width: "100%",
    marginTop: "50%",
    gap: 100,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  play_button: {
    flex: 1,
    alignItems: "center",
  },
  play_icon: {
    backgroundColor: colors.primary,
  },
  error_text: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 50,
  },
});
