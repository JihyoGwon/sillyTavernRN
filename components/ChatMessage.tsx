import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { StyleSheet } from 'react-native';
import type { ChatMessage as ChatMessageType } from '@/services/types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.is_user;
  
  return (
    <ThemedView
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.assistantContainer,
      ]}
    >
      <ThemedText
        style={[
          styles.messageText,
          isUser ? styles.userText : styles.assistantText,
        ]}
      >
        {message.mes}
      </ThemedText>
      {message.extra?.reasoning && (
        <ThemedText style={styles.reasoningText}>
          {message.extra.reasoning}
        </ThemedText>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 12,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  assistantContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  assistantText: {
    color: '#000000',
  },
  reasoningText: {
    fontSize: 12,
    marginTop: 8,
    opacity: 0.7,
    fontStyle: 'italic',
  },
});

