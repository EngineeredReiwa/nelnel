export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-6">
              Nelnel
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 mb-4 font-light">
              いま、この瞬間のネコゴコロを照らす首輪
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              外出中、ふとスマホを開くと「いまネルは窓辺で半分ウトウトしながら、あなたが帰るのを待っています」<br />
              そんな "情景付きの通知" が届く――。<br />
              Nelnel は、行動ログ＋感情インサイトに特化した 次世代ネコIoTモジュール です。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300">
                モニター応募フォームへ
              </button>
              <button className="px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-full font-semibold hover:bg-purple-50 transition-all duration-300">
                詳細を見る
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Why Section */}
      <div className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            1️⃣ ― Why：なぜ "可視化" が必要か
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-purple-50 dark:bg-gray-700 p-6 rounded-2xl">
              <h3 className="text-xl font-bold mb-3 text-purple-600">従来の可視化</h3>
              <p className="text-gray-600 dark:text-gray-300">運動量グラフ</p>
            </div>
            <div className="bg-pink-50 dark:bg-gray-700 p-6 rounded-2xl">
              <h3 className="text-xl font-bold mb-3 text-pink-600">見えていない真実</h3>
              <p className="text-gray-600 dark:text-gray-300">実は「夜中に運動＝ストレス解消ではなく不安」、行動の質を読めなければ誤解する</p>
            </div>
            <div className="bg-purple-50 dark:bg-gray-700 p-6 rounded-2xl">
              <h3 className="text-xl font-bold mb-3 text-purple-600">Nelnelのアプローチ</h3>
              <p className="text-gray-600 dark:text-gray-300">"量" ではなく "意味" を抽出することで、飼い主が本当に欲しい「安心」と「理解」を与える</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            2️⃣ ― What：機能構成（v1 MVP）
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold mb-3 text-purple-600">行動ダイアリー</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">5分粒度で「睡眠 / ごはん / 運動 / 毛づくろい / 歩き回り」タイムライン</p>
              <p className="text-sm text-gray-500">6軸IMU＋気圧＋特徴量抽出 → TinyCNN</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold mb-3 text-pink-600">ムードインサイト</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">タイムライン上に "🙂落ち着き / 😺ご機嫌 / 😿不安" アイコン</p>
              <p className="text-sm text-gray-500">IMU＋マイク 0.5s 窓のパターン認識 (Edge Impulse)</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold mb-3 text-purple-600">コンフォートボード</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">温湿度と行動のクロス分析→「室温±何℃で睡眠質↑」提案</p>
              <p className="text-sm text-gray-500">環境センサ × ベイズ最適化</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold mb-3 text-pink-600">アラート&日記</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">異常鳴き &gt;30s → プッシュ通知<br />日次の「今日のネルまとめ」</p>
              <p className="text-sm text-gray-500">on-device VAD + クラウド処理</p>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            3️⃣ ― How：プロダクト感を高めるスペック
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-purple-50 dark:bg-gray-700 p-6 rounded-2xl text-center">
              <h3 className="text-lg font-bold mb-2 text-purple-600">サイズ</h3>
              <p className="text-gray-600 dark:text-gray-300">24 × 18 × 7 mm<br />（コイン2枚重ね）</p>
            </div>
            <div className="bg-pink-50 dark:bg-gray-700 p-6 rounded-2xl text-center">
              <h3 className="text-lg font-bold mb-2 text-pink-600">重量</h3>
              <p className="text-gray-600 dark:text-gray-300">8 g<br />（既存首輪にクリップオン）</p>
            </div>
            <div className="bg-purple-50 dark:bg-gray-700 p-6 rounded-2xl text-center">
              <h3 className="text-lg font-bold mb-2 text-purple-600">バッテリー</h3>
              <p className="text-gray-600 dark:text-gray-300">110 mAh Li-Po<br />連続7日</p>
            </div>
            <div className="bg-pink-50 dark:bg-gray-700 p-6 rounded-2xl text-center">
              <h3 className="text-lg font-bold mb-2 text-pink-600">通信</h3>
              <p className="text-gray-600 dark:text-gray-300">BLE 5.3<br />MTU 247・NUS Notify</p>
            </div>
          </div>
          
          <div className="mt-12 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl">
            <h3 className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-white">センサー構成</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="text-gray-700 dark:text-gray-300">6-DoF IMU</div>
              <div className="text-gray-700 dark:text-gray-300">PDMマイク</div>
              <div className="text-gray-700 dark:text-gray-300">温湿度センサー</div>
              <div className="text-gray-700 dark:text-gray-300">気圧センサー</div>
            </div>
          </div>
        </div>
      </div>

      {/* UI Mockup */}
      <div className="py-20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            4️⃣ ― ストーリードリブン UI モック
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold mb-3 text-purple-600">ホーム</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">1日の行動フロー (Gantt) + ムードマーカー<br />「🏠 在宅中でも通知ON/OFF」「🌡️ 環境快適度95%」バッジ</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold mb-3 text-pink-600">今日のネル</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">睡眠質スコア 82 → 「夜中3時～4時に覚醒。室温 22℃→20℃が要因？」<br />ごはん量 35g（基準 +2g）→ 「運動量多めで◎」</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold mb-3 text-purple-600">ヒートマップ週報</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">運動ピーク時間帯×ムード → 「夕方18時の招き鳴き」は甘え</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold mb-3 text-pink-600">アラートログ</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">05/27 14:05 「不安鳴き + バタバタ移動」→通知履歴タップで30秒前から動画風リプレイ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
            6️⃣ ― CTA と心理トリガー
          </h2>
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-2xl mb-8">
            <h3 className="text-2xl font-bold mb-4">「愛猫の"いま"を知りたい」その想いを形にする仲間を募集。</h3>
            <p className="text-xl mb-6">先着 300名限定モニタープログラム 受付中。</p>
            <div className="grid md:grid-cols-3 gap-4 mb-6 text-center">
              <div>
                <div className="text-3xl font-bold">¥7,980</div>
                <div className="text-sm">本体（発売前限定価格）</div>
              </div>
              <div>
                <div className="text-xl font-bold">β版アクセス</div>
                <div className="text-sm">専用アプリへのフィードバック権</div>
              </div>
              <div>
                <div className="text-xl font-bold">Discord招待</div>
                <div className="text-sm">開発チームとの直接交流</div>
              </div>
            </div>
            <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold text-lg hover:shadow-lg transition-all duration-300">
              ▼ モニター応募フォームへ
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400">通常価格: 本体 ¥9,800 + 月額 ¥300</p>
        </div>
      </div>

      {/* Roadmap */}
      <div className="py-20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            7️⃣ ― 次のアクション（開発ロードマップ抜粋）
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold mb-3 text-purple-600">2025 Q3</h3>
              <p className="text-gray-600 dark:text-gray-300">MVP首輪 30台 量産試作 → クローズドテスト</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold mb-3 text-pink-600">2025 Q4</h3>
              <p className="text-gray-600 dark:text-gray-300">クラウドALB／Lambda負荷試験 & モバイルβ</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold mb-3 text-purple-600">2026 Q1</h3>
              <p className="text-gray-600 dark:text-gray-300">一般発売・月額サブスク開始（App内課金）</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold mb-3 text-pink-600">2026 Q2</h3>
              <p className="text-gray-600 dark:text-gray-300">「マルチキャット対応」 & 「気分予報ウィジェット」</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
            🔑 まとめ
          </h2>
          <div className="space-y-6">
            <p className="text-lg text-gray-600 dark:text-gray-300">
              行動ログ × ムードインサイト に絞り、価格破壊 & 過度な期待を抑えた誠実設計
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              UIは "データ表" ではなく "飼い主と猫の物語" を映し出すストーリー型
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              「ネコのシグナルを "意味" に変換する」ことで<br />
              <strong className="text-purple-600">"ただ見る"を"伝わる"にアップグレード</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Nelnel
          </h3>
          <p className="text-gray-400 mb-4">
            いま、この瞬間のネコゴコロを照らす首輪
          </p>
          <p className="text-sm text-gray-500">
            本プロダクトは開発中です。仕様・価格・リリース時期は変更される可能性があります。
          </p>
        </div>
      </footer>
    </div>
  );
}