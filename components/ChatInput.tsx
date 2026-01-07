import { useState } from 'react';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  isGenerating?: boolean;
}

export const ChatInput = ({ onSend, disabled, isGenerating }: ChatInputProps) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() && !disabled && !isGenerating) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="메시지를 입력하세요..."
        placeholderTextColor="#999"
        multiline
        maxLength={2000}
        editable={!disabled && !isGenerating}
        onSubmitEditing={handleSend}
      />
      <TouchableOpacity
        style={[styles.sendButton, (disabled || isGenerating || !text.trim()) && styles.sendButtonDisabled]}
        onPress={handleSend}
        disabled={disabled || isGenerating || !text.trim()}
      >
        {isGenerating ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <ThemedText style={styles.sendButtonText}>전송</ThemedText>
        )}
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    fontSize: 16,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  sendButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

