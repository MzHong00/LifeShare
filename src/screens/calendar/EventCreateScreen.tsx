import React, {
  useState,
  useEffect,
  useMemo,
  useLayoutEffect,
  useCallback,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { Calendar as CalendarIcon, Trash2 } from 'lucide-react-native';

import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { useCalendarStore } from '@/stores/useCalendarStore';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { useModalStore } from '@/stores/useModalStore';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';

type EventCreateRouteProp = RouteProp<
  { EventCreate: { eventId?: string; initialDate?: string } },
  'EventCreate'
>;

const EVENT_COLORS = [
  '#3182F6', // Blue
  '#F04452', // Red
  '#FF9500', // Orange
  '#34C759', // Green
  '#5856D6', // Purple
  '#FF2D55', // Pink
];

const EventCreateScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<EventCreateRouteProp>();
  const eventId = route.params?.eventId;
  const initialDate = route.params?.initialDate;

  const currentWorkspace = useWorkspaceStore(state => state.currentWorkspace);
  const { events, addEvent, updateEvent, removeEvent } = useCalendarStore();
  const { showAlert, showConfirm } = useModalStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(
    initialDate || new Date().toISOString().split('T')[0],
  );
  const [endDate, setEndDate] = useState(
    initialDate || new Date().toISOString().split('T')[0],
  );
  const [selectedColor, setSelectedColor] = useState(EVENT_COLORS[0]);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  useEffect(() => {
    if (eventId) {
      const event = events.find(e => e.id === eventId);
      if (event) {
        setTitle(event.title);
        setDescription(event.description || '');
        setStartDate(event.startDate);
        setEndDate(event.endDate || event.startDate);
        setSelectedColor(event.color);
      }
    }
  }, [eventId, events]);

  const handleDelete = useCallback(() => {
    showConfirm('일정 삭제', '이 일정을 삭제하시겠습니까?', () => {
      if (eventId) {
        removeEvent(eventId);
        navigation.goBack();
      }
    });
  }, [eventId, removeEvent, navigation, showConfirm]);

  useLayoutEffect(() => {
    if (eventId) {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            onPress={handleDelete}
            style={{ marginRight: SPACING.md }}
          >
            <Trash2 size={24} color={COLORS.error} />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, eventId, handleDelete]);

  const handleDayPress = (day: any) => {
    if (startDate && !endDate) {
      if (day.dateString >= startDate) {
        setEndDate(day.dateString);
      } else {
        setEndDate(startDate);
        setStartDate(day.dateString);
      }
    } else {
      setStartDate(day.dateString);
      setEndDate('');
    }
  };

  const markedDates = useMemo(() => {
    const marks: any = {};
    if (startDate) {
      marks[startDate] = {
        startingDay: true,
        color: COLORS.primary,
        textColor: COLORS.white,
      };
    }
    if (endDate) {
      marks[endDate] = {
        endingDay: true,
        color: COLORS.primary,
        textColor: COLORS.white,
      };

      let curr = new Date(startDate);
      const end = new Date(endDate);
      curr.setDate(curr.getDate() + 1);
      while (curr < end) {
        const iso = curr.toISOString().split('T')[0];
        marks[iso] = {
          color: COLORS.primaryLight,
          textColor: COLORS.primary,
        };
        curr.setDate(curr.getDate() + 1);
      }
    }
    return marks;
  }, [startDate, endDate]);

  const handleSave = () => {
    if (!title.trim()) {
      showAlert('알림', '일정 제목을 입력해주세요.');
      return;
    }

    if (!startDate || !endDate) {
      showAlert('알림', '기간을 선택해주세요.');
      return;
    }

    if (!currentWorkspace) {
      showAlert('알림', '워크스페이스 정보가 없습니다.');
      return;
    }

    const eventData = {
      workspaceId: currentWorkspace.id,
      title: title.trim(),
      description: description.trim(),
      startDate,
      endDate,
      isAllDay: true,
      color: selectedColor,
    };

    if (eventId) {
      updateEvent(eventId, eventData);
      showAlert('알림', '일정이 수정되었습니다.');
    } else {
      addEvent(eventData);
      showAlert('알림', '새로운 일정이 추가되었습니다.');
    }

    navigation.goBack();
  };

  return (
    <AppSafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.section}>
            <Text style={styles.label}>제목</Text>
            <TextInput
              style={styles.input}
              placeholder="일정 제목을 입력하세요"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor={COLORS.textTertiary}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>날짜</Text>
            <TouchableOpacity
              style={styles.dateSelector}
              activeOpacity={0.7}
              onPress={() => setIsCalendarVisible(true)}
            >
              <CalendarIcon
                size={20}
                color={COLORS.primary}
                style={styles.smallIconMargin}
              />
              <Text style={styles.dateSelectorText}>
                {startDate}
                {endDate ? ` ~ ${endDate}` : ' (종료일 선택)'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>색상 선택</Text>
            <View style={styles.colorRow}>
              {EVENT_COLORS.map(color => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorCircleActive,
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>메모 (선택)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="상세 내용을 입력해주세요."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              placeholderTextColor={COLORS.textTertiary}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {eventId ? '저장하기' : '추가하기'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isCalendarVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCalendarVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsCalendarVisible(false)}
        >
          <View style={styles.calendarModalContent}>
            <View style={styles.calendarModalHeader}>
              <Text style={styles.calendarModalTitle}>기간 선택</Text>
              <TouchableOpacity onPress={() => setIsCalendarVisible(false)}>
                <Text style={styles.closeText}>닫기</Text>
              </TouchableOpacity>
            </View>

            <Calendar
              markingType={'period'}
              markedDates={markedDates}
              onDayPress={handleDayPress}
              theme={{
                selectedDayBackgroundColor: COLORS.primary,
                selectedDayTextColor: COLORS.white,
                todayTextColor: COLORS.primary,
                arrowColor: COLORS.primary,
                monthTextColor: COLORS.textPrimary,
                textDayFontWeight: '500',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '700',
              }}
            />

            {startDate && endDate && (
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={() => setIsCalendarVisible(false)}
              >
                <Text style={styles.confirmBtnText}>선택 완료</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: SPACING.layout,
    paddingTop: SPACING.xl,
    paddingBottom: 40,
  },
  section: { marginBottom: 28 },
  label: {
    ...TYPOGRAPHY.body1,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  dateSelectorText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  textArea: { height: 120, paddingTop: 16 },
  smallIconMargin: { marginRight: 8 },
  colorRow: { flexDirection: 'row', gap: 12 },
  colorCircle: { width: 36, height: 36, borderRadius: 18 },
  colorCircleActive: {
    borderWidth: 3,
    borderColor: COLORS.white,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  footer: {
    padding: SPACING.layout,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: { fontSize: 18, fontWeight: '700', color: COLORS.white },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  calendarModalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    width: '100%',
    padding: 16,
    overflow: 'hidden',
  },
  calendarModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  calendarModalTitle: {
    ...TYPOGRAPHY.header2,
    color: COLORS.textPrimary,
  },
  closeText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  confirmBtn: {
    backgroundColor: COLORS.primary,
    marginTop: 16,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default EventCreateScreen;
