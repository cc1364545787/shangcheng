import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <i className="fa-solid fa-users text-blue-600 dark:text-blue-400 text-2xl"></i>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              分销合伙人系统
            </h1>
          </motion.div>
          
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
            
            <Link to="/dashboard" className="hidden md:flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-colors">
              <i className="fa-solid fa-sign-in"></i>
              <span>登录合伙人中心</span>
            </Link>
            
            <Link to="/dashboard" className="md:hidden bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors">
              <i className="fa-solid fa-sign-in"></i>
            </Link>
          </div>
        </div>
      </nav>
      
      {/* 英雄区域 */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex-1 container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between"
      >
        <div className="md:w-1/2 mb-10 md:mb-0">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900 dark:text-white"
          >
            开启<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">分销创业</span>之旅
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-8"
          >
            加入我们的分销合伙人计划，轻松管理团队，实时查看收益，享受多级分润和团队极差奖励。
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-full text-center transition-all transform hover:scale-105">
              立即加入
            </Link>
            <Link to="/about" className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-medium px-8 py-3 rounded-full text-center border border-gray-200 dark:border-gray-700 transition-all">
              了解更多
            </Link>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="md:w-1/2 relative"
        >
          <div className="relative w-full h-[400px] md:h-[500px]">
            <img 
              src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Modern%20business%20dashboard%20showing%20revenue%20statistics%2C%20team%20management%2C%20and%20commission%20calculation&sign=e26dbbdceb38be6b8383e20e602a8eeb" 
              alt="分销合伙人系统界面" 
              className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-2xl"
            />
            
            {/* 浮动卡片 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-10 -left-10 md:-left-20 bg-white dark:bg-gray-800 p-5 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400">
                  <i className="fa-solid fa-chart-line text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">本月收益</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">¥28,459</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="absolute -top-5 -right-5 md:-right-15 bg-white dark:bg-gray-800 p-5 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <i className="fa-solid fa-users text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">团队规模</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">124人</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>
      
      {/* 功能特点 */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">强大的分销系统功能</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              我们提供全方位的工具，帮助您轻松管理团队、跟踪收益并实现业务增长
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "fa-solid fa-hand-holding-dollar",
                title: "多级分润系统",
                description: "支持直推奖励、团队级差和加权分红，让您的收益最大化",
                color: "blue"
              },
              {
                icon: "fa-solid fa-users-between-lines",
                title: "团队关系管理",
                description: "清晰可视化的团队图谱，轻松管理上下级关系和团队绩效",
                color: "purple"
              },
              {
                icon: "fa-solid fa-chart-pie",
                title: "实时收益分析",
                description: "通过直观的数据图表，实时监控您的销售业绩和佣金收益",
                color: "green"
              },
              {
                icon: "fa-solid fa-wallet",
                title: "便捷提现流程",
                description: "一键提现到账，安全可靠的资金管理系统，保障您的收益安全",
                color: "amber"
              },
              {
                icon: "fa-solid fa-ticket",
                title: "专属邀请码",
                description: "生成个性化邀请码，轻松发展下线，扩展您的销售网络",
                color: "red"
              },
              {
                icon: "fa-solid fa-mobile-screen",
                title: "全平台支持",
                description: "适配PC端和移动端，随时随地管理您的分销业务",
                color: "indigo"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 transition-all hover:shadow-lg"
              >
                <div className={`w-14 h-14 rounded-2xl bg-${feature.color}-100 dark:bg-${feature.color}-900 flex items-center justify-center text-${feature.color}-600 dark:text-${feature.color}-400 mb-6`}>
                  <i className={`${feature.icon} text-2xl`}></i>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 数据统计 */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { label: "注册合伙人", value: "50,000+", icon: "fa-users", color: "blue" },
              { label: "月均交易额", value: "¥1200万+", icon: "fa-chart-simple", color: "green" },
              { label: "平均佣金率", value: "15%-30%", icon: "fa-percent", color: "purple" },
              { label: "提现成功率", value: "99.9%", icon: "fa-check-circle", color: "amber" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm text-center"
              >
                <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900 flex items-center justify-center text-${stat.color}-600 dark:text-${stat.color}-400`}>
                  <i className={`fa-solid ${stat.icon} text-xl`}></i>
                </div>
                <p className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-gray-500 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 合作伙伴 */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">值得信赖的合作伙伴</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              众多知名企业已加入我们的分销合伙人计划，共同实现业务增长
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 dark:bg-gray-800 h-24 flex items-center justify-center rounded-xl border border-gray-100 dark:border-gray-700"
              >
                <div className="w-32 h-12 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                  <span className="text-gray-400 dark:text-gray-500 font-medium">品牌 {i}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 行动召唤 */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            立即加入我们，开启您的分销创业之旅
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-10 max-w-3xl mx-auto"
          >
            成为我们的合伙人，享受丰厚的佣金回报，共同开拓市场，实现互利共赢
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/dashboard" className="bg-white text-blue-600 hover:bg-gray-100 font-medium px-10 py-4 rounded-full text-lg transition-all transform hover:scale-105 inline-flex items-center">
              <i className="fa-solid fa-rocket mr-2"></i>
              立即开始
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* 页脚 */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-10 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <i className="fa-solid fa-users text-blue-600 dark:text-blue-400 text-xl"></i>
              <span className="text-xl font-bold text-gray-900 dark:text-white">分销合伙人系统</span>
            </div>
            
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                <i className="fa-brands fa-weixin text-2xl"></i>
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                <i className="fa-brands fa-weibo text-2xl"></i>
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                <i className="fa-brands fa-qq text-2xl"></i>
              </a>
            </div>
            
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              © 2025 分销合伙人系统. 保留所有权利.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}