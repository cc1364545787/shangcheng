import { useEffect, useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';
import { useTheme } from '../hooks/useTheme';
import { formatCurrency } from '../lib/utils';
import { toast } from 'sonner';

// 模拟提现记录数据
const withdrawalHistory = [
  { id: 1, amount: 5000, status: '已到账', date: '2025-06-10', account: '微信零钱' },
  { id: 2, amount: 3000, status: '已到账', date: '2025-05-25', account: '微信零钱' },
  { id: 3, amount: 8000, status: '已到账', date: '2025-05-10', account: '银行卡' },
  { id: 4, amount: 4000, status: '处理中', date: '2025-06-01', account: '微信零钱' },
];

// 提现方式选项
const withdrawalMethods = [
  { id: 1, name: '微信零钱', icon: 'fa-weixin', color: 'green' },
  { id: 2, name: '支付宝', icon: 'fa-alipay', color: 'blue' },
  { id: 3, name: '银行卡', icon: 'fa-credit-card', color: 'purple' },
];

// 银行列表
const banks = [
  { id: 1, name: '工商银行' },
  { id: 2, name: '农业银行' },
  { id: 3, name: '中国银行' },
  { id: 4, name: '建设银行' },
  { id: 5, name: '招商银行' },
  { id: 6, name: '交通银行' },
];

export default function WithdrawalPage() {
  const { isAuthenticated, distributorData } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  // 提现表单状态
  const [formData, setFormData] = useState({
    amount: '',
    method: 1,
    bankId: '',
    accountName: '',accountNumber: '',
  });
  
  const [showForm, setShowForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  // 表单处理函数
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 提交提现申请
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('请输入有效的提现金额');
      return;
    }
    
    if (parseFloat(formData.amount) > distributorData.walletBalance) {
      toast.error('提现金额不能超过可提现余额');
      return;
    }
    
    // 如果选择银行卡，验证银行卡信息
    if (formData.method === 3) {
      if (!formData.bankId || !formData.accountName || !formData.accountNumber) {
        toast.error('请填写完整的银行卡信息');
        return;
      }
    }
    
    // 模拟提交成功
    setShowSuccessModal(true);
    
    // 重置表单
    setFormData({
      amount: '',
      method: 1,
      bankId: '',
      accountName: '',
      accountNumber: '',
    });
    
    setShowForm(false);
  };

  // 关闭成功弹窗
  const closeSuccessModal = () => {
    setShowSuccessModal(false);
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
            <Link to="/commission" className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap">
              <i className="fa-solid fa-chart-pie mr-2"></i>佣金明细
            </Link>
            <Link to="/withdrawal" className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 transition-colors whitespace-nowrap">
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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">提现管理</h2>
              <p className="text-gray-500 dark:text-gray-400">便捷管理您的资金提现</p>
            </div>
          </div>
          
          {/* 余额卡片 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-2xl text-white mb-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h3 className="text-xl font-bold mb-2">可提现余额</h3>
                <p className="text-4xl font-bold mb-2">{formatCurrency(distributorData.walletBalance)}</p>
                <p className="text-blue-100 text-sm">
                  <i className="fa-solid fa-circle-info mr-1"></i> 
                  提现金额最低100元，最高单次限额50000元
                </p>
              </div>
              
              <button 
                onClick={() => setShowForm(!showForm)}
                className="mt-4 md:mt-0 bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center"
              >
                <i className="fa-solid fa-hand-holding-dollar mr-2"></i>
                <span>{showForm ? '取消提现' : '申请提现'}</span>
              </button>
            </div>
          </motion.div>
          
          {/* 提现表单 */}
          {showForm && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm mb-8"
            >
              <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">提现申请</h3>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* 提现金额 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      提现金额
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                        ¥
                      </span>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        placeholder="请输入提现金额"
                        min="100"
                        max="50000"
                        step="0.01"
                        className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      可用余额: <span className="text-blue-600 dark:text-blue-400 font-medium">{formatCurrency(distributorData.walletBalance)}</span>
                    </p>
                  </div>
                  
                  {/* 提现方式 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      提现方式
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {withdrawalMethods.map((method) => (
                        <div
                          key={method.id}
                          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                            formData.method === method.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-800'
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, method: method.id }))}
                        >
                          <div className={`w-10 h-10 rounded-full bg-${method.color}-100 dark:bg-${method.color}-900 flex items-center justify-center text-${method.color}-600 dark:text-${method.color}-400 mr-3`}>
                            <i className={`fa-brands fa-${method.icon} text-xl`}></i>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">{method.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">预计1-3个工作日到账</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            formData.method === method.id
                              ? 'border-blue-500 bg-blue-500 dark:bg-blue-400'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {formData.method === method.id && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 银行卡信息（选择银行卡时显示） */}
                  {formData.method === 3 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          开户银行
                        </label>
                        <select
                          name="bankId"
                          value={formData.bankId}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        >
                          <option value="">请选择银行</option>
                          {banks.map((bank) => (
                            <option key={bank.id} value={bank.id}>{bank.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          开户姓名
                        </label>
                        <input
                          type="text"
                          name="accountName"
                          value={formData.accountName}
                          onChange={handleInputChange}
                          placeholder="请输入开户姓名"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          银行卡号
                        </label>
                        <input
                          type="text"
                          name="accountNumber"
                          value={formData.accountNumber}
                          onChange={handleInputChange}
                          placeholder="请输入银行卡号"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* 手续费说明 */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <i className="fa-solid fa-circle-info text-blue-500 mt-0.5 mr-2"></i>
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <strong>提现规则说明：</strong>
                        </p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                          <li>• 单笔提现最低金额为100元，最高限额为50000元</li>
                          <li>• 提现申请提交后，一般在1-3个工作日内到账</li>
                          <li>• 微信零钱和支付宝提现收取0.6%的手续费</li>
                          <li>• 银行卡提现收取1元/笔的固定手续费</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* 提交按钮 */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition-colors flex items-center"
                    >
                      <i className="fa-solid fa-paper-plane mr-2"></i>
                      提交提现申请
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
          
          {/* 提现记录 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">提现记录</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50">
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">提现金额</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">提现方式</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">状态</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">申请日期</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {withdrawalHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(item.amount)}</td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.account}</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          item.status === '已到账' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                          item.status === '处理中' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                          'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.date}</td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm">
                        <button className="text-blue-600 dark:text-blue-400 hover:underline">查看详情</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                共 {withdrawalHistory.length} 条记录
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 rounded border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <button className="px-3 py-1 rounded border border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">1</button>
                <button className="px-3 py-1 rounded border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>
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
      
      {/* 成功弹窗 */}
      {showSuccessModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
          >
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400 mx-auto mb-4">
                <i className="fa-solid fa-check text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">提现申请提交成功</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                您的提现申请已提交，我们将尽快处理，请耐心等待
              </p>
              <button 
                onClick={closeSuccessModal}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                确定
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}