import React, { useState } from 'react';
import { Card, MetricCard } from '../components/Card';
import { AlertTriangle, Mail, Folder, Activity, ExternalLink, Database, Search } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Table, Column } from '../components/Table';
import { MOCK_HISTORY, MOCK_CASES } from '../constants';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { useToast } from '../components/Toast';

const LINE_DATA = [
  { name: '10/21', value: 2 },
  { name: '10/22', value: 1 },
  { name: '10/23', value: 4 },
  { name: '10/24', value: 3 },
  { name: '10/25', value: 2 },
  { name: '10/26', value: 5 },
  { name: '10/27', value: 3 },
];

const PIE_DATA = [
  { name: '추락', value: 45 },
  { name: '끼임', value: 25 },
  { name: '부딪힘', value: 20 },
  { name: '기타', value: 10 },
];

const COLORS = ['#1565C0', '#FB8C00', '#4CAF50', '#E53935'];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      addToast('success', '중대재해 사이렌 게시판 데이터 동기화가 완료되었습니다. (신규 2건)');
    }, 2000);
  };

  const historyColumns: Column<typeof MOCK_HISTORY[0]>[] = [
    { header: '발송 일시', accessor: 'sentAt' },
    { header: '대상', accessor: 'targetGroup' },
    { header: '제목', accessor: 'subject', className: 'truncate max-w-[200px]' },
    { 
      header: '상태', 
      accessor: (item) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${item.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {item.status === 'success' ? '성공' : '실패'}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="금일 수집 재해" value={3} unit="건" icon={<AlertTriangle size={24} />} />
        <MetricCard label="금일 알림 발송" value={2} unit="회" icon={<Mail size={24} />} />
        <MetricCard label="누적 재해 건수" value={124} unit="건" icon={<Folder size={24} />} />
        <MetricCard label="시스템 상태" value="정상" icon={<Activity size={24} />} />
      </div>

      {/* System Control & Status */}
      <Card title="시스템 연동 현황" className="bg-gradient-to-r from-blue-50 to-white border-blue-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full text-primary"><Search size={20}/></div>
              <div>
                <p className="text-xs text-text-secondary">최근 스크래핑</p>
                <p className="text-sm font-bold">2023-10-27 04:00 (자동)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/10 rounded-full text-secondary"><Database size={20}/></div>
              <div>
                <p className="text-xs text-text-secondary">DB 저장소</p>
                <p className="text-sm font-bold">8.4 GB 사용 중</p>
              </div>
            </div>
          </div>
          <Button variant="primary" icon={Search} onClick={handleManualSync} isLoading={isSyncing}>수동 데이터 동기화</Button>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="최근 30일 재해 발생 추세">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={LINE_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#757575'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#757575'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} 
                />
                <Line type="monotone" dataKey="value" stroke="#1565C0" strokeWidth={3} dot={{ r: 4, fill: '#1565C0' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="재해 원인 분포">
          <div className="h-[280px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card 
          title="최근 수집 사례" 
          actions={
            <button onClick={() => navigate('/cases')} className="text-primary text-xs flex items-center hover:underline">
              전체보기 <ExternalLink size={12} className="ml-1"/>
            </button>
          }
        >
          <div className="flex flex-col gap-2">
            {MOCK_CASES.slice(0, 3).map((item) => (
              <div key={item.id} className="p-3 hover:bg-gray-50 rounded border border-transparent hover:border-gray-200 transition-colors cursor-pointer" onClick={() => navigate('/cases')}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm text-text-primary">{item.title}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.analysisStatus === 'completed' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                    {item.analysisStatus}
                  </span>
                </div>
                <div className="text-xs text-text-secondary">{item.date} • {item.location}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card 
          title="최근 알림 발송 내역"
          actions={
            <button onClick={() => navigate('/send-history')} className="text-primary text-xs flex items-center hover:underline">
              전체보기 <ExternalLink size={12} className="ml-1"/>
            </button>
          }
        >
          <Table 
            data={MOCK_HISTORY.slice(0, 3)} 
            columns={historyColumns} 
            keyExtractor={(item) => item.id}
          />
        </Card>
      </div>
    </div>
  );
};