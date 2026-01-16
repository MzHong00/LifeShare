import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Heart } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY } from '@/constants/theme';

interface MessageBubbleProps {
  text: string;
  sender: 'me' | 'partner';
  time: string;
}

export const MessageBubble = ({ text, sender, time }: MessageBubbleProps) => {
  const isMe = sender === 'me';

  return (
    <View
      style={[
        styles.messageRow,
        isMe ? styles.myMessageRow : styles.partnerMessageRow,
      ]}
    >
      {!isMe && (
        <View style={styles.partnerAvatar}>
          <Heart size={16} color={COLORS.primary} fill={COLORS.primary} />
        </View>
      )}
      <View
        style={[styles.bubble, isMe ? styles.myBubble : styles.partnerBubble]}
      >
        <Text
          style={[
            styles.messageText,
            isMe ? styles.myMessageText : styles.partnerMessageText,
          ]}
        >
          {text}
        </Text>
      </View>
      <Text style={styles.timeText}>{time}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
    maxWidth: '80%',
  },
  myMessageRow: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  partnerMessageRow: {
    alignSelf: 'flex-start',
  },
  partnerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  myBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  partnerBubble: {
    backgroundColor: COLORS.skeleton,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    ...TYPOGRAPHY.body2,
    lineHeight: 20,
  },
  myMessageText: {
    color: COLORS.white,
  },
  partnerMessageText: {
    color: COLORS.textPrimary,
  },
  timeText: {
    fontSize: 10,
    color: COLORS.textTertiary,
    marginHorizontal: 8,
    marginBottom: 4,
  },
});
