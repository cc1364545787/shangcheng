import { useEffect, useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext, DistributorData } from '../contexts/authContext';
import { useTheme } from '../hooks/useTheme';
import { formatNumber, formatCurrency } from '../lib/utils';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// 模拟团队数据
const mockTeamData = [
  { id: 1001, name: '张明', level: '银牌合伙人', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=businessman%20avatar%20professional&sign=63931616a3b581f11a8a7a5502eb37a2', teamSize: 68, totalIncome: 125680.50, performance: 85 },
  { id: 1002, name: '李华', level: '铜牌合伙人', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=businesswoman%20avatar%20professional&sign=799b7b211acf49684b0533cbe1962674', teamSize: 25, totalIncome: 45280.75, performance: 72 },
  { id: 1003, name: '王强', level: '铜牌合伙人', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=middle%20aged%20man%20avatar%20professional&sign=bac7eab0bc264895594c533ec9581a22', teamSize: 22, totalIncome: 38560.20, performance: 68 },
  { id: 1004, name: '赵敏', level: '初级合伙人', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=young%20woman%20avatar%20professional&sign=031626642c27ac6d28bfbe99d2761673', teamSize: 15, totalIncome: 25800.30, performance: 55 },
  { id: 1005, name: '陈杰', level: '初级合伙人', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=young%20man%20avatar%20professional&sign=9968f981e4407bca173bbc14c2679720', teamSize: 12, totalIncome: 18950.80, performance: 48 },
  { id: 1006, name: '刘芳', level: '初级合伙人', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=middle%20aged%20woman%20avatar%20professional&sign=a46cf6c53ad486116a0e95014ff3bcf0', teamSize: 8, totalIncome: 15620.45, performance: 42 },
];

// 等级分布数据
const levelDistributionData = [
  { name: '银牌合伙人', value: 1, color: '#3b82f6' },
  { name: '铜牌合伙人', value: 2, color: '#8b5cf6' },
  { name: '初级合伙人', value: 3, color: '#10b981' },
];

// 团队业绩数据
const teamPerformanceData = [
  { name: '1月', 销售额: 120000, 佣金: 18000 },
  { name: '2月', 销售额: 150000, 佣金: 22500 },
  { name: '3月', 销售额: 180000, 佣金: 27000 },
  { name: '4月', 销售额: 160000, 佣金: 24000 },
  { name: '5月', 销售额: 210000, 佣金: 31500 },
  { name: '6月', 销售额: 250000, 佣金: 37500 },
];

// 团队关系树数据
const teamTreeData = {
  id: 1001,
  name: '张明',
  level: '银牌合伙人',children: [
    {
      id: 1002,
      name: '李华',
      level: '铜牌合伙人',
      children: [
        {
          id: 1007,
          name: '赵小明',
          level: '初级合伙人',
          children: []
        },
        {
          id: 1008,
          name: '孙小红',
          level: '初级合伙人',
          children: []
        }
      ]
    },
    {
      id: 1003,
      name: '王强',
      level: '铜牌合伙人',
      children: [
        {
          id: 1009,
          name: '周小刚',
          level: '初级合伙人',
          children: []
        }
      ]
    },
    {
      id: 1004,
      name: '赵敏',
      level: '初级合伙人',
      children: []
    },
    {
      id: 1005,
      name: '陈杰',
      level: '初级合伙人',
      children: []
    },
    {
      id: 1006,
      name: '刘芳',
      level: '初级合伙人',
      children: []
    }
  ]
};

// 团队成员卡片组件
const TeamMemberCard = ({ member }: { member: typeof mockTeamData[0] }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md"
    >
      <div className="flex items-center mb-4">
        <img 
          src={member.avatar} 
          alt={member.name} 
          className="w-12 h-12 rounded-full mr-4 border-2 border-blue-100 dark:border-blue-900"
        />
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white">{member.name}</h4>
          <p className="text-sm text-blue-600 dark:text-blue-400">{member.level}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">团队规模</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{member.teamSize}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">累计收益</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(member.totalIncome)}</p>
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">本月绩效</span>
          <span className="text-xs font-medium text-gray-900 dark:text-white">{member.performance}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
            style={{ width: `${member.performance}%` }}
          ></div>
        </div>
      </div>
    </motion.div>
  );
};

// 团队树节点组件
const TreeNode = ({ node, level = 0 }: { node: any, level?: number }) => {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  
  return (
    <div className="mb-2">
      <div 
        className={`flex items-center p-2 rounded-lg cursor-pointer ${
          level === 0 ? 'bg-blue-50 dark:bg-blue-900/30' : 
          level === 1 ? 'bg-purple-50 dark:bg-purple-900/30' : 
          'bg-gray-50 dark:bg-gray-700/50'
        }`}
        onClick={() => node.children.length > 0 && setIsExpanded(!isExpanded)}
      >
        {node.children.length > 0 && (
          <i className={`fa-solid fa-chevron-down mr-2 text-gray-500 transition-transform ${isExpanded ? 'transform rotate-0' : 'transform rotate-270'}`}></i>
        )}
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-2">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{node.id}</span>
        </div>
        <span className="font-medium text-gray-900 dark:text-white">{node.name}</span>
        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
          node.level.includes('银牌') ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 
          node.level.includes('铜牌') ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400' : 
          'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
        }`}>
          {node.level}
        </span>
      </div>
      
      {isExpanded && node.children.length > 0 && (
        <div className="ml-6 mt-1 border-l-2 border-gray-200 dark:border-gray-700 pl-2">
          {node.children.map((child: any) => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function TeamManagement() {
  const { isAuthenticated, distributorData } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('members');
  const [filteredTeam, setFilteredTeam] = useState(mockTeamData);

  // 如果未登录，导航到首页
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // 搜索功能
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredTeam(mockTeamData);
    } else {
      const filtered = mockTeamData.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.level.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTeam(filtered);
    }
  }, [searchTerm]);

  // 如果数据未加载，显示加载状态
  if (!distributorData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-users text-blue-600 dark:text-blue-400 text-2xl"></i>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              分销合伙人中心
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? 
                <i className="fa-solid fa-moon text-gray-700"></i> : 
                <i className="fa-solid fa-sun text-yellow-400"></i>
              }
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src={distributorData.avatar} 
                  alt={distributorData.name} 
                  className="w-10 h-10 rounded-full border-2 border-blue-100 dark:border-blue-900"
                />
                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${distributorData.riskStatus === 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </div>
              <div className="hidden md:block">
                <p className="font-medium text-gray-900 dark:text-white">{distributorData.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{distributorData.level}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 导航菜单 */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto hide-scrollbar">
            <Link to="/dashboard" className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap">
              <i className="fa-solid fa-home mr-2"></i>首页
            </Link>
            <Link to="/team" className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 transition-colors whitespace-nowrap">
              <i className="fa-solid fa-users-between-lines mr-2"></i>团队管理
            </Link>
            <Link to="/commission" className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap">
              <i className="fa-solid fa-chart-pie mr-2"></i>佣金明细
            </Link>
            <Link to="/withdrawal" className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap">
              <i className="fa-solid fa-wallet mr-2"></i>提现管理
            </Link>
          </div>
        </div>
      </div>

      {/* 主内容 */}
      <main className="container mx-auto px-4 py-8">
        <section className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">团队管理</h2>
              <p className="text-gray-500 dark:text-gray-400">管理和查看您的团队成员及业绩情况</p>
            </div>
            
            <div className="mt-4 md:mt-0 relative">
              <input
                type="text"
                placeholder="搜索团队成员..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
              />
              <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
          
          {/* 团队概览卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-1">团队总人数</p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{distributorData.teamSize}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <i className="fa-solid fa-users text-xl"></i>
                </div>
              </div>
              <div className="flex items-center text-green-600 dark:text-green-400">
                <i className="fa-solid fa-arrow-up mr-1"></i>
                <span className="text-sm font-medium">8.2% 较上月</span>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-1">本月团队业绩</p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(250000)}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400">
                  <i className="fa-solid fa-chart-line text-xl"></i>
                </div>
              </div>
              <div className="flex items-center text-green-600 dark:text-green-400">
                <i className="fa-solid fa-arrow-up mr-1"></i>
                <span className="text-sm font-medium">25.0% 较上月</span>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-1">本月团队佣金</p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(37500)}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <i className="fa-solid fa-hand-holding-dollar text-xl"></i>
                </div>
              </div>
              <div className="flex items-center text-green-600 dark:text-green-400">
                <i className="fa-solid fa-arrow-up mr-1"></i>
                <span className="text-sm font-medium">25.0% 较上月</span>
              </div>
            </motion.div>
          </div>
          
          {/* 团队分析 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* 等级分布 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm"
            >
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">等级分布</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={levelDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {levelDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value}人`, '数量']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                {levelDistributionData.map((level, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full mb-1" style={{ backgroundColor: level.color }}></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{level.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* 团队业绩趋势 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm lg:col-span-2"
            >
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">团队业绩趋势</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={teamPerformanceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="销售额"
                      label={({ name, value }) => `${name}: ${formatNumber(value)}`}
                    >
                      {teamPerformanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 40}, 70%, 60%)`} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value), '销售额']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
          
          {/* 团队管理选项卡 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex">
                <button 
                  className={`px-6 py-4 font-medium ${selectedTab === 'members' ? 
                    'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 
                    'text-gray-500 dark:text-gray-400'
                  } transition-colors`}
                  onClick={() => setSelectedTab('members')}
                >
                  <i className="fa-solid fa-user-group mr-2"></i>团队成员
                </button>
                <button 
                  className={`px-6 py-4 font-medium ${selectedTab === 'tree' ? 
                    'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 
                    'text-gray-500 dark:text-gray-400'
                  } transition-colors`}
                  onClick={() => setSelectedTab('tree')}
                >
                  <i className="fa-solid fa-diagram-tree mr-2"></i>团队关系树
                </button>
                <button 
                  className={`px-6 py-4 font-medium ${selectedTab === 'performance' ? 
                    'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 
                    'text-gray-500 dark:text-gray-400'
                  } transition-colors`}
                  onClick={() => setSelectedTab('performance')}
                >
                  <i className="fa-solid fa-chart-column mr-2"></i>业绩排行
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {selectedTab === 'members' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredTeam.length > 0 ? (
                    filteredTeam.map((member) => (
                      <TeamMemberCard key={member.id} member={member} />
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                        <i className="fa-solid fa-search text-gray-400 text-2xl"></i>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">未找到团队成员</h3>
                      <p className="text-gray-500 dark:text-gray-400">请尝试使用其他关键词搜索</p>
                    </div>
                  )}
                </motion.div>
              )}
              
              {selectedTab === 'tree' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3 text-blue-600 dark:text-blue-400">
                      <i className="fa-solid fa-user-tie text-lg"></i>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">团队关系图谱</h3>
                  </div>
                  <div className="overflow-auto max-h-[500px] pr-4">
                    <TreeNode node={teamTreeData} />
                  </div>
                </motion.div>
              )}
              
              {selectedTab === 'performance' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="overflow-x-auto"
                >
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">排名</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">姓名</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">等级</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">团队规模</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">本月业绩</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">本月佣金</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">累计收益</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {mockTeamData
                        .sort((a, b) => b.performance - a.performance)
                        .map((member, index) => (
                          <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className={`flex items-center justify-center w-7 h-7 rounded-full ${
                                index === 0 ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400' :
                                index === 1 ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400' :
                                index === 2 ? 'bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400' :
                                'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                              }`}>
                                {index + 1}
                              </div>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img 
                                  src={member.avatar} 
                                  alt={member.name} 
                                  className="w-8 h-8 rounded-full mr-3"
                                />
                                <span className="font-medium text-gray-900 dark:text-white">{member.name}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                member.level.includes('银牌') ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 
                                member.level.includes('铜牌') ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400' : 
                                'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                              }`}>
                                {member.level}
                              </span>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{member.teamSize}</td>
                            <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{formatCurrency(member.totalIncome * 0.2)}</td>
                            <td className="py-4 px-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">{formatCurrency(member.totalIncome * 0.03)}</td>
                            <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{formatCurrency(member.totalIncome)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="bg-white dark:bg-gray-900 py-6 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <i className="fa-solid fa-users text-blue-600 dark:text-blue-400"></i>
              <span className="font-medium text-gray-900 dark:text-white">分销合伙人系统</span>
            </div>
            
            <div className="flex space-x-6 mb-4 md:mb-0">
              <Link to="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">帮助中心</Link>
              <Link to="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">规则说明</Link>
              <Link to="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">联系客服</Link>
            </div>
            
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              © 2025 分销合伙人系统. 保留所有权利.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}