import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useToast } from '../components/Toast';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (email === 'admin@kosha.or.kr' && password === 'admin') {
        localStorage.setItem('isAuthenticated', 'true');
        addToast('success', '로그인 성공');
        navigate('/dashboard');
      } else {
        addToast('error', '이메일 또는 비밀번호를 확인해주세요.');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-bg-page flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-card p-8 border border-border-default">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-lg mx-auto flex items-center justify-center mb-4">
             <span className="text-white font-bold text-2xl">KS</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">관리자 로그인</h1>
          <p className="text-text-secondary mt-2 text-sm">KOSHA Disaster Siren AI Alert</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            label="이메일"
            type="email"
            placeholder="admin@kosha.or.kr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="비밀번호"
            type="password"
            placeholder="••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <Button 
            type="submit" 
            variant="primary" 
            className="w-full"
            isLoading={isLoading}
          >
            로그인
          </Button>

          <div className="text-center">
             <a href="#" className="text-xs text-primary hover:underline">비밀번호를 잊으셨나요?</a>
          </div>
        </form>
      </div>
    </div>
  );
};