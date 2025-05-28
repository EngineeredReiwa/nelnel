export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800">
      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
            Nelnel
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-pink-100">
            いま、この瞬間のネコゴコロを照らす首輪
          </p>
          <p className="text-lg mb-8 text-gray-200 max-w-3xl mx-auto">
            外出中、ふとスマホを開くと &quot;いまネルは窓辺で半分ウトウトしながら、あなたが帰るのを待っています&quot; そんな &quot;情景付きの通知&quot; が届く――。CatSense (仮) は、行動ログ＋感情インサイトに特化した 次世代ネコIoTモジュール です。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-full transition-colors">
              モニタープログラム応募
            </button>
            <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-900 font-bold py-3 px-8 rounded-full transition-colors">
              詳細を見る
            </button>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            なぜ &quot;可視化&quot; が必要か
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-purple-600 text-white">
                  <th className="p-4 text-left">従来の可視化</th>
                  <th className="p-4 text-left">見えていない真実</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4 font-semibold">運動量グラフ</td>
                  <td className="p-4">実は&quot;夜中に運動＝ストレス解消ではなく 不安&quot;、行動の質を読めなければ誤解する</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4 font-semibold">鳴き声の音圧レベル</td>
                  <td className="p-4">同じ音量でも &quot;甘え&quot; と &quot;警戒&quot; は違う。ニュアンスを捉えなければ意味がない</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-semibold">温湿度センサー</td>
                  <td className="p-4">快適かどうかは気温×行動×気分の相関で決まる</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-lg text-center mt-8 text-gray-700">
            CatSense は &quot;量&quot; ではなく &quot;意味&quot; を抽出することで飼い主が本当に欲しい「安心」と「理解」を与える。
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            機能構成（v1 MVP）
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold mb-3 text-purple-600">行動ダイアリー</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">5分粒度で「睡眠 / ごはん / 運動 / 毛づくろい / 歩き回り」タイムライン</p>
              <p className="text-sm text-gray-500">6軸IMU＋気圧＋特徴量抽出 → TinyCNN</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold mb-3 text-purple-600">ムードインサイト</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">タイムライン上に &quot;🙂落ち着き / 😺ご機嫌 / 😿不安&quot; アイコン</p>
              <p className="text-sm text-gray-500">IMU＋マイク 0.5s 窓のパターン認識 (Edge Impulse)</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold mb-3 text-purple-600">コンフォートボード</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">温湿度と行動のクロス分析→「室温±何℃で睡眠質↑」提案</p>
              <p className="text-sm text-gray-500">環境センサ × ベイズ最適化</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold mb-3 text-pink-600">アラート&amp;日記</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">異常鳴き &gt;30s → プッシュ通知<br />日次の「今日のネルまとめ」</p>
              <p className="text-sm text-gray-500">on-device VAD + クラウド処理</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Specs */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            プロダクト感を高めるスペック
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-700">サイズ</span>
                <span className="text-gray-600">24 × 18 × 7 mm（コイン2枚重ね）</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-700">重量</span>
                <span className="text-gray-600">8 g（既存首輪にクリップオン）</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-700">バッテリー</span>
                <span className="text-gray-600">110 mAh Li-Po → 連続7日</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-700">充電</span>
                <span className="text-gray-600">USB-C ドングル / ワイヤレスQi</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-700">通信</span>
                <span className="text-gray-600">BLE 5.3 (1 M PHY)</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-700">センサー</span>
                <span className="text-gray-600">6-DoF IMU, PDMマイク, 温湿度, 気圧</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-700">アプリ</span>
                <span className="text-gray-600">iOS / Android（Flutter Web可）</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-700">価格</span>
                <span className="text-gray-600">本体 9,800円 ＋ 月額 300円</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UI Mockup Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            ストーリードリブン UI モック
          </h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-purple-600">🏠 ホーム</h3>
              <p className="text-gray-700">1日の行動フロー (Gantt) + ムードマーカー<br />
              「🏠 在宅中でも通知ON/OFF」「🌡️ 環境快適度95%」バッジ</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-purple-600">📊 今日のネル（日次レポ）</h3>
              <p className="text-gray-700">睡眠質スコア 82 → 「夜中3時～4時に覚醒。室温 22℃→20℃が要因？」<br />
              ごはん量 35g（基準 +2g）→ 「運動量多めで◎」</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-purple-600">🔥 ヒートマップ週報</h3>
              <p className="text-gray-700">運動ピーク時間帯×ムード → 「夕方18時の招き鳴き」は甘え</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-purple-600">🚨 アラートログ</h3>
              <p className="text-gray-700">05/27 14:05 「不安鳴き + バタバタ移動」→通知履歴タップで30秒前から動画風リプレイ</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-purple-900 to-pink-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            「愛猫の&quot;いま&quot;を知りたい」その想いを形にする仲間を募集
          </h2>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4 text-pink-200">先着 300名限定モニタープログラム</h3>
            <div className="text-lg space-y-2 mb-6">
              <p>• 本体 ¥7,980（発売前限定価格）</p>
              <p>• 専用アプリβ版へのフィードバック権</p>
              <p>• 開発チーム Discord への招待</p>
            </div>
            <button className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-colors">
              モニター応募フォームへ
            </button>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            開発ロードマップ
          </h2>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
              <div>
                <span className="font-bold text-purple-600">2025 Q3：</span>
                <span className="text-gray-700">MVP首輪 30台 量産試作 → クローズドテスト</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
              <div>
                <span className="font-bold text-purple-600">2025 Q4：</span>
                <span className="text-gray-700">クラウドALB／Lambda負荷試験 &amp; モバイルβ</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-4 h-4 bg-pink-600 rounded-full"></div>
              <div>
                <span className="font-bold text-pink-600">2026 Q1：</span>
                <span className="text-gray-700">一般発売・月額サブスク開始（App内課金）</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-4 h-4 bg-pink-600 rounded-full"></div>
              <div>
                <span className="font-bold text-pink-600">2026 Q2：</span>
                <span className="text-gray-700">「マルチキャット対応」&amp; 「気分予報ウィジェット」</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="py-16 px-6 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">まとめ</h2>
          <div className="space-y-4 text-left">
            <p className="text-lg text-gray-700">
              • 行動ログ × ムードインサイト に絞り、価格破壊 &amp; 過度な期待を抑えた誠実設計
            </p>
            <p className="text-lg text-gray-700">
              • UIは &quot;データ表&quot; ではなく &quot;飼い主と猫の物語&quot; を映し出すストーリー型
            </p>
            <p className="text-lg text-gray-700">
              • 「ネコのシグナルを &quot;意味&quot; に変換する」ことで <strong>&quot;ただ見る&quot;を&quot;伝わる&quot;にアップグレード</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900 text-white text-center">
        <p className="text-gray-400">© 2025 Nelnel Project. 開発中のプロダクトです。</p>
      </footer>
    </div>
  );
}