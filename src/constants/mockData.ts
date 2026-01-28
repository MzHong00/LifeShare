export const MOCK_DATA = {
  user: {
    id: 'user-1',
    name: '민수',
    email: 'minsu@example.com',
    profileImage:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop',
  },
  partner: {
    id: 'user-2',
    name: '지민',
    profileImage:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    status: '카페에서 공부 중 📖',
    location: '서울시 강남구 역삼동',
    lastActive: '5분 전',
  },
  workspace: {
    id: 'ws-1',
    name: '민수',
    type: 'couple' as const,
    startDate: '2022-08-15',
    dDay: 1250,
    nextEvent: {
      title: '우리의 1300일',
      date: '2026-03-09',
      remainingDays: 52,
    },
    members: [
      {
        id: 'user-1',
        name: '민수',
        email: 'minsu@example.com',
        avatar:
          'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop',
      },
      {
        id: 'user-2',
        name: '지민',
        email: 'jimin@example.com',
        avatar:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      },
    ],
  },
  extraWorkspaces: [
    {
      id: 'ws-2',
      name: '우리 가족 여행 👨‍👩‍👧‍👦',
      type: 'group' as const,
      members: [
        {
          id: 'user-1',
          name: '민수',
          avatar:
            'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop',
        },
        {
          id: 'user-3',
          name: '아빠',
          avatar:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
        },
        {
          id: 'user-4',
          name: '엄마',
          avatar:
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
        },
        {
          id: 'user-5',
          name: '동생',
          avatar:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
        },
      ],
    },
    {
      id: 'ws-3',
      name: '대학 동기 모임 🎓',
      type: 'group' as const,
      members: [
        {
          id: 'user-1',
          name: '민수',
          avatar:
            'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop',
        },
        {
          id: 'user-6',
          name: '철수',
        },
        {
          id: 'user-7',
          name: '영희',
          avatar:
            'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=200&h=200&fit=crop',
        },
      ],
    },
  ],
  calendar: [
    {
      id: 'ev-1',
      title: '저녁 데이트 🥗',
      date: '2026-01-16T19:00:00',
      type: 'date',
    },
    {
      id: 'ev-2',
      title: '제주도 여행 ✈️',
      date: '2026-01-20T10:00:00',
      type: 'travel',
    },
    {
      id: 'ev-3',
      title: '지민 생일 🎂',
      date: '2026-02-14T00:00:00',
      type: 'birthday',
    },
  ],
  todos: [
    {
      id: 'td-1',
      content: '이번주 장보기 🛒',
      completed: false,
      assignee: '민수',
    },
    {
      id: 'td-2',
      content: '공인중개사 방문 🏠',
      completed: true,
      assignee: '지민',
    },
    {
      id: 'td-3',
      content: '같이 운동하기 🏃‍♂️',
      completed: false,
      assignee: '우리',
    },
  ],
  chats: [
    {
      id: 'msg-1',
      senderId: 'user-2',
      text: '오늘 저녁 뭐 먹을까?',
      time: '오후 4:30',
    },
    {
      id: 'msg-2',
      senderId: 'user-1',
      text: '파스타 어때? 저번에 가보고 싶다던 곳!',
      time: '오후 4:32',
    },
    {
      id: 'msg-3',
      senderId: 'user-2',
      text: '좋아! 7시에 역 앞에서 만나',
      time: '오후 4:35',
    },
  ],
  memories: [
    {
      id: 'mem-1',
      title: '첫 캠핑 ⛺️',
      date: '2025-10-05',
      imageUrl:
        'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400',
    },
    {
      id: 'mem-2',
      title: '한강 산책 🌊',
      date: '2025-11-12',
      imageUrl:
        'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=400',
    },
    {
      id: 'mem-3',
      title: '크리스마스 파티 🎄',
      date: '2025-12-25',
      imageUrl:
        'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=400',
    },
  ],
};
