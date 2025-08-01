# 认证参数获取方法使用指南

本项目提供了两种方式来获取认证参数，根据不同的使用场景选择合适的方法。

## 1. useAuthParams Hook（推荐在React组件中使用）

在React组件中使用的hook版本：

```typescript
import { useAuthParams } from '@/hooks/useApi';

function MyComponent() {
  const authParams = useAuthParams();
  
  // authParams 的类型：
  // 如果有uguid: { uguid: string, clientid: string }
  // 如果没有uguid: { clientid: string }
  
  console.log('认证参数:', authParams);
  
  return (
    <View>
      <Text>认证信息: {JSON.stringify(authParams)}</Text>
    </View>
  );
}
```

## 2. getAuthParams 工具函数（在非React环境中使用）

在API调用、工具函数等非React环境中使用：

```typescript
import { getAuthParams } from '@/utils/utils';

// 在API调用中使用
export const callSomeApi = async () => {
  const authParams = await getAuthParams();
  
  const response = await fetch('/api/some-endpoint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...authParams,
      // 其他参数
    }),
  });
  
  return response.json();
};
```

## 返回值说明

两个方法都会根据当前的认证状态返回不同的格式：

- **有uguid时**: `{ uguid: string, clientid: string }`
- **没有uguid时**: `{ clientid: string }`

这样设计的好处是：
1. 如果用户已登录（有uguid），接口可以同时获得用户ID和客户端ID
2. 如果用户未登录（只有clientid），接口仍然可以正常工作
3. 调用方不需要关心具体的认证状态，只需要展开返回的对象即可

## 使用建议

- 在React组件中使用 `useAuthParams`
- 在API函数、工具函数中使用 `getAuthParams`
- 调用接口时直接展开返回的对象：`...authParams`