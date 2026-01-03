import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input, Select } from '../components/Input';
import { useToast } from '../components/Toast';
import { Mail, Eye } from 'lucide-react';
import { Modal } from '../components/Modal';

export const Settings: React.FC = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'system' | 'email'>('system');
  const [isPreviewOpen, setPreviewOpen] = useState(false);

  const handleSave = () => {
    addToast('success', '설정이 저장되었습니다.');
  };

  const EmailPreviewModal = () => (
    <Modal
      isOpen={isPreviewOpen}
      onClose={() => setPreviewOpen(false)}
      title="이메일 알림 템플릿 미리보기"
      size="lg"
      footer={<Button variant="secondary" onClick={() => setPreviewOpen(false)}>닫기</Button>}
    >
      <div className="border border-gray-200 rounded-lg p-8 bg-white shadow-sm mx-auto max-w-2xl">
        {/* Email Header */}
        <div className="border-b border-gray-200 pb-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-700 rounded flex items-center justify-center text-white font-bold">KS</div>
            <span className="font-bold text-lg text-gray-800">KOSHA Siren AI Alert</span>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mt-4">[긴급] 추락 사고 예방 알림</h2>
          <p className="text-gray-500 text-sm mt-1">2023년 10월 27일 발송</p>
        </div>

        {/* Email Body */}
        <div className="space-y-6 text-gray-700">
          <div className="bg-red-50 p-4 rounded border-l-4 border-red-500">
            <h3 className="font-bold text-red-800 mb-2">⚠️ 긴급 재해 발생 알림</h3>
            <p className="text-sm">귀하의 현장과 유사한 공정에서 중대재해가 발생했습니다. 아래 내용을 확인하고 즉시 안전 점검을 실시해주시기 바랍니다.</p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 border-b pb-1 mb-2">재해 개요</h4>
            <p className="text-sm leading-relaxed">2023.10.27 14:00경 부산 해운대구 소재 오피스텔 신축공사 현장에서 외부 비계 해체 작업 중 벽이음이 조기 철거되어 비계가 붕괴됨.</p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 border-b pb-1 mb-2">법적 근거</h4>
            <div className="text-sm bg-gray-100 p-3 rounded">
              <span className="font-bold text-blue-700">산업안전보건법 제38조</span><br/>
              사업주는 근로자가 추락할 위험이 있는 장소에서 작업하는 경우 안전조치를 하여야 한다.
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 border-b pb-1 mb-2">현장 자율 점검 체크리스트</h4>
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <span>작업 전 비계 벽이음 상태를 확인하였는가?</span>
              </li>
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <span>해체 순서를 준수하며 작업계획서를 작성하였는가?</span>
              </li>
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <span>근로자에게 적절한 보호구를 지급하고 착용시켰는가?</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Email Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
          <p>본 메일은 KOSHA AI Alert 시스템에 의해 자동 발송되었습니다.</p>
          <p>© 2023 Korea Occupational Safety and Health Agency</p>
        </div>
      </div>
    </Modal>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Tabs */}
      <div className="flex border-b border-border-default">
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'system' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
          onClick={() => setActiveTab('system')}
        >
          시스템 설정
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'email' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
          onClick={() => setActiveTab('email')}
        >
          이메일 템플릿 관리
        </button>
      </div>

      {activeTab === 'system' && (
        <>
          <Card title="발송 스케줄러 설정" subtitle="알림 발송 타이밍을 설정합니다.">
            <div className="space-y-4 max-w-lg">
              <Select 
                label="발송 방식" 
                options={[
                  {value: 'onComplete', label: '분석 완료 즉시 발송'},
                  {value: 'scheduled', label: '지정 시간 일괄 발송'}
                ]}
              />
              <Input label="지정 시간 (HH:mm)" placeholder="09:00" />
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="schedulerEnabled" className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" defaultChecked />
                <label htmlFor="schedulerEnabled" className="text-sm text-text-primary">스케줄러 자동 실행 활성화</label>
              </div>
              <div className="pt-4">
                <Button onClick={handleSave}>저장</Button>
              </div>
            </div>
          </Card>

          <Card title="데이터 수집/분석 설정" subtitle="스크래핑 및 AI 분석 옵션을 설정합니다.">
            <div className="space-y-4 max-w-lg">
              <Input label="일일 스크래핑 실행 시간" defaultValue="04:00" />
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="dedup" className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" defaultChecked />
                    <label htmlFor="dedup" className="text-sm text-text-primary">중복 수집 방지 (Hash Check)</label>
                </div>
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="ocr" className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" defaultChecked />
                    <label htmlFor="ocr" className="text-sm text-text-primary">이미지 OCR 텍스트 추출 활성화</label>
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={handleSave}>저장</Button>
              </div>
            </div>
          </Card>
        </>
      )}

      {activeTab === 'email' && (
        <Card title="이메일 템플릿 설정" subtitle="수신자에게 발송될 알림 이메일의 디자인을 설정합니다.">
          <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                   <Input label="발신자 이름" defaultValue="KOSHA AI Alert System" />
                   <Input label="기본 제목 접두어" defaultValue="[긴급 재해 알림]" />
                   <Select 
                    label="템플릿 테마" 
                    options={[
                      {value: 'default', label: '표준 (Standard)'},
                      {value: 'warning', label: '경고 강조 (Red)'},
                      {value: 'minimal', label: '텍스트 위주 (Minimal)'}
                    ]} 
                   />
                </div>
                <div className="bg-gray-50 p-4 rounded border border-border-default flex flex-col items-center justify-center text-center gap-3">
                   <Mail className="w-12 h-12 text-text-secondary opacity-50" />
                   <p className="text-sm text-text-secondary">현재 설정된 테마로 이메일이 발송됩니다.<br/>미리보기를 통해 실제 형태를 확인하세요.</p>
                   <Button variant="secondary" icon={Eye} onClick={() => setPreviewOpen(true)}>템플릿 미리보기</Button>
                </div>
             </div>
             <div className="pt-4 border-t border-border-default">
               <Button onClick={handleSave}>설정 저장</Button>
             </div>
          </div>
        </Card>
      )}

      <EmailPreviewModal />
    </div>
  );
};