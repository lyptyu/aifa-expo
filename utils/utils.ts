import AsyncStorage from '@react-native-async-storage/async-storage';

export function getCdnImageUrl (path: string, baseUrl = 'images/aifa') {
  return `https://cdn.aifa.chat/${baseUrl}/${path}`
}


function S4 () {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
}

export function guid () {
  return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4()
}

// 获取认证参数的工具函数（非hook版本）
export async function getAuthParams(): Promise<{ uguid?: string; clientid: string } | { clientid: string }> {
  try {
    const uguid = await AsyncStorage.getItem('uguid');
    const clientid = await AsyncStorage.getItem('clientid');
    
    if (uguid && clientid) {
      return { uguid, clientid };
    } else {
      return { clientid: clientid || '' };
    }
  } catch (error) {
    console.error('获取认证参数失败:', error);
    return { clientid: '' };
  }
}