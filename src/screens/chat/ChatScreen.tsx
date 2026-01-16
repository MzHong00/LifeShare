import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, MoreVertical } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { ChatInput } from '@/components/chat/ChatInput';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'partner';
  time: string;
}

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '자기야 오늘 저녁에 뭐 먹을까?',
      sender: 'partner',
      time: '오후 2:30',
    },
    { id: '2', text: '음 글쎄, 파스타 어때?', sender: 'me', time: '오후 2:31' },
    {
      id: '3',
      text: '좋아! 그럼 내가 예약해둘게 ❤️',
      sender: 'partner',
      time: '오후 2:32',
    },
    {
      id: '4',
      text: '오케이! 퇴근하고 만나자',
      sender: 'me',
      time: '오후 2:33',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'me',
      time: new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerAvatar}>
            <Heart size={20} color={COLORS.primary} fill={COLORS.primary} />
          </View>
          <View>
            <Text style={styles.headerName}>내 사랑 ❤️</Text>
            <Text style={styles.headerStatus}>현재 활동 중</Text>
          </View>
        </View>
        <TouchableOpacity>
          <MoreVertical size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => (
            <MessageBubble
              text={item.text}
              sender={item.sender}
              time={item.time}
            />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
        />

        <ChatInput
          value={inputText}
          onChangeText={setInputText}
          onSend={sendMessage}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.layout,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  headerName: {
    ...TYPOGRAPHY.body1,
    fontWeight: '700',
  },
  headerStatus: {
    ...TYPOGRAPHY.caption,
    color: COLORS.success,
  },
  listContent: {
    padding: SPACING.layout,
    paddingBottom: SPACING.xl,
  },
});

export default ChatScreen;
