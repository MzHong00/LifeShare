import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Image as ImageIcon, Video } from 'lucide-react-native';

import type { ChatMessage } from '@/types';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import { ProfileAvatar } from '@/components/common/ProfileAvatar';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { formatChatTime } from '@/utils/date';

const ChatScreen = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: '오늘 저녁에 뭐 먹을까?',
      sender: 'partner',
      time: '오후 2:30',
    },
    { id: '2', text: '음 글쎄', sender: 'me', time: '오후 2:31' },
    {
      id: '3',
      text: '해둘게 ',
      sender: 'partner',
      time: '오후 2:32',
    },
    {
      id: '4',
      text: '오케이!',
      sender: 'me',
      time: '오후 2:33',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isActionMenuVisible, setIsActionMenuVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const { currentWorkspace } = useWorkspaceStore();
  const partner = currentWorkspace?.members?.find(m => m.id !== 'user-1') || {
    name: '파트너',
    avatar: undefined,
  };

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'me',
      time: formatChatTime(),
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const toggleActionMenu = () => {
    if (!isActionMenuVisible) {
      Keyboard.dismiss();
    }
    setIsActionMenuVisible(!isActionMenuVisible);
  };

  const actionItems = [
    {
      id: 'gallery',
      label: '갤러리',
      icon: <ImageIcon size={24} color="#3182F6" />,
      bgColor: '#EBF4FF',
    },
    {
      id: 'video',
      label: '동영상',
      icon: <Video size={24} color="#3182F6" />,
      bgColor: '#EBF4FF',
    },
  ];

  return (
    <AppSafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ProfileAvatar
            uri={partner.avatar}
            name={partner.name}
            size={40}
            style={styles.headerAvatar}
          />
          <View>
            <Text style={styles.headerName}>{partner.name}</Text>
            <Text style={styles.headerStatus}>현재 활동 중</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          style={styles.flex}
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => (
            <MessageBubble
              text={item.text}
              sender={item.sender}
              time={item.time}
              avatar={item.sender === 'partner' ? partner.avatar : undefined}
              name={item.sender === 'partner' ? partner.name : undefined}
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
          onChangeText={text => {
            setInputText(text);
            if (isActionMenuVisible) setIsActionMenuVisible(false);
          }}
          onSend={sendMessage}
          onPlusPress={toggleActionMenu}
        />
        {isActionMenuVisible && (
          <View style={styles.actionMenu}>
            {actionItems.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.actionItem}
                activeOpacity={0.7}
              >
                <View
                  style={[styles.actionIcon, { backgroundColor: item.bgColor }]}
                >
                  {item.icon}
                </View>
                <Text style={styles.actionLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </KeyboardAvoidingView>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  actionMenu: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: 24,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    gap: 20,
  },
  actionItem: {
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
});

export default ChatScreen;
