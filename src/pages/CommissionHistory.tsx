import { useEffect, useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';
import { useTheme } from '../hooks/useTheme';
import { formatCurrency, formatDate } from '../lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { toast } from 'sonner';

// 模拟佣金数据
const commissionHistory = [
  { id: 1, orderSn: 'ORD20250615001', type: '直推佣金', amount: 192, status: '已结算', date: '2025-06-15', settleDate: '2025-06-22' },
  { id: 2, orderSn: 'ORD20250614002', type: '直推佣金', amount: 134.85, status: '已结算', date: '2025-06-14', settleDate: '2025-06-21' },
  { id: 3, orderSn: 'ORD20250613003', type: '直推佣金', amount: 239.85, status: '冻结中', date: '2025-06-13', settleDate: '2025-06-20' },
  { id: 4, orderSn: 'ORD20250612004', type: '团队级差', amount: 104.85, status: '已结算', date: '2025-06-12', settleDate: '2025-06-19' },
  { id: 5, orderSn: 'ORD20250611005', type: '团队级差', amount: 299.85, status: '待结算', date: '2025-06-11', settleDate: '2025-06-18' },
  { id: 6, orderSn: 'ORD20250610006', type: '直推佣金', amount: 159.90, status: '已结算', date: '2025-06-10', settleDate: '2025-06-17' },
  { id: 7, orderSn: 'ORD20250609007', type: '团队级差', amount: 89.90, status: '已结算', date: '2025-06-09', settleDate: '2025-06-16' },
  { id: 8, orderSn: 'ORD20250608008', type: '加权分红', amount: 500.00, status: '已结算', date: '2025-06-08', settleDate: '2025-06-15' },
];

// 月度佣金统计数据
const monthlyCommissionData = [
  { month: '1月', 直推佣金: 3200, 团队级差: 1800, 加权分红: 800 },
  { month: '2月', 直推佣金: 3800, 团队级差: 2200, 加权分红: 1000 },
  { month: '3月', 直推佣金: 4500, 团队级差: 2800, 加权分红: 1200 },
  { month: '4月', 直推佣金: 3900, 团队级差: 2500, 加权分红: 900 },
  { month: '5月', 直推佣金: 4800, 团队级差: 3200, 加权分红: 1500 },
  { month: '6月', 直推佣金: 5600, 团队级差: 3800, 加权分红: 1800 },
];

// 佣金类型统计
const commissionTypeData = [
  { name: '直推佣金', value: 18936.50, color: '#3b82f6' },
  { name: '团队级差', value: 11250.75, color: '#8b5cf6' },
  { name: '加权分红', value: 6800.25, color: '#10b981' },
];

export default function CommissionHistory() {
  const { isAuthenticated, distributorData } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filteredCommissions, setFilteredCommissions] = useState(commissionHistory);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // 如果未登录，导航到首页
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // 过滤佣金数据
  useEffect(() => {
    let filtered = commissionHistory;
    
    // 根据搜索词过滤
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(item => 
        item.orderSn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // 根据状态过滤
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(item => item.status === selectedFilter);
    }
    
    // 根据日期范围过滤
    if (dateRange.start) {
      filtered = filtered.filter(item => new Date(item.date) >= new Date(dateRange.start));
    }
    
    if (dateRange.end) {
      filtered = filtered.filter(item => new Date(item.date) <= new Date(dateRange.end));
    }
    
    setFilteredCommissions(filtered);
  }, [searchTerm, selectedFilter, dateRange]);

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

  // 下载佣金明细
  const handleDownload = () => {
    toast('佣金明细下载成功');
  };

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
            <Link to="/team" className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap">
              <i className="fa-solid fa-users-between-lines mr-2"></i>团队管理
            </Link>
            <Link to="/commission" className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 transition-colors whitespace-nowrap">
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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">佣金明细</h2>
              <p className="text-gray-500 dark:text-gray-400">查看所有佣金收入和结算状态</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索订单号或类型..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                />
                <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
              
              <button 
                onClick={handleDownload}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
              >
                <i className="fa-solid fa-download mr-2"></i>
                <span>导出明细</span>
              </button>
            </div>
          </div>
          
          {/* 佣金统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-1">待结算佣金</p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(534.70)}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <i className="fa-solid fa-clock text-xl"></i>
                </div>
              </div>
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <i className="fa-solid fa-circle-info mr-1"></i>
                <span className="text-sm">预计7天后结算</span>
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
                  <p className="text-gray-500 dark:text-gray-400 mb-1">本月佣金</p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(11200)}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <i className="fa-solid fa-calendar-check text-xl"></i>
                </div>
              </div>
              <div className="flex items-center text-green-600 dark:text-green-400">
                <i className="fa-solid fa-arrow-up mr-1"></i>
                <span className="text-sm font-medium">15.6% 较上月</span>
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
                  <p className="text-gray-500 dark:text-gray-400 mb-1">累计佣金</p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(125680.50)}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400">
                  <i className="fa-solid fa-trophy text-xl"></i>
                </div>
              </div>
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <i className="fa-solid fa-coins mr-1"></i>
                <span className="text-sm">历史总佣金收入</span>
              </div>
            </motion.div>
          </div>
          
          {/* 佣金分析图表 */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
            {/* 佣金类型分布 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm lg:col-span-2"
            >
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">佣金类型分布</h3>
              <div className="space-y-4">
                {commissionTypeData.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(item.value)}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          backgroundColor: item.color,
                          width: `${(item.value / distributorData.totalIncome) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* 月度佣金趋势 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm lg:col-span-3"
            >
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">月度佣金趋势</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyCommissionData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value), '佣金']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="直推佣金" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="团队级差" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="加权分红" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
          
          {/* 佣金明细表格 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex space-x-2 mb-4 md:mb-0">
                  <button 
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedFilter === 'all' ? 
                      'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 
                      'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    } transition-colors`}
                    onClick={() => setSelectedFilter('all')}
                  >
                    全部
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedFilter === '待结算' ? 
                      'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 
                      'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    } transition-colors`}
                    onClick={() => setSelectedFilter('待结算')}
                  >
                    待结算
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedFilter === '冻结中' ? 
                      'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 
                      'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    } transition-colors`}
                    onClick={() => setSelectedFilter('冻结中')}
                  >
                    冻结中
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedFilter === '已结算' ? 
                      'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 
                      'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    } transition-colors`}
                    onClick={() => setSelectedFilter('已结算')}
                  >
                    已结算
                  </button>
                </div>
                
                <div className="flex space-x-3">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
                  />
                  <span className="flex items-center text-gray-500 dark:text-gray-400">至</span>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50">
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">订单号</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">佣金类型</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">金额</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">状态</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">产生日期</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">结算日期</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredCommissions.length > 0 ? (
                    filteredCommissions.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.orderSn}</td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.type}</td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400 font-medium">{formatCurrency(item.amount)}</td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            item.status === '已结算' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                            item.status === '冻结中' ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200' :
                            'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatDate(item.date)}</td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {item.status === '已结算' ? formatDate(item.settleDate) : '待结算'}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm">
                          <button className="text-blue-600 dark:text-blue-400 hover:underline">查看详情</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                            <i className="fa-solid fa-search text-gray-400 text-2xl"></i>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">未找到佣金记录</h3>
                          <p className="text-gray-500 dark:text-gray-400">请尝试调整筛选条件</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {filteredCommissions.length > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  共 {filteredCommissions.length} 条记录
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 rounded border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                  <button className="px-3 py-1 rounded border border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">1</button>
                  <button className="px-3 py-1 rounded border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">2</button>
                  <button className="px-3 py-1 rounded border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">3</button>
                  <button className="px-3 py-1 rounded border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
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