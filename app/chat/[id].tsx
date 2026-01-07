import { useEffect, useRef } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useChatStore } from '@/store/chatStore';
import { getAllCharacters } from '@/services/characters';
import { getChat, saveChat } from '@/services/chats';
import { sendStreamingChatCompletion } from '@/services/chat-completion';
import type { ChatCompletionMessage, ChatMessage } from '@/services/types';

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const characterId = params.id as string;
  const scrollViewRef = useRef<ScrollView>(null);
  
  const {
    currentCharacter,
    messages,
    isLoading,
    isGenerating,
    error,
    setCurrentCharacter,
    setMessages,
    addMessage,
    updateLastMessage,
    setIsLoading,
    setIsGenerating,
    setError,
  } = useChatStore();

  // 캐릭터 정보 로드
  useEffect(() => {
    const loadCharacter = async () => {
      try {
        setIsLoading(true);
        const characters = await getAllCharacters();
        const character = characters.find((c) => c.avatar === characterId);
        
        if (!character) {
          setError('캐릭터를 찾을 수 없습니다.');
          return;
        }
        
        setCurrentCharacter(character);
        
        // 채팅 불러오기
        if (character.chat) {
          const chatMessages = await getChat(character.name, character.chat);
          setMessages(chatMessages);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (characterId) {
      loadCharacter();
    }
  }, [characterId]);

  // 메시지 전송
  const handleSend = async (text: string) => {
    if (!currentCharacter) return;

    // 사용자 메시지 추가
    const userMessage: ChatMessage = {
      mes: text,
      is_user: true,
      name: 'User',
    };
    addMessage(userMessage);

    // AI 응답 생성
    setIsGenerating(true);
    setError(null);

    try {
      // 메시지 히스토리를 ChatCompletion 형식으로 변환
      const chatHistory: ChatCompletionMessage[] = [
        ...messages.map((msg) => ({
          role: msg.is_user ? 'user' : 'assistant',
          content: msg.mes,
          name: msg.name,
        })),
        {
          role: 'user',
          content: text,
        },
      ];

      // AI 메시지 초기화
      const aiMessage: ChatMessage = {
        mes: '',
        is_user: false,
        name: currentCharacter.name,
      };
      addMessage(aiMessage);

      // 스트리밍 요청
      await sendStreamingChatCompletion(
        {
          messages: chatHistory,
          stream: true,
        },
        (chunk) => {
          // 실시간으로 마지막 메시지 업데이트
          updateLastMessage((msg) => ({
            ...msg,
            mes: chunk.text,
            extra: {
              ...msg.extra,
              reasoning: chunk.reasoning,
            },
          }));
        }
      );

      // 채팅 저장
      if (currentCharacter.chat) {
        await saveChat({
          ch_name: currentCharacter.name,
          file_name: currentCharacter.chat,
          chat: [...messages, userMessage, aiMessage],
          avatar_url: currentCharacter.avatar,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '메시지 전송 실패');
      // 에러 발생 시 마지막 메시지 제거
      setMessages(messages);
    } finally {
      setIsGenerating(false);
    }
  };

  // 스크롤을 맨 아래로
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  if (isLoading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>로딩 중...</ThemedText>
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

  if (!currentCharacter) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText>캐릭터를 찾을 수 없습니다.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>
          {currentCharacter.name}
        </ThemedText>
      </ThemedView>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        {isGenerating && (
          <ThemedView style={styles.generatingContainer}>
            <ActivityIndicator size="small" />
            <ThemedText style={styles.generatingText}>생성 중...</ThemedText>
          </ThemedView>
        )}
      </ScrollView>

      <ChatInput
        onSend={handleSend}
        disabled={isLoading}
        isGenerating={isGenerating}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 8,
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
  generatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
  },
  generatingText: {
    marginLeft: 8,
    fontSize: 14,
    opacity: 0.7,
  },
});

