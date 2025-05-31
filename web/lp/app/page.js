export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      
      {/* Hero Section */}
      <section className="px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="text-6xl mb-6">🐾</div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            あなたの愛猫、&quot;いま&quot;<br />
            どんな気持ちですか？
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            言葉を話さないけれど、<br />
            本当は、たくさんのことを伝えようとしている。
          </p>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            CatSense は、猫の行動と気分をそっと読み取って、<br />
            あなたにそっと教えてくれる、新しい首輪です。
          </p>
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-2xl font-bold py-4 px-8 rounded-full inline-block mb-12">
            👉「猫と、通じ合う未来へ。」
          </div>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-colors">
              モニター応募フォームへ
            </button>
            <button className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-bold py-4 px-8 rounded-full text-lg transition-colors">
              詳しく見る
            </button>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            💭 あなたの&quot;わからない&quot;リスト
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12">飼い主のよくある悩み・モヤモヤ</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-50 p-6 rounded-2xl">
              <div className="text-2xl mb-3">🐱</div>
              <p className="text-lg text-gray-700">お留守番中、うちの子はなにしてるの？</p>
            </div>
            <div className="bg-pink-50 p-6 rounded-2xl">
              <div className="text-2xl mb-3">🐱</div>
              <p className="text-lg text-gray-700">鳴いてるけど、なんのサイン？</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-2xl">
              <div className="text-2xl mb-3">🐱</div>
              <p className="text-lg text-gray-700">最近、なんとなく元気がないような気がする…</p>
            </div>
            <div className="bg-pink-50 p-6 rounded-2xl">
              <div className="text-2xl mb-3">🐱</div>
              <p className="text-lg text-gray-700">快適に過ごせてるのか、わからない</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-2xl md:col-span-2">
              <div className="text-2xl mb-3">🐱</div>
              <p className="text-lg text-gray-700">いないと思ったら、どこに行ってたの…？</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-purple-100 to-pink-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            💡 それが、わかるようになる
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12">CatSense が変えること</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="text-2xl mb-3">✅</div>
              <p className="text-lg text-gray-700">「いつ」「どこで」「なにをしていたか」がアプリで見える</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="text-2xl mb-3">✅</div>
              <p className="text-lg text-gray-700">鳴き声と動きから、「甘えてた」「不安だった」が読み取れる</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="text-2xl mb-3">✅</div>
              <p className="text-lg text-gray-700">猫の個性に合わせて、どんどん精度が良くなる</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="text-2xl mb-3">✅</div>
              <p className="text-lg text-gray-700">毎晩、「今日のうちの子まとめ」通知が届く</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <p className="text-xl text-gray-700 font-semibold">
              猫と、すれ違わなくなる感覚を体験してください。
            </p>
          </div>
        </div>
      </section>

      {/* Features Q&A Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            機能紹介
          </h2>
          <div className="space-y-12">
            
            {/* Feature 1 */}
            <div className="bg-purple-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-purple-700 mb-4">Q：うちの子、昼間なにしてるの？</h3>
              <div className="flex items-start gap-4 mb-4">
                <div className="text-2xl">📊</div>
                <p className="text-lg text-gray-700">行動タイムラインがアプリに記録されます（睡眠・ごはん・毛づくろい…）</p>
              </div>
              <p className="text-gray-600 pl-12">「ちゃんと寝てた」「運動してるな」→ ✅安心</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-pink-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-pink-700 mb-4">Q：さっきの鳴き声、どういう意味？</h3>
              <div className="flex items-start gap-4 mb-4">
                <div className="text-2xl">🎙</div>
                <p className="text-lg text-gray-700">鳴き声が録音&amp;分類され、「甘え？不安？」がわかります</p>
              </div>
              <p className="text-gray-600 pl-12">かわいさを残しつつ、意味がある → 💗理解できる嬉しさ</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-purple-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-purple-700 mb-4">Q：最近、元気がない気がするけど…</h3>
              <div className="flex items-start gap-4 mb-4">
                <div className="text-2xl">📈</div>
                <p className="text-lg text-gray-700">行動＋気分の履歴が見られて、小さな変化に気づける</p>
              </div>
              <p className="text-gray-600 pl-12">「最近夜起きてることが多いな」→ 🔍気づける安心</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-pink-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-pink-700 mb-4">Q：いま、どこにいるの？</h3>
              <div className="flex items-start gap-4 mb-4">
                <div className="text-2xl">🏠</div>
                <p className="text-lg text-gray-700">データから家の中の&quot;だいたいの居場所&quot;を予測</p>
              </div>
              <p className="text-gray-600 pl-12">「寝室の奥で毛づくろいしてた」→ 📍つながっている実感</p>
            </div>

            {/* Feature 5 */}
            <div className="bg-purple-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-purple-700 mb-4">Q：猫の快適さって、どうやってわかるの？</h3>
              <div className="flex items-start gap-4 mb-4">
                <div className="text-2xl">🌡</div>
                <p className="text-lg text-gray-700">温湿度と行動を学習して、「ちょうどいい環境」を提案</p>
              </div>
              <p className="text-gray-600 pl-12">🐾気持ちよく過ごせるヒントが届く</p>
            </div>

          </div>
        </div>
      </section>

      {/* Notification Preview */}
      <section className="px-4 py-20 bg-gradient-to-r from-purple-100 to-pink-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            通知イメージ
          </h2>
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-3xl">🐱</div>
              <h3 className="text-xl font-bold text-gray-800">今日のネルちゃんまとめ</h3>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-purple-600">•</span>
                <span>午後はソファの上でまったり</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600">•</span>
                <span>18時にごはん → 運動モード</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600">•</span>
                <span>22時ごろに甘え鳴き → その後ぐっすり就寝</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            お客様の声
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-purple-50 p-6 rounded-2xl">
              <p className="text-gray-700 mb-4 text-lg">
                &quot;寝てる時間が長くて心配だったけど、ちゃんと遊んでる時間もあったとわかって安心しました。&quot;
              </p>
              <p className="text-gray-500">― 30代 / 女性 / 2匹飼い</p>
            </div>
            <div className="bg-pink-50 p-6 rounded-2xl">
              <p className="text-gray-700 mb-4 text-lg">
                &quot;鳴き声を保存してるだけでうれしいし、しかも&quot;甘えたかった&quot;とか出るの最高です&quot;
              </p>
              <p className="text-gray-500">― 20代 / 男性 / 単身者</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            💰 お試ししやすい価格で
          </h2>
          <div className="bg-white text-gray-800 p-8 rounded-2xl max-w-2xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">初期費用</p>
                <p className="text-3xl font-bold text-purple-600">9,800円以下</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">月額</p>
                <p className="text-3xl font-bold text-purple-600">300円</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-green-600">☑</span>
                <span>買い切り型</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-600">☑</span>
                <span>クレジット不要</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-600">☑</span>
                <span>首輪に後付けするだけ</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Monitor Program CTA */}
      <section className="px-4 py-20 bg-yellow-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-4xl mb-6">🚀</div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
            先着300名限定モニター募集中
          </h2>
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto mb-8">
            <p className="text-2xl font-bold text-red-600 mb-4">モニター価格：7,980円</p>
            <p className="text-lg text-gray-700 mb-6">特典：先行アプリ使用・開発Discord招待</p>
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-12 rounded-full text-xl transition-all transform hover:scale-105">
              🔗 応募フォームへ
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 bg-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">CatSense</h3>
          <p className="text-gray-400 mb-6">猫と、通じ合う未来へ。</p>
          <p className="text-sm text-gray-500">
            © 2025 CatSense. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}