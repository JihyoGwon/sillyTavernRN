import { useEffect, useRef, useLayoutEffect } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useChatStore } from '@/store/chatStore';
import { getAllCharacters } from '@/services/characters';
import { getChat, saveChat } from '@/services/chats';
import { sendStreamingChatCompletion } from '@/services/chat-completion';
import type { ChatCompletionMessage, ChatMessage as ChatMessageType } from '@/services/types';

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const characterId = params.id as string;
  const flashListRef = useRef<FlashList<ChatMessageType>>(null);
  
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

  // 헤더 제목을 동적으로 설정
  useLayoutEffect(() => {
    if (currentCharacter) {
      navigation.setOptions({
        title: currentCharacter.name,
      });
    }
  }, [currentCharacter, navigation]);

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
        
        // 채팅 불러오기 (하이브리드: 로컬 캐시 먼저, 서버에서 최신 확인)
        if (character.chat) {
          try {
            // getChat 함수가 내부적으로 로컬 캐시를 먼저 확인하고 서버에서 업데이트함
            const chatMessages = await getChat(character.name, character.chat);
            // 배열인지 확인하고, 아니면 빈 배열로 설정
            setMessages(Array.isArray(chatMessages) ? chatMessages : []);
          } catch (chatErr) {
            // 채팅 불러오기 실패 시 빈 배열로 시작
            // (getChat 함수가 이미 로컬 캐시를 시도했을 것)
            console.warn('채팅 불러오기 실패:', chatErr);
            setMessages([]);
          }
        } else {
          // 채팅이 없으면 빈 배열로 시작
          setMessages([]);
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
    const userMessage: ChatMessageType = {
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
      const currentMessages = Array.isArray(messages) ? messages : [];
      const chatHistory: ChatCompletionMessage[] = [
        ...currentMessages.map((msg) => ({
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
      const aiMessage: ChatMessageType = {
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

      // 채팅 저장 (하이브리드: 서버 저장 후 로컬 캐시에도 저장)
      if (currentCharacter.chat) {
        const currentMessages = Array.isArray(messages) ? messages : [];
        // saveChat 함수가 내부적으로 서버 저장 후 로컬 캐시에도 저장함
        await saveChat({
          ch_name: currentCharacter.name,
          file_name: currentCharacter.chat,
          chat: [...currentMessages, userMessage, aiMessage],
          avatar_url: currentCharacter.avatar,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '메시지 전송 실패');
      // 에러 발생 시 마지막 메시지 제거
      const currentMessages = Array.isArray(messages) ? messages : [];
      setMessages(currentMessages);
    } finally {
      setIsGenerating(false);
    }
  };

  // 스크롤을 맨 아래로 (새 메시지가 추가되면)
  useEffect(() => {
    if (flashListRef.current && Array.isArray(messages) && messages.length > 0) {
      setTimeout(() => {
        try {
          flashListRef.current?.scrollToIndex({
            index: messages.length - 1,
            animated: true,
          });
        } catch {
          // 인덱스가 범위를 벗어나면 맨 끝으로 스크롤
          flashListRef.current?.scrollToEnd({ animated: true });
        }
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

  const currentMessages = Array.isArray(messages) ? messages : [];
  
  // FlashList용 데이터 (생성 중 표시를 위해 임시 메시지 추가)
  const listData = isGenerating 
    ? [...currentMessages, { mes: '', is_user: false, name: 'generating' } as ChatMessageType]
    : currentMessages;

  return (
    <ThemedView style={styles.container}>
      <FlashList<ChatMessageType>
        ref={flashListRef}
        data={listData}
        keyExtractor={(item, index) => {
          // 생성 중 표시는 특별한 키 사용
          if (item.name === 'generating') return 'generating';
          // 메시지 고유 키 생성 (mes + index 조합)
          return `${item.mes}-${index}-${item.is_user ? 'user' : 'ai'}`;
        }}
        renderItem={({ item, index }) => {
          // 생성 중 표시
          if (item.name === 'generating') {
            return (
              <ThemedView style={styles.generatingContainer}>
                <ActivityIndicator size="small" />
                <ThemedText style={styles.generatingText}>생성 중...</ThemedText>
              </ThemedView>
            );
          }
          return <ChatMessage message={item} />;
        }}
        estimatedItemSize={80}
        contentContainerStyle={styles.messagesContent}
        ListEmptyComponent={
          <ThemedView style={styles.emptyMessagesContainer}>
            <ThemedText style={styles.emptyMessagesText}>
              아직 메시지가 없습니다. 대화를 시작해보세요!
            </ThemedText>
          </ThemedView>
        }
        onContentSizeChange={() => {
          // 내용 크기 변경 시 맨 아래로 스크롤 (스트리밍 중일 때)
          if (flashListRef.current && currentMessages.length > 0 && isGenerating) {
            setTimeout(() => {
              try {
                flashListRef.current?.scrollToIndex({
                  index: currentMessages.length - 1,
                  animated: false,
                });
              } catch {
                flashListRef.current?.scrollToEnd({ animated: false });
              }
            }, 50);
          }
        }}
      />

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
  emptyMessagesContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyMessagesText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
});

