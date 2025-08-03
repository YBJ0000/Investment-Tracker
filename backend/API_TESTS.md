# API 测试指令

这个文档包含了所有 API 端点的 curl 测试指令。

## 前提条件

确保服务器正在运行：
```bash
node server.js
```

服务器默认运行在 `http://localhost:3000`

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

### 获取所有投资记录

```bash
curl -X GET http://localhost:3000/api/investments
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

### 添加新的投资记录

```bash
curl -X POST http://localhost:3000/api/investments \
  -H "Content-Type: application/json" \
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

### 添加更多投资记录示例

```bash
# 添加基金投资
curl -X POST http://localhost:3000/api/investments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Vanguard 500",
    "type": "fund",
    "amount": 5000,
    "currency": "USD"
  }'

# 添加加密货币投资
curl -X POST http://localhost:3000/api/investments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bitcoin",
    "type": "crypto",
    "amount": 0.5,
    "currency": "BTC"
  }'

# 添加债券投资
curl -X POST http://localhost:3000/api/investments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "US Treasury Bond",
    "type": "bond",
    "amount": 3000,
    "currency": "USD"
  }'
```

## PUT 请求

### 更新投资记录

```bash
curl -X PUT http://localhost:3000/api/investments/2 \
  -H "Content-Type: application/json" \
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

### 更新不同ID的投资记录

```bash
# 更新ID为3的投资
curl -X PUT http://localhost:3000/api/investments/3 \
  -H "Content-Type: application/json" \
  -d '{
    "id": 3,
    "name": "Nvidia Updated",
    "type": "stock",
    "amount": 3500,
    "currency": "USD"
  }'
```

## DELETE 请求

### 删除投资记录

```bash
curl -X DELETE http://localhost:3000/api/investments/2
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

### 删除不存在的投资记录

```bash
curl -X DELETE http://localhost:3000/api/investments/999
```

**预期响应：**
```json
{
  "error": "Investment does not exist"
}
```

## 测试完整流程

1. **首先获取所有投资记录：**
```bash
curl -X GET http://localhost:3000/api/investments
```

2. **添加新投资：**
```bash
curl -X POST http://localhost:3000/api/investments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Microsoft",
    "type": "stock",
    "amount": 1500,
    "currency": "USD"
  }'
```

3. **更新投资记录：**
```bash
curl -X PUT http://localhost:3000/api/investments/4 \
  -H "Content-Type: application/json" \
  -d '{
    "id": 4,
    "name": "Microsoft Updated",
    "type": "stock",
    "amount": 2000,
    "currency": "USD"
  }'
```

4. **删除投资记录：**
```bash
curl -X DELETE http://localhost:3000/api/investments/4
```

5. **再次获取所有投资记录验证：**
```bash
curl -X GET http://localhost:3000/api/investments
```

## 错误处理测试

### 测试无效的 JSON 数据

```bash
curl -X POST http://localhost:3000/api/investments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Invalid JSON
  }'
```

### 测试缺少必需字段

```bash
curl -X POST http://localhost:3000/api/investments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Incomplete Data"
  }'
```

### 测试更新不存在的投资

```bash
curl -X PUT http://localhost:3000/api/investments/999 \
  -H "Content-Type: application/json" \
  -d '{
    "id": 999,
    "name": "Non-existent",
    "type": "stock",
    "amount": 1000,
    "currency": "USD"
  }'
```

### 测试删除不存在的投资

```bash
curl -X DELETE http://localhost:3000/api/investments/999
```

### 测试无效的ID格式

```bash
curl -X GET http://localhost:3000/api/investments/abc
curl -X PUT http://localhost:3000/api/investments/abc \
  -H "Content-Type: application/json" \
  -d '{"id":"abc","name":"Test"}'
curl -X DELETE http://localhost:3000/api/investments/abc
```

## 注意事项

1. 确保服务器正在运行
2. 检查 `db.json` 文件是否正确更新
3. 如果遇到错误，检查控制台输出的错误信息
4. 数据会持久化存储在 `db.json` 文件中
5. PUT 请求需要提供完整的投资对象（包括ID）
6. DELETE 请求只需要提供ID，不需要请求体
7. 所有ID参数都会被转换为数字进行比较 