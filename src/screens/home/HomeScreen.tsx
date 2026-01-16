import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Calendar,
  CheckSquare,
  Heart,
  ChevronRight,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { Section } from '@/components/common/Section';
import { Card } from '@/components/common/Card';
import { DDayHero } from '@/components/home/DDayHero';
import { FeatureCard } from '@/components/home/FeatureCard';

type RootStackParamList = {
  MainTabs: undefined;
  Calendar: undefined;
  Todo: undefined;
  Memories: undefined;
};

const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={TYPOGRAPHY.header1}>우리만의 공간,</Text>
            <Text style={TYPOGRAPHY.header1}>LifeShare 👋</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>우리</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* D-Day Section */}
        <DDayHero
          partnerName="지민"
          myName="민수"
          days={1248}
          nextEventTitle="1300일 기념일까지"
          nextDDay={52}
          onPress={() => navigation.navigate('Memories')}
        />

        {/* Partner Status */}
        <Section>
          <Card onPress={() => {}}>
            <View style={styles.partnerHeader}>
              <Text style={TYPOGRAPHY.body1}>사랑하는 파트너</Text>
              <ChevronRight size={20} color={COLORS.textTertiary} />
            </View>
            <View style={styles.partnerStatus}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>현재 내 위치 근처에 있어요</Text>
            </View>
          </Card>
        </Section>

        {/* Main Features */}
        <Section title="함께하는 일상">
          <FeatureCard
            title="공유 캘린더"
            description="우리의 소중한 일정을 관리해보세요"
            icon={<Calendar size={24} color={COLORS.textPrimary} />}
            iconBgColor="#F0F0F0"
            onPress={() => navigation.navigate('Calendar')}
          />
          <FeatureCard
            title="공유 할 일"
            description="오늘 할 일이 3개 남았어요"
            icon={<CheckSquare size={24} color={COLORS.primary} />}
            iconBgColor="#EBF4FF"
            onPress={() => navigation.navigate('Todo')}
          />
          <FeatureCard
            title="우리의 추억"
            description="소중한 순간들을 기록하고 꺼내보세요"
            icon={<Heart size={24} color="#F04452" />}
            iconBgColor="#FFEBF0"
            onPress={() => navigation.navigate('Memories')}
          />
        </Section>

        {/* Banner */}
        <Section>
          <Card style={styles.banner} activeOpacity={0.8}>
            <Text style={styles.bannerText}>
              가족, 친구와도 추억을 나누고 싶나요? ✨
            </Text>
            <Text style={styles.bannerSubText}>내 공간 확장하기 (준비 중)</Text>
          </Card>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.layout,
    paddingVertical: SPACING.xl,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '700',
  },
  partnerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  partnerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
    marginRight: 8,
  },
  statusText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  banner: {
    backgroundColor: '#191F28',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  bannerText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  bannerSubText: {
    color: COLORS.textTertiary,
    fontSize: 12,
  },
});

export default HomeScreen;
