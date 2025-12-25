/*
Food Service Test
*/

const foodServiceData = {  // Fixed variable name to follow camelCase
  title: "Food Service Test",
  duration: 60,
  passingScore: 60,
  
  questions: [
    {
      text: "以下の図にある「1」の牛肉の部位の名前を書いて下さい。",
      options: ["かた","ともばら","リブロース"],
      correctAnswer: 2,
      image: "../../images/questions/food-service/Q1.png"
    },
    {
      text: "牛肉で煮込み料理に適した部位はどれですか。",
      options: ["サーロイン","かたばら","ともばら"],
      correctAnswer: 1,
      image: null
    },
    {
      text: "以下の図にある「1」の豚肉の部位の名前を書いて下さい。",
      options: ["そともも","ヒレ","ばら"],
      correctAnswer: 1,
      image: "../../images/questions/food-service/Q3.png"
    },
    {
      text: "豚肉でボンレスハムに適した部位はどれですか。",
      options: ["うちもも","うえもも","そともも"],
      correctAnswer: 0,
      image: null
    },
    {
      text: "以下の図にある「1」の鶏肉の部位の名前を書いて下さい。",
      options: ["てば","もも","むね"],
      correctAnswer: 2,
      image: "../../images/questions/food-service/Q5.png"
    },
    {
      text: "鶏肉でやきとりにした部位はどれですか。",
      options: ["てば","むね","ささみ"],
      correctAnswer: 2,
      image: null
    },
    {
      text: "以下の図にある「1」の魚の部位の名前を書いて下さい。",
      options: ["おひれ","そくせん","かま"],
      correctAnswer: 2,
      image: "../../images/questions/food-service/Q7.png"
    },
    {
      text: "秋の旬な魚として代表的なものはどれですか。",
      options: ["さんま","ぶり","あゆ"],
      correctAnswer: 0,
      image: null
    },
    {
      text: "根菜類はどれですか。",
      options: ["なす","たまねぎ","メロン","じゃがいも"],
      correctAnswer: 3,
      image: null
    },
    {
      text: "夏の旬な野菜として代表的なものはどれですか。",
      options: ["ゴーヤ","たけのこ","さつまいも","大根"],
      correctAnswer: 0,
      image: null
    },
    {
      text: "加工した魚の名称で丸魚と同じものは何ですか。",
      options: ["ドレス","フィーレ","セミドレス","ラウンド"],
      correctAnswer: 3,
      image: null
    },
    {
      text: "野菜の切り方で、みじん切りとは何ですか。",
      options: ["細長い野菜をうすい輪切りにします","大根などの皮をうすくむきます","細かくきざみます"],
      correctAnswer: 2,
      image: null
    },
    {
      text: "加熱調理で、炊く方法でできるものはどれですか。",
      options: ["赤飯","煮物","しゅうまい"],
      correctAnswer: 0,
      image: null
    },
    {
      text: "秋の旬な果物として代表的なものはどれですか。",
      options: ["かき","すいか","いちご"],
      correctAnswer: 0,
      image: null
    },
    {
      text: "非加熱調理で、和える方法でできるものはどれですか。",
      options: ["すし","マリネ","おにぎり"],
      correctAnswer: 1,
      image: null
    },
    {
      text: "この調理器の名称として正しいものはどれですか。",
      options: ["IHレンジ","中華ガスレンジ","ガスレンジ"],
      correctAnswer: 2,
      image: "../../images/questions/food-service/Q16.png"
    },
    {
      text: "これの名称として正しいものはどれですか。",
      options: ["ボール","ステンレスざる","ホテルパン"],
      correctAnswer: 2,
      image: "../../images/questions/food-service/Q17.png"
    },
    {
      text: "おにぎりの注文が入りました。鮭2つ、梅干2つ、ツナ2つです。1つのおにぎりにかかるのは2分半です。すべてにぎりを作るのに何分かかりますか。",
      options: ["10分","9分","12分","11分"],
      correctAnswer: 2,
      image: null
    },
    {
      text: "友達5人と居酒屋に行きました。お支払いは税込み43,000円でした。Aくんが8,000円のクーポンを出してくれました。残り4人で割り勘します。一人いくら支払えばいいでしょうか。",
      options: ["8,750円","7,750円","5,750円","6,250円"],
      correctAnswer: 0,
      image: null
    },
    {
      text: "600グラムのひき肉でハンバーグが3個作れます。予約で54個作る必要があります。ひき肉は全部で何グラム必要でしょうか。",
      options: ["10,200グラム","10,600グラム","10,400グラム","10,800グラム"],
      correctAnswer: 3,
      image: null
    },
    {
      text: "手洗いについて正しくないものはどれですか。",
      options: ["ハンドソープをしっかり使って手を洗う","消毒をすれば、手洗いはしなくてもいい","流水で洗う"],
      correctAnswer: 1,
      image: null
    },
    {
      text: "3人で15分で60個天ぷらが作れます。1人100個天ぷらを作るには何分かかりますか。",
      options: ["120分","90分","75分","85分"],
      correctAnswer: 2,
      image: null
    },
    {
      text: "10リットルの生ビール樽1つで中ジョッキが40杯できます。160杯必要な場合、生ビールの樽はいくつ注文しますか。",
      options: ["3樽","6樽","5樽","4樽"],
      correctAnswer: 3,
      image: null
    },
    {
      text: "飲食店の食中毒の主な発生要因として考えられるものはどれですか。",
      options: ["体調不良、手洗い不足など調理従事者として衛生管理を守らない","衛生管理を十分にしている業者から納品した原材料","食品をしっかり加熱する"],
      correctAnswer: 0,
      image: null
    },
    {
      text: "細菌性食中毒の主な原因物質で正しいのはどれですか。",
      options: ["アニサキス","ノロウイルス","サルモネラ菌"],
      correctAnswer: 2,
      image: null
    },
    {
      text: "食中毒を防ぐためにすることで正しいものはどれですか。",
      options: ["生の肉や魚を切ったまな板や包丁は細菌がついているので、サラダなどの野菜を切るときには気を付け、サラダに使う野菜は他のまな板や包丁を使用するか、きれいに洗い消毒してから使用する","食品は常温で保存し期限を過ぎたらしても食べないことが大切だ","サラダなども加熱する"],
      correctAnswer: 0,
      image: null
    },
    {
      text: "カンピロバクターに関する説明として正しくないものはどれですか。",
      options: ["牛や豚、鶏などの腸にいる細菌です。十分に加熱することで食中毒の危険は下がります","穀物などにいる細菌です。十分に加熱することで食中毒の危険は下がります","この細菌がついた肉を生で食べたり、加熱が不十分の場合、食中毒の危険は高まります"],
      correctAnswer: 1,
      image: null
    },
    {
      text: "黄色ブドウ球菌に関する説明として正しいものはどれですか。",
      options: ["調理する人の手や指に傷があってもなくても問題ありません","調理する人の手や指に傷があると、食品を汚染する可能性は低くなります","この食中毒を予防するために傷口がある場合、調理の際にはラップやお箸などを使用し、素手で触らないようにします"],
      correctAnswer: 2,
      image: null
    },
    {
      text: "ノロウイルスに関する説明として正しいものはどれですか。",
      options: ["ノロウイルスに汚染された二枚貝などを十分に加熱しないで食べると下痢や嘔吐の症状が出ます","毎年、11月から1月の間に流行する食中毒です","毎年、6月から8月の間に流行する食中毒です","この食中毒にならないためにも加熱したり、魚介類を真水で洗うことが大切だ"],
      correctAnswer: 0,
      image: null
    },
    {
      text: "以下の原材料で人に害をおよぼす細菌などが増えている可能性が考えられるものはどれですか。",
      options: ["保存方法が守られていないもの","消費期限が過ぎていなくて新しいもの","しっかり包装されているもの"],
      correctAnswer: 0,
      image: null
    },
    {
      text: "廃棄物の処理について正しいものはどれですか。",
      options: ["生ごみは蓋つきの専用容器に入れます","生ごみは蓋なしの専用容器に入れます","ごみは種類別にわけてすてなくてもいいです"],
      correctAnswer: 0,
      image: null
    },
    {
      text: "部屋の温度を確認する道具は以下のどれですか。",
      options: ["デジタル中心温度計","温度計（冷蔵庫／冷凍庫用）","温度計"],
      correctAnswer: 2,
      image: null
    },
    {
      text: "交差汚染について正しいものはどれですか。",
      options: ["生肉や生の魚介類についている細菌などが他の食材につくこと","野菜や果物についている細菌などが他の食材につくこと","火を通した肉や魚介類についている細菌などが他の食材につくこと"],
      correctAnswer: 0,
      image: null
    },
    {
      text: "調理道具の洗浄で正しくないものはどれですか。",
      options: ["熱湯、塩素系殺菌剤、アルコールなどで消毒する","水道水で水洗いし、目に見える汚れは取り除く","よく洗ったら、そのまま濡れたまま使ってもいい"],
      correctAnswer: 2,
      image: null
    },
    {
      text: "職場の環境維持を目的としたSから始まる5つの言葉のうち、当てはまらないものはどれですか。",
      options: ["せいり","せいとん","せいけつ","せいそう","せいかつ"],
      correctAnswer: 4,
      image: null
    },
    {
      text: "ベジタリアンやヴィーガンについて正しいものはどれですか。",
      options: ["ヴィーガンは肉や魚だけでなく、卵や牛乳も食べない人のことをいいます","ベジタリアンは肉や魚だけでなく、卵や牛乳も食べない人のことをいいます","ヴィーガンは肉や魚だけでなく、卵や牛乳も食べる人のことをいいます"],
      correctAnswer: 0,
      image: null
    },
    {
      text: "ハサップについて、正しくないものはどれですか。",
      options: ["Haccpは日本語で危害要因分析重要管理点である","飲食店ではたくさんの料理を作るため、食品を５つのグループに分けている","原材料の入荷から製造までの工程において、安全性をチェックしていく管理方法である"],
      correctAnswer: 1,
      image: null
    },
    {
      text: "以下はハサップの考え方を取り入れた衛生管理方法です。加熱と冷却をくり返すものはどれですか。",
      options: ["シチュー","ステーキ","サラダ"],
      correctAnswer: 0,
      image: null
    },
    {
      text: "料理の品質について書かれています。正しいものはどれですか。",
      options: ["スピードが大事です。早く提供できるなら、味や分量、盛り付けは関係ありません","スピードも大事ですが、味や分量、盛り付けは毎回均一にお客様に満足していただけるものを提供します","遅くてもいいです。味や分量、盛り付けは毎回均一にお客様に満足していただけるものを提供します"],
      correctAnswer: 1,
      image: null
    },
    {
      text: "お店の雰囲気について正しいものはどれですか。",
      options: ["スタッフが忙しそうにしていますが、気の利いたサービスを提供します","レストランが忙しい時でもゆっくりとサービスを提供し、お客様を待たせてもいいです","忙しいときにはスタッフが助け合い、お客様を待たせない、気の利いたサービスを提供します"],
      correctAnswer: 2,
      image: null
    },
    {
      text: "食のマナーについて正しいものはどれですか。",
      options: ["国やその土地によって、食事の習慣やマナーは違います","どこでも食事の習慣やマナーは同じです","国やその土地によって、食事の習慣やマナーは違いますが、自分らしく食事することが大事です"],
      correctAnswer: 2,
      image: null
    },
    {
      text: "洋食時、食事が終了したときのサインで正しいものはどれですか。",
      options: ["ナイフとフォークが八の字に置かれたとき","ナイフとフォークが２本そろって斜めに置かれたとき","お客様が手を上げたとき"],
      correctAnswer: 1,
      image: null
    },
    {
      text: "配慮の必要なお客様についての対応で正しいものはどれですか。",
      options: ["何か手伝えることがないか、お客様が危なくないか、気にかけながら仕事をします","いつも通り、仕事をします","自分が思ったとおり、お手伝いします"],
      correctAnswer: 0,
      image: null
    },
    {
      text: "オーダーを受けたとき、使う言葉として正しいものはどれですか。",
      options: ["了解しました","わかりました","かしこまりました"],
      correctAnswer: 2,
      image: null
    },
    {
      text: "食物アレルギーについての対応で適切なものはどれですか。",
      options: ["メニューにアレルギー反応を起こしやすい食物の名前を表示する必要があります","メニューに表示する必要はありませんが、お客様に聞かれたときに答えられるようにしておくことはいいことです","メニューに表示する必要はありませんし、お客様に聞かれたときも答える必要はありません"],
      correctAnswer: 0,
      image: null
    },
    {
      text: "電子マネーについて正しいものはどれですか。",
      options: ["使う前にチャージしておきます","商業系はSuicaです","交通系はWAON、nanacoなどがあります"],
      correctAnswer: 0,
      image: null
    },
    {
      text: "閉店作業について正しいものはどれですか。",
      options: ["お客様が店内にいても閉店時間になったら閉店作業をします","閉店時間になって、お客様が店内にいないことを確認してから閉店作業をします","閉店時間前でもお客様が店内にいなかったら閉店作業をします"],
      correctAnswer: 1,
      image: null
    },
    {
      text: "気分が悪いお客様への対応で正しくないものはどれですか。",
      options: ["お水を提供したり、静かな場所へ案内する","何かできることがないか聞く","訴えがなければ何もしない"],
      correctAnswer: 2,
      image: null
    },
    {
      text: "一般的に酸味を感じるものはどれですか。",
      options: ["梅干","しょうゆ","かつおぶし"],
      correctAnswer: 0,
      image: null
    },
    {
      text: "清掃について、正しいものはどれですか。",
      options: ["お客様目線で行うことも大事です","スタッフ目線で行うことが大事です","お客様目線で行うことが大事です"],
      correctAnswer: 2,
      image: null
    },
    {
      text: "飲酒運転について正しいものはどれですか。",
      options: ["自動車を運転することがわかっている人にはお酒を提供してはいけません","自動車だけではなく自転車を運転することがわかっている人にはお酒を提供してはいけません","自転車を運転することがわかっている人にはお酒を提供してはいけません"],
      correctAnswer: 1,
      image: null
    },
    {
      text: "キャッシュレス決済について正しくないものはどれですか。",
      options: ["キャッシュレス決済は現金以外で支払う方法です","主なキャッシュレス決済は４種類あります","キャッシュレス決済は現金で支払う方法です"],
      correctAnswer: 2,
      image: null
    }
  ]
};

// Make it available globally
window.testData = foodServiceData;  // Fixed variable name

// Initialize test when everything is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, testData:', window.testData);
  console.log('MockTest available:', window.MockTest);
  
  setTimeout(() => {
    const loadingContainer = document.getElementById('loadingContainer');
    const testContainer = document.getElementById('testContainer');
    
    if (loadingContainer && testContainer) {
      loadingContainer.style.display = 'none';
      testContainer.style.display = 'block';
      
      // Initialize the test
      if (window.testData && window.MockTest) {
        console.log('Initializing MockTest...');
        new MockTest(window.testData);
      } else {
        console.error('Missing required components:', {
          testData: !!window.testData,
          MockTest: !!window.MockTest
        });
        
        // Show error message to user
        if (loadingContainer) {
          loadingContainer.innerHTML = `
            <div class="error-container">
              <div class="error-icon">
                <span class="material-icons">error</span>
              </div>
              <h2>Failed to Load Test</h2>
              <p>There was an error loading the Food Service Test. Please check the console for details.</p>
              <div class="error-actions">
                <a href="../../index.html" class="action-btn btn-primary">
                  <span class="material-icons">home</span>
                  Back to Home
                </a>
                <button class="action-btn btn-secondary" onclick="window.location.reload()">
                  <span class="material-icons">refresh</span>
                  Try Again
                </button>
              </div>
            </div>
          `;
        }
      }
    }
  }, 1000);
});