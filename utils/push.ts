import Push from '@tencentcloud/react-native-push';

const SDKAppID = 1600099722; // 您的 SDKAppID
const appKey = 'w6fm8VcNkPQgnOSXKCWTJ9ZrySvUMAHRhsQaoVrW6PTUaA6B9UCRLos1HmP3HKkg'; // 客户端密钥

if (Push) {
  // 如果您需要与 Chat 的登录 userID 打通（即向此 userID 推送消息），请使用 setRegistrationID 接口
  // Push.setRegistrationID(userID, () => {
      // console.log('setRegistrationID ok', userID);
  // });
  
  Push.registerPush(SDKAppID, appKey, (data) => {
      console.log('registerPush ok', data);
      Push.getRegistrationID((registrationID) => {
        console.log('getRegistrationID ok', registrationID);
      });
    }, (errCode, errMsg) => {
      console.error('registerPush failed', errCode, errMsg);
    }
  );
  
  
  // 监听通知栏点击事件，获取推送扩展信息
  Push.addPushListener(Push.EVENT.NOTIFICATION_CLICKED, (res) => {
    // res 为推送扩展信息
    console.log('notification clicked', res);
  });
  
  // 监听在线推送
  Push.addPushListener(Push.EVENT.MESSAGE_RECEIVED, (res) => {
    // res 为消息内容
    console.log('message received', res);
  });

  // 监听在线推送被撤回
  Push.addPushListener(Push.EVENT.MESSAGE_REVOKED, (res) => {
    // res 为被撤回的消息 ID
    console.log('message revoked', res);
  });
}