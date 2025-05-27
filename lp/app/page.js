export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4">
            🐱 Nelnel
          </h1>
          <p className="text-2xl text-purple-600 dark:text-purple-300 mb-2">
            猫のためのスマートIoTデバイス
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            あなたの愛猫の健康状態をリアルタイムで見守り、快適な生活をサポートする次世代デバイス
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-colors">
            製品詳細を見る
          </button>
          <button className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-3 rounded-full font-semibold transition-colors">
            デモ動画
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">
          Nelnelの特徴
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
            <div className="text-4xl mb-4">🎵</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              音声モニタリング
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              猫の鳴き声や呼吸音をリアルタイムで分析し、健康状態の変化を検知します
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              環境センサー
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              温度・湿度・気圧などを監視し、猫にとって最適な環境を維持します
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              スマートアプリ連携
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              専用アプリで愛猫の状態を24時間いつでもチェックできます
            </p>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">
            技術仕様
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-purple-600 dark:text-purple-300 mb-6">
                高性能センサー搭載
              </h3>
              <ul className="space-y-4 text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  PDMマイクロフォンによる高音質録音
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  9軸センサー（加速度・ジャイロ・磁気）
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  温湿度・気圧センサー
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  近接・ジェスチャーセンサー
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-xl">
              <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                デバイス仕様
              </h4>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div><strong>マイコン:</strong> Adafruit Feather nRF52840</div>
                <div><strong>通信:</strong> Bluetooth Low Energy (BLE)</div>
                <div><strong>電源:</strong> USB-C / バッテリー駆動</div>
                <div><strong>サイズ:</strong> コンパクト設計</div>
                <div><strong>重量:</strong> 軽量（猫に負担をかけません）</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">
          愛猫の健康を今すぐ守りませんか？
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Nelnelで愛猫の日常をもっと安心・快適に。早期の健康異常発見から環境改善まで、テクノロジーがサポートします。
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-full font-semibold text-lg transition-colors">
            開発状況を見る
          </button>
          <button className="border-2 border-gray-400 text-gray-600 hover:bg-gray-400 hover:text-white px-10 py-4 rounded-full font-semibold text-lg transition-colors">
            お問い合わせ
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">
            <span className="text-2xl">🐱</span> Nelnel - 猫のためのIoTデバイス
          </p>
          <p className="text-gray-400 text-sm">
            現在開発中のプロトタイプです。最新情報はGitHubリポジトリをご確認ください。
          </p>
        </div>
      </footer>
    </div>
  );
}
