import { AlertHistory, DisasterCase, Recipient } from './types';

export const MOCK_RECIPIENTS: Recipient[] = [
  { id: '1', name: '김철수', email: 'kim@kosha.or.kr', group: '안전관리팀' },
  { id: '2', name: '이영희', email: 'lee@kosha.or.kr', group: '현장감독팀' },
  { id: '3', name: '박민수', email: 'park@kosha.or.kr', group: '안전관리팀' },
  { id: '4', name: '최지우', email: 'choi@partner.co.kr', group: '협력업체' },
  { id: '5', name: '정우성', email: 'jung@construction.com', group: '현장소장' },
];

export const MOCK_HISTORY: AlertHistory[] = [
  { 
    id: '101', 
    sentAt: '2023-10-27 14:30', 
    targetGroup: '안전관리팀(15명)', 
    subject: '[긴급] 추락 사고 예방 알림', 
    status: 'success',
    details: {
      overview: 'A현장 고소작업 중 안전대 미체결로 인한 추락 사고 발생',
      legalBasis: '산업안전보건법 제38조(안전조치)',
      prevention: '고소작업 시 안전대 착용 및 부착설비 설치 철저',
      checklist: ['안전대 착용 여부 확인', '부착설비 상태 점검', '안전방망 설치 확인']
    }
  },
  { 
    id: '102', 
    sentAt: '2023-10-26 09:15', 
    targetGroup: '전체(45명)', 
    subject: '[주의] 동절기 콘크리트 양생 가스 중독', 
    status: 'fail', 
    failReason: 'SMTP Connection Timeout',
    details: {
      overview: '밀폐공간 콘크리트 양생 중 갈탄 사용에 의한 일산화탄소 중독',
      legalBasis: '산업안전보건기준에 관한 규칙 제619조',
      prevention: '밀폐공간 작업 시 환기 설비 가동 및 가스 농도 측정',
      checklist: ['환기팬 작동 여부', '산소 및 유해가스 농도 측정', '호흡용 보호구 착용']
    }
  },
  { 
    id: '103', 
    sentAt: '2023-10-25 11:00', 
    targetGroup: '현장소장(5명)', 
    subject: '이동식 크레인 전도 위험', 
    status: 'success',
    details: {
      overview: '지반 침하로 인한 이동식 크레인 전도',
      legalBasis: '산업안전보건기준에 관한 규칙 제2편 제1장',
      prevention: '작업 전 지반 상태 확인 및 아웃트리거 설치 철저',
      checklist: ['지반 다짐 상태', '아웃트리거 최대 확장', '정격 하중 준수']
    }
  },
];

export const MOCK_CASES: DisasterCase[] = [
  { 
    id: 'c1', 
    date: '2023-10-27', 
    title: '건설현장 비계 붕괴 사고', 
    analysisStatus: 'completed',
    location: '부산시 해운대구',
    cause: '벽이음 설치 미흡',
    imageUrl: 'https://picsum.photos/400/300',
    ocrText: '2023.10.27 14:00경 부산 해운대구 소재 오피스텔 신축공사 현장에서 외부 비계 해체 작업 중 벽이음이 조기 철거되어 비계가 붕괴됨. 이로 인해 작업자 2명이 추락하여 부상을 입음.'
  },
  { 
    id: 'c2', 
    date: '2023-10-26', 
    title: '물류센터 지게차 충돌', 
    analysisStatus: 'pending',
    location: '경기도 이천시',
    cause: '분석 대기 중',
    imageUrl: 'https://picsum.photos/400/301',
    ocrText: '2023.10.26 09:30경 경기도 이천 물류센터 입고장에서 지게차 운전자가 적재물로 인해 전방 시야가 확보되지 않은 상태에서 후진하다가 보행 중인 동료 작업자를 충격함. 신호수 미배치 상태였음.'
  },
  { 
    id: 'c3', 
    date: '2023-10-24', 
    title: '제조공장 컨베이어 끼임', 
    analysisStatus: 'completed',
    location: '울산시 남구',
    cause: '방호장치 해제 후 작업',
    imageUrl: 'https://picsum.photos/400/302',
    ocrText: '피재자가 컨베이어 이물질 제거 중 기동 스위치를 오조작하여 롤러 사이에 협착됨. 당시 방호 덮개가 제거된 상태였으며, 비상정지 장치 위치를 인지하지 못함.'
  },
];