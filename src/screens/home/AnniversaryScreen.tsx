import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from 'lucide-react-native';

import {
  APP_COLORS,
  THEME_COLORS,
  SPACING,
  TYPOGRAPHY,
} from '@/constants/theme';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';
import { Card } from '@/components/common/Card';

const AnniversaryScreen = () => {
  // 예시 데이터를 생성합니다 (100일 단위 기념일들)
  // 현재 기준 기념일 데이터 (상태별 관리)
  const anniversaries = [
    { title: '1500일', date: '2026-09-25', status: 'future', dDay: 252 },
    { title: '4주년', date: '2026-08-15', status: 'future', dDay: 198 },
    { title: '1400일', date: '2026-06-17', status: 'future', dDay: 139 },
    { title: '1300일', date: '2026-03-09', status: 'next', dDay: 52 },
    { title: '1200일', date: '2025-11-29', status: 'past' },
    { title: '3주년', date: '2025-08-15', status: 'past' },
    { title: '1000일', date: '2025-05-11', status: 'past' },
    { title: '2주년', date: '2024-08-15', status: 'past' },
    { title: '1주년', date: '2023-08-15', status: 'past' },
  ];

  return (
    <AppSafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>우리의 특별한 날</Text>
          <Text style={styles.subtitle}>함께한 모든 순간이 소중해요</Text>
        </View>

        <View style={styles.list}>
          {anniversaries.map((item, index) => (
            <Card
              key={index}
              style={[
                styles.anniversaryCard,
                item.status === 'next' ? styles.upcomingCard : null,
                item.status === 'past' ? styles.pastCard : null,
              ]}
            >
              <View style={styles.cardLeft}>
                <View
                  style={[
                    styles.iconWrapper,
                    item.status === 'next' && styles.upcomingIcon,
                  ]}
                >
                  <Calendar
                    size={18}
                    color={
                      item.status === 'next'
                        ? APP_COLORS.primary
                        : item.status === 'future'
                        ? APP_COLORS.textPrimary
                        : APP_COLORS.textTertiary
                    }
                  />
                </View>
                <View>
                  <Text
                    style={[
                      styles.anniversaryTitle,
                      item.status === 'next' ? styles.upcomingText : null,
                      item.status === 'past' ? styles.pastText : null,
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.anniversaryDate,
                      item.status === 'past' && styles.pastText,
                    ]}
                  >
                    {item.date}
                  </Text>
                </View>
              </View>
              <View style={styles.cardRight}>
                {item.status !== 'past' && (
                  <Text
                    style={[
                      styles.dDay,
                      item.status === 'next' ? styles.upcomingDDay : null,
                    ]}
                  >
                    D-{item.dDay}
                  </Text>
                )}
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.white,
  },
  scrollContent: {
    padding: SPACING.layout,
  },
  header: {
    marginBottom: SPACING.layout,
  },
  title: {
    ...TYPOGRAPHY.header1,
    marginBottom: SPACING.layout,
  },
  subtitle: {
    ...TYPOGRAPHY.body1,
    color: APP_COLORS.textSecondary,
  },
  list: {
    gap: 12,
  },
  anniversaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: THEME_COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.border,
    elevation: 0,
    shadowOpacity: 0,
  },
  upcomingCard: {
    backgroundColor: APP_COLORS.primaryLight,
    borderRadius: 16,
    borderBottomWidth: 0,
    paddingHorizontal: 14,
    marginVertical: 2,
    elevation: 0,
    shadowOpacity: 0,
  },
  pastCard: {
    opacity: 0.5,
  },
  pastText: {
    color: APP_COLORS.textTertiary,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: APP_COLORS.bgGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upcomingIcon: {
    backgroundColor: APP_COLORS.primaryLight,
  },
  anniversaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  upcomingText: {
    color: APP_COLORS.primary,
  },
  anniversaryDate: {
    fontSize: 12,
    color: APP_COLORS.textTertiary,
    marginTop: 1,
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  dDay: {
    fontSize: 13,
    fontWeight: '700',
    color: APP_COLORS.textTertiary,
  },
  upcomingDDay: {
    color: APP_COLORS.primary,
  },
});

export default AnniversaryScreen;
