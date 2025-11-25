import React, { createContext, useState } from 'react';

// 定义分销员数据类型
export interface DistributorData {
  id: number;
  name: string;
  avatar: string;
  level: string;
  levelId: number;
  totalIncome: number;
  frozenBalance: number;
  walletBalance: number;
  inviteCode: string;
  teamSize: number;
  parentId: number;
  relationChain: string;
  riskStatus: number;
}

// 定义认证上下文类型
interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  logout: () => void;
  distributorData: DistributorData | null;
  setDistributorData: (data: DistributorData | null) => void;
}

// 创建认证上下文
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  logout: () => {},
  distributorData: null,
  setDistributorData: () => {},
});

// 创建认证上下文提供者组件
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [distributorData, setDistributorData] = useState<DistributorData | null>(null);

  const logout = () => {
    setIsAuthenticated(false);
    setDistributorData(null);
    localStorage.removeItem('auth');
  };

  return React.createElement(
    AuthContext.Provider,
    {
      value: {
        isAuthenticated,
        setIsAuthenticated,
        logout,
        distributorData,
        setDistributorData,
      },
    },
    children
  );
}