export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-purple-950 dark:via-pink-950 dark:to-purple-900">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Nelnel
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-4">
            いま、この瞬間のネコゴコロを照らす首輪
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
            外出中、ふとスマホを開くと「いまネルは窓辺で半分ウトウトしながら、あなたが帰るのを待っています」<br />
            そんな情景付きの通知が届く――行動ログ＋感情インサイトに特化した次世代ネコIoTモジュール
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              モニタープログラム申込
            </button>
            <button className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-50 dark:hover:bg-purple-900 transition-all duration-300">
              製品詳細を見る
            </button>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="bg-white dark:bg-gray-900 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white">
            なぜ "可視化" が必要か
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 p-8 rounded-2xl">
              <h3 className="text-xl font-bold mb-4 text-purple-800 dark:text-purple-200">従来の可視化</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">運動量グラフ</p>
              <h3 className="text-xl font-bold mb-4 text-pink-800 dark:text-pink-200">見えていない真実</h3>
              <p className="text-gray-600 dark:text-gray-300">実は「夜中に運動＝ストレス解消ではなく不安」、行動の質を読めなければ誤解する</p>
            </div>
            
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900 dark:to-purple-900 p-8 rounded-2xl">
              <h3 className="text-xl font-bold mb-4 text-purple-800 dark:text-purple-200">従来の可視化</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">鳴き声の音圧レベル</p>
              <h3 className="text-xl font-bold mb-4 text-pink-800 dark:text-pink-200">見えていない真実</h3>
              <p className="text-gray-600 dark:text-gray-300">同じ音量でも"甘え"と"警戒"は違う。ニュアンスを捉えなければ意味がない</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 p-8 rounded-2xl">
              <h3 className="text-xl font-bold mb-4 text-purple-800 dark:text-purple-200">従来の可視化</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">温湿度センサー</p>
              <h3 className="text-xl font-bold mb-4 text-pink-800 dark:text-pink-200">見えていない真実</h3>
              <p className="text-gray-600 dark:text-gray-300">快適かどうかは気温×行動×気分の相関で決まる</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Nelnel は "量" ではなく "意味" を抽出することで<br />
              飼い主が本当に欲しい「安心」と「理解」を与える。
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white">
            機能構成（v1 MVP）
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold mb-3 text-purple-600">行動ダイアリー</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">5分粒度で「睡眠/ごはん/運動/毛づくろい/歩き回り」タイムライン</p>
              <p className="text-sm text-gray-500">6軸IMU＋気圧＋特徴量抽出 → TinyCNN</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold mb-3 text-pink-600">ムードインサイト</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">タイムライン上に "🙂落ち着き / 😺ご機嫌 / 😿不安" アイコン</p>
              <p className="text-sm text-gray-500">IMU＋マイク 0.5s 窓のパターン認識</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold mb-3 text-purple-600">コンフォートボード</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">温湿度と行動のクロス分析→「室温±何℃で睡眠質↑」提案</p>
              <p className="text-sm text-gray-500">環境センサ × ベイズ最適化</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold mb-3 text-pink-600">アラート&日記</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">異常鳴き >30s → プッシュ通知<br />日次の「今日のネルまとめ」</p>
              <p className="text-sm text-gray-500">on-device VAD + クラウド処理</p>
            </div>
          </div>
        </div>
      </section>

      {/* Specs Section */}
      <section className="bg-white dark:bg-gray-900 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white">
            プロダクト仕様
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-800 dark:to-pink-800 p-6 rounded-2xl mb-4">
                <h3 className="font-bold text-lg mb-2">サイズ</h3>
                <p className="text-2xl font-bold text-purple-600">24×18×7mm</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">コイン2枚重ね</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-800 dark:to-purple-800 p-6 rounded-2xl mb-4">
                <h3 className="font-bold text-lg mb-2">重量</h3>
                <p className="text-2xl font-bold text-pink-600">8g</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">既存首輪にクリップオン</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-800 dark:to-pink-800 p-6 rounded-2xl mb-4">
                <h3 className="font-bold text-lg mb-2">バッテリー</h3>
                <p className="text-2xl font-bold text-purple-600">7日間</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">110mAh Li-Po</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-800 dark:to-purple-800 p-6 rounded-2xl mb-4">
                <h3 className="font-bold text-lg mb-2">通信</h3>
                <p className="text-2xl font-bold text-pink-600">BLE 5.3</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">1M PHY・MTU 247</p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold mb-6 text-center">センサー構成</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl">
                <p className="font-semibold">6-DoF IMU</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl">
                <p className="font-semibold">PDMマイク</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl">
                <p className="font-semibold">温湿度センサー</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl">
                <p className="font-semibold">気圧センサー</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UI Mockup Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white">
            ストーリードリブン UI
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-purple-600">🏠 ホーム</h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li>• 1日の行動フロー (Gantt) + ムードマーカー</li>
                <li>• 「🏠 在宅中でも通知ON/OFF」バッジ</li>
                <li>• 「🌡️ 環境快適度95%」バッジ</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-pink-600">📊 今日のネル（日次レポ）</h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li>• 睡眠質スコア 82 → 「夜中3時～4時に覚醒。室温22℃→20℃が要因？」</li>
                <li>• ごはん量 35g（基準 +2g）→ 「運動量多めで◎」</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-purple-600">🔥 ヒートマップ週報</h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li>• 運動ピーク時間帯×ムード</li>
                <li>• 「夕方18時の招き鳴き」は甘え</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-pink-600">🚨 アラートログ</h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li>• 05/27 14:05 「不安鳴き + バタバタ移動」</li>
                <li>• 通知履歴タップで30秒前から動画風リプレイ</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing and CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">
            「愛猫の"いま"を知りたい」その想いを形にする仲間を募集
          </h2>
          
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl max-w-2xl mx-auto mb-8">
            <h3 className="text-2xl font-bold mb-6">先着300名限定モニタープログラム</h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="text-center">
                <p className="text-3xl font-bold mb-2">¥7,980</p>
                <p className="text-sm opacity-90">発売前限定価格</p>
                <p className="text-xs opacity-75 line-through">通常価格 ¥9,800</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold mb-2">¥300/月</p>
                <p className="text-sm opacity-90">アプリサブスク</p>
              </div>
            </div>
            
            <div className="space-y-3 text-left mb-8">
              <p>• 専用アプリβ版へのフィードバック権</p>
              <p>• 開発チーム Discord への招待</p>
              <p>• 正式版リリース時の優待価格</p>
            </div>
            
            <button className="bg-white text-purple-600 px-12 py-4 rounded-full font-bold text-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              モニター応募フォームへ
            </button>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="bg-white dark:bg-gray-900 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white">
            開発ロードマップ
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex items-center space-x-6">
                <div className="bg-purple-600 text-white px-4 py-2 rounded-full font-bold min-w-[120px] text-center">
                  2025 Q3
                </div>
                <div className="flex-1 bg-purple-50 dark:bg-purple-900 p-6 rounded-xl">
                  <p className="font-semibold text-gray-800 dark:text-white">MVP首輪 30台 量産試作 → クローズドテスト</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="bg-pink-600 text-white px-4 py-2 rounded-full font-bold min-w-[120px] text-center">
                  2025 Q4
                </div>
                <div className="flex-1 bg-pink-50 dark:bg-pink-900 p-6 rounded-xl">
                  <p className="font-semibold text-gray-800 dark:text-white">クラウドALB／Lambda負荷試験 & モバイルβ</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="bg-purple-600 text-white px-4 py-2 rounded-full font-bold min-w-[120px] text-center">
                  2026 Q1
                </div>
                <div className="flex-1 bg-purple-50 dark:bg-purple-900 p-6 rounded-xl">
                  <p className="font-semibold text-gray-800 dark:text-white">一般発売・月額サブスク開始（App内課金）</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="bg-pink-600 text-white px-4 py-2 rounded-full font-bold min-w-[120px] text-center">
                  2026 Q2
                </div>
                <div className="flex-1 bg-pink-50 dark:bg-pink-900 p-6 rounded-xl">
                  <p className="font-semibold text-gray-800 dark:text-white">「マルチキャット対応」 & 「気分予報ウィジェット」</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Summary Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">
              🔑 まとめ
            </h2>
            
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-300">
              <p>• 行動ログ × ムードインサイト に絞り、価格破壊 & 過度な期待を抑えた誠実設計</p>
              <p>• UIは "データ表" ではなく "飼い主と猫の物語" を映し出すストーリー型</p>
              <p className="text-xl font-semibold">
                「ネコのシグナルを "意味" に変換する」ことで<br />
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
                  "ただ見る"を"伝わる"にアップグレード
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Nelnel
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              ネコのシグナルを"意味"に変換し、飼い主が本当に欲しい「安心」と「理解」を届ける次世代IoTデバイス
            </p>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-400 text-sm">
              © 2025 Nelnel Project. 開発中のプロダクトです。仕様は予告なく変更される場合があります。
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}