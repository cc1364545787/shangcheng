import { useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';
import { formatCurrency, formatNumber } from '../lib/utils';
import { useTheme } from '../hooks/useTheme';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// 模拟数据
const commissionData = [
  { name: '1月', 直推佣金: 3200, 团队级差: 1800, 加权分红: 800 },
  { name: '2月', 直推佣金: 3800, 团队级差: 2200, 加权分红: 1000 },
  { name: '3月', 直推佣金: 4500, 团队级差: 2800, 加权分红: 1200 },
  { name: '4月', 直推佣金: 3900, 团队级差: 2500, 加权分红: 900 },
  { name: '5月', 直推佣金: 4800, 团队级差: 3200, 加权分红: 1500 },
  { name: '6月', 直推佣金: 5600, 团队级差: 3800, 加权分红: 1800 },
];

const recentOrders = [
  { id: 1, orderSn: 'ORD20250615001', amount: 1280, commission: 192, status: '已结算', date: '2025-06-15' },
  { id: 2, orderSn: 'ORD20250614002', amount: 899, commission: 134.85, status: '已结算', date: '2025-06-14' },
  { id: 3, orderSn: 'ORD20250613003', amount: 1599, commission: 239.85, status: '冻结中', date: '2025-06-13' },
  { id: 4, orderSn: 'ORD20250612004', amount: 699, commission: 104.85, status: '已结算', date: '2025-06-12' },
  { id: 5, orderSn: 'ORD20250611005', amount: 1999, commission: 299.85, status: '待结算', date: '2025-06-11' },
];

// 等级特权数据
const levelPrivileges = [
  { id: 1, name: '金牌合伙人', minTeamSize: 100, commissionRate: 30, bonusRate: 10, features: ['专属客服', '优先提现', '专属培训', '季度分红'] },
  { id: 2, name: '银牌合伙人', minTeamSize: 50, commissionRate: 25, bonusRate: 8, features: ['优先提现', '专属培训'] },
  { id: 3, name: '铜牌合伙人', minTeamSize: 20, commissionRate: 20, bonusRate: 5, features: ['专属培训'] },
  { id: 4, name: '初级合伙人', minTeamSize: 0, commissionRate: 15, bonusRate: 0, features: [] },
];

export default function PartnerDashboard() {
  const { isAuthenticated, setIsAuthenticated, distributorData, setDistributorData } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // 模拟登录
  useEffect(() => {
    if (!isAuthenticated) {
      // 模拟登录成功后的数据
      const mockData = {
        id: 1001,
        name: '张明',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=businessman%20avatar%20professional&sign=63931616a3b581f11a8a7a5502eb37a2',
        level: '银牌合伙人',
        levelId: 2,
        totalIncome: 125680.50,
        frozenBalance: 5890.75,
        walletBalance: 15680.25,
        inviteCode: 'ZM8888',
        teamSize: 68,
        parentId: 1000,
        relationChain: '0/1000/1001',
        riskStatus: 0
      };
      
      setIsAuthenticated(true);
      setDistributorData(mockData);
    }
  }, [isAuthenticated, setIsAuthenticated, setDistributorData]);

  // 如果未登录，导航到首页
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

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

  // 获取当前等级的特权信息
  const currentLevelPrivilege = levelPrivileges.find(level => level.id === distributorData.levelId) || levelPrivileges[0];
  
  // 获取下一级的特权信息
  const nextLevelPrivilege = levelPrivileges.find(level => level.id === distributorData.levelId - 1);
  const progressToNextLevel = nextLevelPrivilege ? Math.min((distributorData.teamSize / nextLevelPrivilege.minTeamSize) * 100, 100) : 0;

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

      {/* 主内容 */}
      <main className="container mx-auto px-4 py-8">
        {/* 收益概览卡片 */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-1">累计收益</p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(distributorData.totalIncome)}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <i className="fa-solid fa-chart-line text-xl"></i>
                </div>
              </div>
              <div className="flex items-center text-green-600 dark:text-green-400">
                <i className="fa-solid fa-arrow-up mr-1"></i>
                <span className="text-sm font-medium">12.5% 较上月</span>
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
                  <p className="text-gray-500 dark:text-gray-400 mb-1">可提现余额</p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(distributorData.walletBalance)}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400">
                  <i className="fa-solid fa-wallet text-xl"></i>
                </div>
              </div>
              <Link to="/withdrawal" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
                <span className="text-sm font-medium">立即提现</span>
                <i className="fa-solid fa-chevron-right text-xs ml-1"></i>
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-1">冻结金额</p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(distributorData.frozenBalance)}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <i className="fa-solid fa-lock text-xl"></i>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <i className="fa-solid fa-circle-info mr-1"></i> 
                预计7天后解冻
              </p>
            </motion.div>
          </div>
        </section>

        {/* 团队规模与等级进度 */}
        <section className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm lg:col-span-1"
          >
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">团队规模</h3>
            <div className="flex items-center justify-center h-48">
              <div className="relative">
                <svg className="w-40 h-40" viewBox="0 0 100 100">
                  <circle 
                    cx="50" cy="50" r="45" 
                    fill="none" 
                    stroke="#e2e8f0" 
                    strokeWidth="8" 
                  />
                  <circle 
                    cx="50" cy="50" r="45" 
                    fill="none" 
                    stroke="url(#teamGradient)" 
                    strokeWidth="8" 
                    strokeDasharray={`${(distributorData.teamSize / 100) * 283}, 283`} 
                    strokeDashoffset="0" 
                    strokeLinecap="round" 
                    transform="rotate(-90 50 50)" 
                  />
                  <defs>
                    <linearGradient id="teamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{distributorData.teamSize}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">人</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">当前等级</span>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{distributorData.level}</span>
              </div>
              {nextLevelPrivilege && (
                <>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
                      style={{ width: `${progressToNextLevel}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">距离升级还需 {nextLevelPrivilege.minTeamSize - distributorData.teamSize} 人</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">目标: {nextLevelPrivilege.minTeamSize} 人</span>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* 佣金趋势图表 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm lg:col-span-2"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">佣金趋势</h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full">月度</button>
                <button className="px-3 py-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">季度</button>
                <button className="px-3 py-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">年度</button>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={commissionData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorDirect" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTeam" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBonus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Area type="monotone" dataKey="直推佣金" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDirect)" />
                  <Area type="monotone" dataKey="团队级差" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorTeam)" />
                  <Area type="monotone" dataKey="加权分红" stroke="#10b981" fillOpacity={1} fill="url(#colorBonus)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </section>

        {/* 等级特权和最近订单 */}
        <section className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 等级特权 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm"
          >
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">等级特权</h3>
            <div className="space-y-6">
              {levelPrivileges.map((level) => (
                <div 
                  key={level.id} 
                  className={`p-4 rounded-xl ${level.id === distributorData.levelId ? 
                    'bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800' : 
                    'bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className={`font-medium ${level.id === distributorData.levelId ? 
                      'text-blue-600 dark:text-blue-400' : 
                      'text-gray-900 dark:text-white'
                    }`}>
                      {level.name}
                      {level.id === distributorData.levelId && <span className="ml-2 text-xs font-normal px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full">当前等级</span>}
                    </h4>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      团队规模 ≥{level.minTeamSize}人
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div className="flex items-center">
                      <i className="fa-solid fa-percent text-amber-500 mr-1"></i>
                      <span>佣金率: {level.commissionRate}%</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fa-solid fa-gift text-purple-500 mr-1"></i>
                      <span>分红率: {level.bonusRate}%</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {level.features.map((feature, index) => (
                      <span 
                        key={index} 
                        className={`text-xs px-2 py-1 rounded-full ${level.id === distributorData.levelId ? 
                          'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 
                          'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 最近订单 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm lg:col-span-2"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">最近订单</h3>
              <Link to="/commission" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                <span>查看全部</span>
                <i className="fa-solid fa-chevron-right text-xs ml-1"></i>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">订单号</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">订单金额</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">获得佣金</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">状态</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">日期</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="py-3 px-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{order.orderSn}</td>
                      <td className="py-3 px-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatCurrency(order.amount)}</td>
                      <td className="py-3 px-2 whitespace-nowrap text-sm text-green-600 dark:text-green-400">{formatCurrency(order.commission)}</td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === '已结算' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                          order.status === '冻结中' ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200' :
                          'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </section>

        {/* 邀请卡片 */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-2xl text-white">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h3 className="text-2xl font-bold mb-3">邀请好友加入</h3>
                <p className="text-blue-100 mb-4">每邀请一位好友成为合伙人，您将获得额外奖励</p>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center">
                    <i className="fa-solid fa-ticket mr-2"></i>
                    <span className="font-mono font-bold">{distributorData.inviteCode}</span>
                  </div>
                  <button className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors">
                    <i className="fa-solid fa-copy mr-2"></i>复制邀请码
                  </button>
                </div>
              </div>
              <div className="flex space-x-4">
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-3 rounded-lg font-medium transition-colors flex items-center">
                  <i className="fa-brands fa-weixin text-xl mr-2"></i>
                  <span>分享给微信好友</span>
                </button>
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-3 rounded-lg font-medium transition-colors flex items-center">
                  <i className="fa-solid fa-qrcode text-xl mr-2"></i>
                  <span>生成邀请海报</span>
                </button>
              </div>
            </div>
          </div>
        </motion.section>
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