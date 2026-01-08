import { useEffect, useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { getAllCharacters } from '@/services/characters';
import type { Character } from '@/services/types';

export default function HomeScreen() {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        setIsLoading(true);
        const data = await getAllCharacters();
        setCharacters(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '캐릭터를 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadCharacters();
  }, []);

  const handleCharacterPress = (character: Character) => {
    router.push(`/chat/${character.avatar}`);
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>캐릭터를 불러오는 중...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.subtitleContainer}>
        <ThemedText style={styles.subtitle}>채팅할 캐릭터를 선택하세요</ThemedText>
      </ThemedView>

      {characters.length === 0 ? (
        <ThemedView style={styles.centerContainer}>
          <ThemedText style={styles.emptyText}>캐릭터가 없습니다.</ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={characters}
          keyExtractor={(item) => item.avatar}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.characterCard}
              onPress={() => handleCharacterPress(item)}
            >
              {item.avatar ? (
                <Image
                  source={{ uri: item.avatar }}
                  style={styles.avatar}
                />
              ) : (
                <ThemedView style={styles.avatarPlaceholder}>
                  <ThemedText style={styles.avatarText}>
                    {item.name.charAt(0).toUpperCase()}
                  </ThemedText>
                </ThemedView>
              )}
              <ThemedView style={styles.characterInfo}>
                <ThemedText style={styles.characterName}>{item.name}</ThemedText>
                {item.description && (
                  <ThemedText style={styles.characterDescription} numberOfLines={2}>
                    {item.description}
                  </ThemedText>
                )}
              </ThemedView>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitleContainer: {
    padding: 16,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  listContent: {
    padding: 16,
  },
  characterCard: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    backgroundColor: '#E5E5EA',
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  characterInfo: {
    flex: 1,
  },
  characterName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  characterDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.7,
  },
});

