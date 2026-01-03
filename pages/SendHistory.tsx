import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Table, Column, Pagination } from '../components/Table';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';
import { MOCK_HISTORY } from '../constants';
import { AlertHistory } from '../types';
import { RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

export const SendHistory: React.FC = () => {
  const { addToast } = useToast();
  const [selectedItem, setSelectedItem] = useState<AlertHistory | null>(null);
  const [isDetailOpen, setDetailOpen] = useState(false);
  const [isResendOpen, setResendOpen] = useState(false);

  const columns: Column<AlertHistory>[] = [
    { header: '발송 일시', accessor: 'sentAt' },
    { header: '수신자 그룹', accessor: 'targetGroup' },
    { header: '알림 제목', accessor: 'subject', className: 'truncate max-w-[200px]' },
    { 
      header: '상태', 
      accessor: (item) => (
        <div className="flex items-center gap-2">
           {item.status === 'success' 
             ? <CheckCircle size={16} className="text-success" /> 
             : <AlertTriangle size={16} className="text-danger" />}
           <span className={`font-bold text-sm ${item.status === 'success' ? 'text-success' : 'text-danger'}`}>
             {item.status === 'success' ? '성공' : '실패'}
           </span>
        </div>
      )
    },
    {
      header: '작업',
      accessor: (item) => item.status === 'fail' && (
        <Button variant="secondary" size="sm" icon={RefreshCw} onClick={(e) => { e.stopPropagation(); openResend(item); }}>
          재발송
        </Button>
      )
    }
  ];

  const openDetail = (item: AlertHistory) => {
    setSelectedItem(item);
    setDetailOpen(true);
  };

  const openResend = (item: AlertHistory) => {
    setSelectedItem(item);
    setResendOpen(true);
  };

  const handleResend = () => {
    addToast('success', '재발송 요청이 접수되었습니다.');
    setResendOpen(false);
  };

  return (
    <div className="space-y-4">
      <Card title="알림 발송 이력">
        <Table 
          data={MOCK_HISTORY} 
          columns={columns} 
          keyExtractor={(item) => item.id} 
          onRowClick={openDetail}
        />
        <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setDetailOpen(false)}
        title="알림 상세 정보"
        size="lg"
        footer={<Button variant="secondary" onClick={() => setDetailOpen(false)}>닫기</Button>}
      >
        {selectedItem && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-border-default">
              <div>
                <label className="text-xs text-text-secondary">발송 일시</label>
                <div className="font-medium">{selectedItem.sentAt}</div>
              </div>
              <div>
                <label className="text-xs text-text-secondary">수신자 그룹</label>
                <div className="font-medium">{selectedItem.targetGroup}</div>
              </div>
              <div>
                <label className="text-xs text-text-secondary">상태</label>
                <div className={`font-bold ${selectedItem.status === 'success' ? 'text-success' : 'text-danger'}`}>
                  {selectedItem.status.toUpperCase()}
                </div>
              </div>
              {selectedItem.failReason && (
                 <div>
                  <label className="text-xs text-text-secondary">실패 사유</label>
                  <div className="font-medium text-danger">{selectedItem.failReason}</div>
                </div>
              )}
            </div>

            {selectedItem.details && (
              <div className="space-y-4">
                <section>
                  <h4 className="font-bold border-b border-border-default pb-2 mb-2">재해 개요</h4>
                  <p className="text-sm">{selectedItem.details.overview}</p>
                </section>
                <section>
                  <h4 className="font-bold border-b border-border-default pb-2 mb-2">법적 근거</h4>
                  <p className="text-sm bg-blue-50 p-3 rounded text-primary">{selectedItem.details.legalBasis}</p>
                </section>
                <section>
                  <h4 className="font-bold border-b border-border-default pb-2 mb-2">예방 대책</h4>
                  <p className="text-sm">{selectedItem.details.prevention}</p>
                </section>
                <section>
                  <h4 className="font-bold border-b border-border-default pb-2 mb-2">현장 점검 체크리스트</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {selectedItem.details.checklist.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </section>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Resend Confirm Modal */}
      <Modal
        isOpen={isResendOpen}
        onClose={() => setResendOpen(false)}
        title="재발송 확인"
        footer={
          <>
            <Button variant="secondary" onClick={() => setResendOpen(false)}>취소</Button>
            <Button variant="primary" onClick={handleResend}>재발송</Button>
          </>
        }
      >
        <p>이 알림을 다시 발송하시겠습니까?</p>
        <div className="mt-4 p-3 bg-yellow-50 text-sm text-yellow-800 rounded border border-yellow-200">
          주의: 수신자 그룹 전체에게 다시 발송됩니다.
        </div>
      </Modal>
    </div>
  );
};