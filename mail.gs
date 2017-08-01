
//プログラム本体
function noticeChatworkMessage(){
 
  // 必要な情報を設定
  var CHATWORK_TOKEN = 'チャットワークのAPIトークン'; //チャットワークのAPIトークン
  var MAIL_TO = 'Eメールアドレス'; //通知を受けるEメールアドレス
  var ROOMS = { // 複数のトークルームのIDと名称を指定。
  'トークルームID①':'トークルーム名①',
  'トークルームID②':'トークルーム名②',
  'トークルームID③':'トークルーム名③',
  'トークルームID④':'トークルーム名④'
  };
  var MY_ID = '自分のID'; //個人のチャットワークID。誰宛のメッセージがあった場合に通知するかを規定。
  var MY_NAME = '自分の名前'; //チャットワーク上の自分の名前を除く
   
  var params = {
    headers : {"X-ChatWorkToken" : CHATWORK_TOKEN},
    method : "get"
  };
  // 複数のルームIDに対応するため、ROOMSに対してループ処理を実行
  for (var ROOM_ID in ROOMS) { // ROOM_IDは連想配列ROOMSのキー要素
    var ROOM_NAME = ROOMS[ROOM_ID];
    var url = "https://api.chatwork.com/v1/rooms/" + ROOM_ID + "/messages?force=0"; //指定のグループチャットからメッセージを取得
    var strRespons = UrlFetchApp.fetch(url, params); //チャットワークAPIエンドポイントからレスポンスを取得
     
    if (strRespons != "") { //メッセージが無い時は実行しない（GAS実行時のエラーを防ぐため）
      var json = JSON.parse(strRespons.getContentText()); //文字列をJSON形式として解析しJSONオブジェクトとして返す
      for each(var obj in json){ //JSONオブジェクトに対して繰り返し実行
        var mBody = obj.body; //メッセージの内容
        var mName = obj.account.name; //発信者の名前
        var mTime = String(obj.send_time); //送られた時間
        var sTime = String(mTime - 1200); //送られた時間から10分前
        Logger.log(obj);
        Logger.log(mBody);
        Logger.log(String(mTime));
        Logger.log(String(sTime));
         
        if(obj.body.indexOf(MY_ID) != -1 && mTime > sTime && mName != MY_NAME) { //自分宛のメッセージがある時のみ&10分以内に送られたメッセージの場合処理を行なう
          //メールを送付
          var ROOM_URL = 'https://www.chatwork.com/#!rid'+ROOM_ID; //チャットルームのURL
          var SUBJECT = "【チャットワーク】" + mName + "からのメッセージ"; // メールの件名
          var BODY = "【" + ROOM_NAME + "】\n" + mName + "より：\n------------------\n" + mBody + "\n------------------\n" + ROOM_URL; // メール本文
          MailApp.sendEmail(
          {
          to: MAIL_TO,
          replyTo:"info@chat-work.com",
          subject: SUBJECT,
          body: BODY,
          name: "チャットワーク"
          });
        }
       }
    } 
  }
}