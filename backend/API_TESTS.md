# API 测试指令

这个文档包含了所有 API 端点的 curl 测试指令。

## 前提条件

确保服务器正在运行：
```bash
node server.js
```

服务器默认运行在 `http://localhost:3000`

**重要：** 所有投资相关的API现在都需要身份验证token！

## 用户认证

### 注册新用户

```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

**预期响应：**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "testuser"
  }
}
```

### 用户登录

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

**预期响应：**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "testuser"
  }
}
```

**重要：** 复制返回的token，在后续的投资API测试中使用！

### 测试无效登录

```bash
# 错误的用户名
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "wronguser",
    "password": "password123"
  }'

# 错误的密码
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "wrongpassword"
  }'
```

### 测试重复注册

```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

**预期响应：**
```json
{
  "error": "Username already exists"
}
```

## GET 请求

### 获取所有投资记录（需要token）

```bash
curl -X GET http://localhost:3000/api/investments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**预期响应：**
```json
[
  {
    "id": 1,
    "name": "Apple",
    "type": "stock",
    "amount": 1000,
    "currency": "USD"
  }
]
```

## POST 请求

### 添加新的投资记录（需要token）

```bash
curl -X POST http://localhost:3000/api/investments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Amazon",
    "type": "stock",
    "amount": 1500,
    "currency": "USD"
  }'
```

**预期响应：**
```json
{
  "id": 4,
  "name": "Amazon",
  "type": "stock",
  "amount": 1500,
  "currency": "USD"
}
```

### 添加更多投资记录示例（需要token）

```bash
# 添加基金投资
curl -X POST http://localhost:3000/api/investments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Vanguard 500",
    "type": "fund",
    "amount": 5000,
    "currency": "USD"
  }'

# 添加加密货币投资
curl -X POST http://localhost:3000/api/investments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Bitcoin",
    "type": "crypto",
    "amount": 0.5,
    "currency": "BTC"
  }'

# 添加债券投资
curl -X POST http://localhost:3000/api/investments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "US Treasury Bond",
    "type": "bond",
    "amount": 3000,
    "currency": "USD"
  }'
```

## PUT 请求

### 更新投资记录（需要token）

```bash
curl -X PUT http://localhost:3000/api/investments/2 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "id": 2,
    "name": "Tesla Updated",
    "type": "stock",
    "amount": 2500,
    "currency": "USD"
  }'
```

**预期响应：**
```json
{
  "message": "Investment has been updated",
  "updatedInvestment": {
    "id": 2,
    "name": "Tesla Updated",
    "type": "stock",
    "amount": 2500,
    "currency": "USD"
  }
}
```

### 更新不同ID的投资记录（需要token）

```bash
# 更新ID为3的投资
curl -X PUT http://localhost:3000/api/investments/3 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "id": 3,
    "name": "Nvidia Updated",
    "type": "stock",
    "amount": 3500,
    "currency": "USD"
  }'
```

## DELETE 请求

### 删除投资记录（需要token）

```bash
curl -X DELETE http://localhost:3000/api/investments/2 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**预期响应：**
```json
{
  "message": "Investment has been deleted",
  "deletedInvestment": {
    "id": 2,
    "name": "Tesla",
    "type": "stock",
    "amount": 2000,
    "currency": "USD"
  }
}
```

### 删除不存在的投资记录（需要token）

```bash
curl -X DELETE http://localhost:3000/api/investments/999 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**预期响应：**
```json
{
  "error": "Investment does not exist"
}
```

## 测试完整流程

1. **首先登录获取token：**
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

2. **获取所有投资记录：**
```bash
curl -X GET http://localhost:3000/api/investments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

3. **添加新投资：**
```bash
curl -X POST http://localhost:3000/api/investments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Microsoft",
    "type": "stock",
    "amount": 1500,
    "currency": "USD"
  }'
```

4. **更新投资记录：**
```bash
curl -X PUT http://localhost:3000/api/investments/4 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "id": 4,
    "name": "Microsoft Updated",
    "type": "stock",
    "amount": 2000,
    "currency": "USD"
  }'
```

5. **删除投资记录：**
```bash
curl -X DELETE http://localhost:3000/api/investments/4 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

6. **再次获取所有投资记录验证：**
```bash
curl -X GET http://localhost:3000/api/investments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 错误处理测试

### 测试无效的 JSON 数据（需要token）

```bash
curl -X POST http://localhost:3000/api/investments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Invalid JSON
  }'
```

### 测试缺少必需字段（需要token）

```bash
curl -X POST http://localhost:3000/api/investments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Incomplete Data"
  }'
```

### 测试更新不存在的投资（需要token）

```bash
curl -X PUT http://localhost:3000/api/investments/999 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "id": 999,
    "name": "Non-existent",
    "type": "stock",
    "amount": 1000,
    "currency": "USD"
  }'
```

### 测试删除不存在的投资（需要token）

```bash
curl -X DELETE http://localhost:3000/api/investments/999 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 测试无效的ID格式（需要token）

```bash
curl -X GET http://localhost:3000/api/investments/abc \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
curl -X PUT http://localhost:3000/api/investments/abc \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"id":"abc","name":"Test"}'
curl -X DELETE http://localhost:3000/api/investments/abc \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 测试无token访问（应该返回401错误）

```bash
# 这些请求应该都失败
curl -X GET http://localhost:3000/api/investments
curl -X POST http://localhost:3000/api/investments \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","type":"stock","amount":1000,"currency":"USD"}'
curl -X PUT http://localhost:3000/api/investments/1 \
  -H "Content-Type: application/json" \
  -d '{"id":1,"name":"Test","type":"stock","amount":1000,"currency":"USD"}'
curl -X DELETE http://localhost:3000/api/investments/1
```

## 注意事项

1. 确保服务器正在运行
2. **所有投资API现在都需要有效的JWT token**
3. **记得将 `YOUR_TOKEN_HERE` 替换为实际的token值**
4. 检查 `db.json` 文件是否正确更新
5. 如果遇到错误，检查控制台输出的错误信息
6. 数据会持久化存储在 `db.json` 文件中
7. PUT 请求需要提供完整的投资对象（包括ID）
8. DELETE 请求只需要提供ID和token，不需要请求体
9. 所有ID参数都会被转换为数字进行比较
10. **Token在24小时后过期，需要重新登录**