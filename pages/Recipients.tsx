import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Table, Column, Pagination } from '../components/Table';
import { Button } from '../components/Button';
import { Input, Select } from '../components/Input';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';
import { MOCK_RECIPIENTS } from '../constants';
import { Recipient } from '../types';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';

export const Recipients: React.FC = () => {
  const { addToast } = useToast();
  const [data, setData] = useState<Recipient[]>(MOCK_RECIPIENTS);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentRecipient, setCurrentRecipient] = useState<Partial<Recipient>>({});
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(r => 
    r.name.includes(searchTerm) || r.email.includes(searchTerm) || r.group.includes(searchTerm)
  );

  const columns: Column<Recipient>[] = [
    { header: '이름', accessor: 'name' },
    { header: '이메일', accessor: 'email' },
    { header: '그룹', accessor: 'group' },
    { 
      header: '작업', 
      accessor: (item) => (
        <div className="flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); openEdit(item); }} className="text-text-secondary hover:text-primary transition-colors">
            <Edit2 size={16} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); openDelete(item); }} className="text-text-secondary hover:text-danger transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      ) 
    },
  ];

  const openCreate = () => {
    setMode('create');
    setCurrentRecipient({});
    setEditModalOpen(true);
  };

  const openEdit = (recipient: Recipient) => {
    setMode('edit');
    setCurrentRecipient({ ...recipient });
    setEditModalOpen(true);
  };

  const openDelete = (recipient: Recipient) => {
    setCurrentRecipient(recipient);
    setDeleteModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRecipient.name || !currentRecipient.email) return;

    if (mode === 'create') {
      const newId = Math.random().toString(36).substring(7);
      const newRecipient = { ...currentRecipient, id: newId } as Recipient;
      setData([...data, newRecipient]);
      addToast('success', '수신자가 추가되었습니다.');
    } else {
      setData(data.map(r => r.id === currentRecipient.id ? currentRecipient as Recipient : r));
      addToast('success', '수신자 정보가 수정되었습니다.');
    }
    setEditModalOpen(false);
  };

  const handleDelete = () => {
    setData(data.filter(r => r.id !== currentRecipient.id));
    addToast('success', '수신자가 삭제되었습니다.');
    setDeleteModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-end md:items-center bg-bg-surface p-4 rounded-md border border-border-default shadow-sm">
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
            <Input 
              placeholder="이름 또는 이메일 검색" 
              className="pl-9" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select 
            options={[{value: '', label: '전체 그룹'}, {value: '안전관리팀', label: '안전관리팀'}, {value: '현장소장', label: '현장소장'}]} 
            className="w-32"
          />
        </div>
        <Button onClick={openCreate} icon={Plus}>추가</Button>
      </div>

      <Card>
        <Table 
          data={filteredData} 
          columns={columns} 
          keyExtractor={(item) => item.id}
          onRowClick={openEdit}
        />
        <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
      </Card>

      {/* Edit/Create Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        title={mode === 'create' ? '수신자 추가' : '수신자 편집'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditModalOpen(false)}>취소</Button>
            <Button variant="primary" onClick={handleSave}>저장</Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleSave}>
          <Input 
            label="이름" 
            value={currentRecipient.name || ''} 
            onChange={e => setCurrentRecipient({...currentRecipient, name: e.target.value})}
            required
          />
          <Input 
            label="이메일 주소" 
            type="email"
            value={currentRecipient.email || ''} 
            onChange={e => setCurrentRecipient({...currentRecipient, email: e.target.value})}
            required
          />
          <Select 
            label="그룹"
            value={currentRecipient.group || ''}
            onChange={e => setCurrentRecipient({...currentRecipient, group: e.target.value})}
            options={[
              {value: '안전관리팀', label: '안전관리팀'},
              {value: '현장감독팀', label: '현장감독팀'},
              {value: '협력업체', label: '협력업체'},
              {value: '현장소장', label: '현장소장'},
            ]}
          />
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="수신자 삭제 확인"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>취소</Button>
            <Button variant="danger" onClick={handleDelete}>삭제</Button>
          </>
        }
      >
        <div className="flex items-center gap-4 text-text-primary">
          <div className="bg-red-100 p-3 rounded-full text-danger">
            <Trash2 size={24} />
          </div>
          <div>
             <p className="font-bold">정말 삭제하시겠습니까?</p>
             <p className="text-sm text-text-secondary mt-1">삭제 후 복구할 수 없습니다.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};