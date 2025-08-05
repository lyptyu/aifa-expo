import NetInfo from "@react-native-community/netinfo";
import TencentCloudChat from "@tencentcloud/chat";
import Push from "@tencentcloud/react-native-push";
import TIMUploadPlugin from "tim-upload-plugin";
// ==================== SDK 配置和初始化 ====================

/**
 * SDK 配置选项
 */
const SDK_CONFIG = {
  SDKAppID: 1600099722, // 腾讯云即时通信 IM 应用的 SDKAppID
};

/**
 * 创建并配置 SDK 实例
 * TencentCloudChat.create() 方法对于同一个 SDKAppID 只会返回同一份实例
 */
const chat = TencentCloudChat.create(SDK_CONFIG);

// 设置日志级别 (0: 普通级别，日志量较多，接入时建议使用)
chat.setLogLevel(1);

// 注册腾讯云即时通信富媒体资源上传插件
chat.registerPlugin({ "tim-upload-plugin": TIMUploadPlugin });

// 注册网络监听插件
chat.registerPlugin({ "chat-network-monitor": NetInfo });

// ==================== 未读消息计数 ====================

// 全局未读消息计数
let unreadMessageCount = 0;
let chatContextSetter: ((count: number) => void) | null = null;

/**
 * 设置ChatContext的setter函数
 * @param setter ChatContext中的setUnreadMessageCount函数
 */
export const setChatContextSetter = (setter: (count: number) => void): void => {
  chatContextSetter = setter;
};

/**
 * 获取未读消息数量
 * @returns {number} 未读消息数量
 */
export const getUnreadMessageCount = (): number => {
  return unreadMessageCount;
};

/**
 * 重置未读消息数量
 */
export const resetUnreadMessageCount = (): void => {
  unreadMessageCount = 0;
  if (chatContextSetter) {
    chatContextSetter(0);
  }
};

/**
 * 更新未读消息数量
 * @param count 新的未读消息数量
 */
const updateUnreadMessageCount = (count: number): void => {
  unreadMessageCount = count;
  if (chatContextSetter) {
    chatContextSetter(count);
  }
};

// ==================== 事件监听器 ====================

/**
 * SDK就绪事件监听器
 */
const onSdkReady = function (event: any) {
  console.log("SDK已就绪");
};

/**
 * 消息接收事件监听器
 * 当收到新消息时触发，更新未读消息计数
 */
const onMessageReceived = function (event: any) {
  console.log("收到新消息:", event.data);
};

/**
 * 会话列表更新事件监听器
 * 用于同步未读消息数量
 */
const onConversationListUpdated = function (event: any) {
  // 从会话列表中计算总未读数
  const conversations = event.data;
  let totalUnread = 0;
  conversations.forEach((conversation: any) => {
    totalUnread += conversation.unreadCount || 0;
  });
  updateUnreadMessageCount(totalUnread);
  console.log("会话列表更新，未读消息数量:", totalUnread);
};

// ==================== 注册事件监听器 ====================

// 只注册必要的事件监听器
chat.on(TencentCloudChat.EVENT.SDK_READY, onSdkReady);
chat.on(TencentCloudChat.EVENT.MESSAGE_RECEIVED, onMessageReceived);
chat.on(
  TencentCloudChat.EVENT.CONVERSATION_LIST_UPDATED,
  onConversationListUpdated
);

// ==================== 用户认证方法 ====================

/**
 * 用户登录配置
 */
const LOGIN_CONFIG = {
  userID: "aifa2",
  userSig:
    "eJwtzF0LgjAYhuH-8h6HbNNtTehIJIKiqEDpbLSpbyMZJtIH-feWevhcNzwfOG9P0WA7SIFFBBbjRmPbHiscWWOl2Rwexmnv0UBKBSFEKcnYVOzTY2eDc85ZSJP2eP*b5EksEkL5-IJ1*O3pYb8rG70hNn8LL42Ij3VxKW5X-1KuNSL3pRts1qyXK-j*AAROMV0_",
};

/**
 * 用户登录方法
 * @returns Promise<void>
 */
export const chatLogin = async (): Promise<void> => {
  try {
    console.log("开始登录聊天服务...");
    const imResponse = await chat.login(LOGIN_CONFIG);

    if (imResponse.data.repeatLogin === true) {
      // 标识账号已登录，本次登录操作为重复登录
      console.log("重复登录:", imResponse.data.errorInfo);
    } else {
      console.log("登录成功");
      Push.setRegistrationID(LOGIN_CONFIG.userID, () => {
        console.log("推送ID绑定成功", LOGIN_CONFIG.userID);
      });
    }
  } catch (imError) {
    // 登录失败的相关信息
    console.error("登录失败:", imError);
    throw imError;
  }
};

/**
 * 用户登出方法
 * 销毁 SDK 实例，断开与腾讯云的连接
 */
export const chatLogout = (): void => {
  try {
    console.log("开始登出聊天服务...");
    chat.destroy();
    console.log("登出成功");
  } catch (error) {
    console.error("登出失败:", error);
  }
};

// ==================== SDK实例导出 ====================

/**
 * 导出TencentCloudChat实例供其他模块使用
 */
export { chat };

/**
 * 初始化聊天功能
 * @param setUnreadCount ChatContext中的setUnreadMessageCount函数
 */
export const initializeChat = (
  setUnreadCount: (count: number) => void
): void => {
  setChatContextSetter(setUnreadCount);
};

// ==================== 自动初始化 ====================

// 自动执行登录（可根据需要注释掉）
chatLogin().catch((error) => {
  console.error("自动登录失败:", error);
});
