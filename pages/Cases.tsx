import React, { useState, useRef } from 'react';
import { Card } from '../components/Card';
import { Table, Column, Pagination } from '../components/Table';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input, Select } from '../components/Input';
import { MOCK_CASES } from '../constants';
import { DisasterCase } from '../types';
import { Search, Sparkles, AlertCircle, Upload, Image as ImageIcon, Send } from 'lucide-react';
import { analyzeDisasterImage, analyzeDisasterText, AIAnalysisResult } from '../services/aiService';
import { useToast } from '../components/Toast';

export const Cases: React.FC = () => {
  const { addToast } = useToast();
  const [cases, setCases] = useState<DisasterCase[]>(MOCK_CASES);
  const [selectedCase, setSelectedCase] = useState<DisasterCase | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  
  // AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);

  // Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadMimeType, setUploadMimeType] = useState<string>('');

  const columns: Column<DisasterCase>[] = [
    { header: '발생일', accessor: 'date', width: '120px' },
    { header: '지역', accessor: 'location', width: '150px' },
    { header: '재해 유형/제목', accessor: 'title', className: 'font-medium' },
    { 
      header: '분석 상태', 
      accessor: (item) => (
         <span className={`text-xs font-bold px-2 py-1 rounded 
           ${item.analysisStatus === 'completed' ? 'bg-blue-100 text-blue-800' : ''}
           ${item.analysisStatus === 'pending' ? 'bg-gray-100 text-gray-800' : ''}
           ${item.analysisStatus === 'failed' ? 'bg-red-100 text-red-800' : ''}
         `}>
           {item.analysisStatus}
         </span>
      ),
      width: '100px'
    },
  ];

  const handleRowClick = (item: DisasterCase) => {
    setSelectedCase(item);
    setAnalysisResult(null);
    setModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadMimeType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const runVisionAnalysis = async () => {
    if (!previewImage) return;
    setIsAnalyzing(true);
    try {
      const base64Data = previewImage.split(',')[1];
      const { analysis, ocrText } = await analyzeDisasterImage({ imageBase64: base64Data, mimeType: uploadMimeType });
      
      const newCase: DisasterCase = {
        id: `c-new-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        title: analysis.title,
        location: '분석된 현장',
        analysisStatus: 'completed',
        cause: analysis.cause,
        imageUrl: previewImage,
        ocrText
      };

      setCases([newCase, ...cases]);
      setAnalysisResult(analysis);
      setSelectedCase(newCase);
      setUploadModalOpen(false);
      setModalOpen(true);
      addToast('success', '이미지 분석 및 데이터 수집이 완료되었습니다.');
    } catch (error) {
      addToast('error', '이미지 분석 중 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runAIAnalysis = async () => {
    if (!selectedCase || !selectedCase.ocrText) {
      addToast('error', '분석할 데이터가 없습니다.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeDisasterText(selectedCase.ocrText);
      setAnalysisResult(result);
      
      setCases(prev => prev.map(c => c.id === selectedCase.id ? { 
        ...c, 
        analysisStatus: 'completed',
        title: result.title,
        cause: result.cause 
      } : c));
      
      addToast('success', 'AI 정밀 분석이 완료되었습니다.');
    } catch (error) {
      addToast('error', 'AI 분석 중 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendAlert = () => {
    addToast('success', '수신자 그룹에게 안전 알림 이메일 발송이 시작되었습니다.');
    // In a real app, this would add a record to MOCK_HISTORY
  };

  const renderAnalysisContent = () => {
    if (analysisResult) {
      return (
        <div className="space-y-4 animate-fade-in">
           <div className="bg-white p-4 rounded border border-border-default shadow-sm space-y-3">
             <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-secondary" />
                <span className="text-sm font-bold text-primary">AI 분석 보고서</span>
             </div>
             <div className="grid grid-cols-3 gap-2 text-sm">
               <div className="text-text-secondary">개요</div>
               <div className="col-span-2 font-medium">{analysisResult.overview}</div>
               <div className="text-text-secondary">핵심 원인</div>
               <div className="col-span-2 font-medium text-danger">{analysisResult.cause}</div>
             </div>
           </div>

           <div className="space-y-3">
             <div className="p-4 bg-blue-50 border-l-4 border-primary rounded-r">
                <h5 className="font-bold text-primary text-sm mb-1">법적 근거</h5>
                <p className="text-sm">{analysisResult.legalBasis}</p>
             </div>

             <div className="p-4 bg-red-50 border-l-4 border-danger rounded-r">
                <h5 className="font-bold text-danger text-sm mb-1">과태료 및 처벌 조항</h5>
                <p className="text-sm font-medium">{analysisResult.penalty}</p>
             </div>

             <div className="border border-border-default rounded p-4">
                <h5 className="font-bold mb-2">예방 대책 및 체크리스트</h5>
                <p className="text-sm mb-3">{analysisResult.prevention}</p>
                <div className="bg-gray-50 p-3 rounded">
                  <h6 className="text-xs font-bold text-text-secondary mb-2">현장 자율 점검 항목</h6>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {analysisResult.checklist.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
             </div>
           </div>
           
           <div className="flex justify-end gap-2">
             <Button variant="secondary" size="sm" onClick={() => window.print()}>PDF 다운로드</Button>
             <Button variant="primary" size="sm" icon={Send} onClick={handleSendAlert}>
               결과 승인 및 알림 발송
             </Button>
           </div>
        </div>
      );
    }

    if (selectedCase?.analysisStatus === 'completed') {
      return (
        <div className="p-8 text-center text-text-secondary">
          기존 분석 데이터를 불러오고 있습니다...<br/>
          (실제 운영 환경에서는 DB 연동 데이터가 출력됩니다)
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-[300px] border border-dashed border-border-default rounded bg-gray-50">
        <AlertCircle className="w-12 h-12 text-text-secondary mb-4" />
        <p className="text-text-secondary font-medium mb-4">정밀 분석이 수행되지 않았습니다.</p>
        <Button 
          variant="primary" 
          icon={Sparkles} 
          onClick={runAIAnalysis}
          isLoading={isAnalyzing}
        >
          AI 법적 근거/대책 도출
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Filters & Actions */}
      <div className="bg-bg-surface p-4 rounded-md border border-border-default shadow-sm flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
              <Input placeholder="키워드 검색 (예: 추락, 끼임)" className="pl-9" />
          </div>
          <Select options={[{value: '', label: '전체 상태'}, {value: 'completed', label: '완료'}, {value: 'pending', label: '대기'}]} className="w-40" />
        </div>
        <Button variant="secondary" icon={Upload} onClick={() => setUploadModalOpen(true)}>개별 사례 등록 (Vision)</Button>
      </div>

      <Card>
        <Table 
          data={cases} 
          columns={columns} 
          keyExtractor={(item) => item.id}
          onRowClick={handleRowClick}
        />
        <Pagination currentPage={1} totalPages={3} onPageChange={() => {}} />
      </Card>

      {/* Case Details / Analysis Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="재해 사례 분석 및 대응 보고서"
        size="xl"
        footer={<Button variant="secondary" onClick={() => setModalOpen(false)}>닫기</Button>}
      >
        {selectedCase && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <div className="space-y-4">
              <h4 className="font-bold text-lg text-primary mb-2">수집 데이터 (OCR/Image)</h4>
              <div className="border border-border-default rounded bg-gray-100 flex items-center justify-center overflow-hidden h-[300px]">
                {selectedCase.imageUrl 
                  ? <img src={selectedCase.imageUrl} alt="Case" className="object-cover w-full h-full" />
                  : <div className="text-center text-text-secondary"><ImageIcon size={48} className="mx-auto opacity-20" /><p>이미지 없음</p></div>
                }
              </div>
              <div>
                <h5 className="font-bold text-sm mb-1">텍스트 데이터</h5>
                <div className="p-3 bg-gray-50 border border-border-default rounded text-xs text-text-secondary h-[150px] overflow-y-auto leading-relaxed">
                  {selectedCase.ocrText || '수집된 텍스트 정보가 없습니다.'}
                </div>
              </div>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
              <h4 className="font-bold text-lg text-primary mb-2">AI 전문가 분석</h4>
              {renderAnalysisContent()}
            </div>
          </div>
        )}
      </Modal>

      {/* Manual Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="신규 재해 사례 등록 및 Vision 분석"
        footer={
          <>
            <Button variant="secondary" onClick={() => setUploadModalOpen(false)}>취소</Button>
            <Button variant="primary" icon={Sparkles} disabled={!previewImage} isLoading={isAnalyzing} onClick={runVisionAnalysis}>이미지 분석 및 등록</Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">중대재해 사이렌 이미지나 현장 사진을 업로드하세요. AI가 즉시 OCR 텍스트를 추출하고 안전 분석을 시작합니다.</p>
          <div 
            className="border-2 border-dashed border-border-default rounded-lg h-64 flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-blue-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {previewImage ? (
              <img src={previewImage} alt="Preview" className="h-full w-full object-contain p-2" />
            ) : (
              <>
                <Upload className="w-12 h-12 text-text-disabled mb-2" />
                <p className="text-sm font-bold text-text-secondary">파일을 선택하거나 드래그하세요</p>
                <p className="text-xs text-text-disabled mt-1">PNG, JPG, PDF 지원</p>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
