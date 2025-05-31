'use client';

import { motion } from 'framer-motion';
import { Cat, Heart, Zap, Shield, Smartphone, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="text-center lg:text-left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                愛猫の
                <span className="text-blue-600">健康</span>を
                <br />
                24時間見守る
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                CatSenseで、あなたの大切な猫ちゃんの日常を
                リアルタイムでモニタリング。健康状態から
                行動パターンまで、すべてを把握できます。
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                >
                  デモを見る
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
                <button className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-blue-600 border-2 border-blue-600 rounded-full hover:bg-blue-50 transition-colors">
                  詳しく見る
                </button>
              </div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform rotate-3">
                <div className="bg-gradient-to-br from-orange-400 to-pink-400 rounded-2xl p-6 text-white text-center">
                  <Cat className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">ねるちゃん</h3>
                  <p className="text-white/90">元気に活動中 😊</p>
                  <div className="mt-4 bg-white/20 rounded-lg p-3">
                    <div className="flex justify-between text-sm">
                      <span>活動量</span>
                      <span>85%</span>
                    </div>
                    <div className="w-full bg-white/30 rounded-full h-2 mt-2">
                      <div className="bg-white h-2 rounded-full w-4/5"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              なぜCatSenseが選ばれるのか
            </h2>
            <p className="text-xl text-gray-600">
              最新のIoT技術で、愛猫の健康管理を革新します
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "24時間ヘルスモニタリング",
                description: "心拍数、体温、活動量を常時監視し、異常があれば即座に通知します。"
              },
              {
                icon: Zap,
                title: "リアルタイム分析",
                description: "AI搭載の分析エンジンが猫の行動パターンを学習し、個別の健康アドバイスを提供。"
              },
              {
                icon: Shield,
                title: "安全・安心設計",
                description: "猫に優しい軽量素材を使用。完全防水で、どんな活動にも対応します。"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <feature.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                いつでも、どこでも
                <br />
                愛猫の様子を確認
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                専用アプリで、外出先からでも愛猫の状態をリアルタイムで確認。
                緊急時にはプッシュ通知でお知らせします。
              </p>
              
              <ul className="space-y-4 mb-8">
                {[
                  "リアルタイム位置情報",
                  "健康データの履歴管理", 
                  "獣医師への相談機能",
                  "複数の猫の一括管理"
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>

              <a 
                href="/"
                className="inline-flex items-center px-6 py-3 text-blue-600 border-2 border-blue-600 rounded-full hover:bg-blue-50 transition-colors"
              >
                <Smartphone className="w-5 h-5 mr-2" />
                デモアプリを体験
              </a>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl transform -rotate-3">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">CatSense App</h3>
                  <p className="text-blue-100">愛猫管理アプリ</p>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">ねるちゃん</span>
                      <span className="text-green-300">● オンライン</span>
                    </div>
                    <div className="text-sm text-blue-100">最後の活動: 2分前</div>
                  </div>
                  
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-sm text-blue-100 mb-1">今日の歩数</div>
                    <div className="text-2xl font-bold">2,847歩</div>
                  </div>
                  
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-sm text-blue-100 mb-1">体調スコア</div>
                    <div className="flex items-center">
                      <div className="text-2xl font-bold mr-2">92</div>
                      <div className="text-green-300">良好</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white text-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              愛猫の健康管理を始めませんか？
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              CatSenseで、大切な家族の一員である愛猫の健康を
              24時間365日見守りましょう。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-900 bg-white rounded-full hover:bg-gray-100 transition-colors"
              >
                無料デモを試す
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
              <button className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white border-2 border-white rounded-full hover:bg-white hover:text-gray-900 transition-colors">
                お問い合わせ
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Cat className="w-8 h-8 text-blue-400 mr-2" />
                <span className="text-xl font-bold">CatSense</span>
              </div>
              <p className="text-gray-400">
                愛猫の健康を見守る、
                次世代IoTデバイス
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">製品</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">CatSense デバイス</a></li>
                <li><a href="#" className="hover:text-white transition-colors">モバイルアプリ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">健康管理プラン</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">サポート</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">ヘルプセンター</a></li>
                <li><a href="#" className="hover:text-white transition-colors">設定ガイド</a></li>
                <li><a href="#" className="hover:text-white transition-colors">お問い合わせ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">企業情報</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">会社概要</a></li>
                <li><a href="#" className="hover:text-white transition-colors">プライバシーポリシー</a></li>
                <li><a href="#" className="hover:text-white transition-colors">利用規約</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CatSense. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}