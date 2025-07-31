# API 测试指令

这个文档包含了所有 API 端点的 curl 测试指令。

## 前提条件

确保服务器正在运行：
```bash
node server.js
```

服务器默认运行在 `http://localhost:3000`

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

3. **再次获取所有投资记录验证：**
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

## 注意事项

1. 确保服务器正在运行
2. 检查 `db.json` 文件是否正确更新
3. 如果遇到错误，检查控制台输出的错误信息
4. 数据会持久化存储在 `db.json` 文件中 