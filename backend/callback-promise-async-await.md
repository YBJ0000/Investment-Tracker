# Callback、Promise、Async/Await 的区别

本文档从 `server.js` 中提取代码示例，说明三种异步编程方式的区别。

## 1. Callback（回调函数）

**特点**：将函数作为参数传递给另一个函数，在异步操作完成后执行。

### 示例 1：JWT 验证（第30行）

```javascript
jwt.verify(token, JWT_SECRET, (err, user) => {
  if (err) {
    return res.status(403).json({ error: 'Invalid or expired token' })
  }
  req.user = user
  next()
})
```

**说明**：
- `jwt.verify` 接收一个回调函数作为第三个参数
- 当验证完成时，回调函数会被调用
- 第一个参数 `err` 表示错误（如果有），第二个参数 `user` 表示结果

### 示例 2：服务器启动（第257行）

```javascript
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
```

**说明**：
- `app.listen` 接收一个回调函数
- 当服务器成功启动后，回调函数会被执行

**Callback 的缺点**：
- 嵌套过深时会出现"回调地狱"（Callback Hell）
- 错误处理分散，难以统一管理
- 代码可读性差

---

## 2. Promise（承诺）

**特点**：表示一个异步操作的最终完成（或失败）及其结果值。Promise 有三种状态：pending（进行中）、fulfilled（已成功）、rejected（已失败）。

### 示例：文件读取（第49行）

```javascript
// 从 'fs' 模块导入 promises API
import { promises as fs } from 'fs'

// 使用 Promise 方式读取文件
const data = await fs.readFile(dbPath, 'utf-8')
```

**说明**：
- `fs.readFile` 返回一个 Promise 对象
- 可以使用 `.then()` 和 `.catch()` 处理结果和错误
- 也可以使用 `await` 关键字（见下一节）

**Promise 的链式调用示例**（等价写法）：

```javascript
fs.readFile(dbPath, 'utf-8')
  .then(data => {
    const parsedData = JSON.parse(data)
    // 处理数据...
  })
  .catch(error => {
    console.error('Failed to read file.', error)
  })
```

**Promise 的优点**：
- 避免了回调地狱
- 可以使用链式调用 `.then().then().catch()`
- 错误处理更集中

---

## 3. Async/Await（异步/等待）

**特点**：基于 Promise 的语法糖，让异步代码看起来像同步代码，提高可读性。

### 示例 1：用户注册（第40-85行）

```javascript
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body

    // 使用 await 等待 Promise 完成
    const data = await fs.readFile(dbPath, 'utf-8')
    const parsedData = JSON.parse(data)

    // 检查用户是否已存在
    const existingUser = parsedData.users.find(user => user.username === username)
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' })
    }

    // 使用 await 等待密码哈希完成
    const hashedPassword = await bcrypt.hash(password, 10)

    // 创建新用户
    const newUser = {
      id: parsedData.users.length + 1,
      username,
      password: hashedPassword
    }

    parsedData.users.push(newUser)

    // 使用 await 等待文件写入完成
    await fs.writeFile(dbPath, JSON.stringify(parsedData, null, 2))

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username
      }
    })
  } catch (error) {
    // 统一的错误处理
    console.error('Failed to register user.', error)
    res.status(500).json({ error: 'Failed to register user' })
  }
})
```

### 示例 2：用户登录（第88-132行）

```javascript
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' })
    }

    // await 等待文件读取
    const data = await fs.readFile(dbPath, 'utf-8')
    const parsedData = JSON.parse(data)

    const user = parsedData.users.find(user => user.username === username)
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }

    // await 等待密码验证
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }

    // 生成 token（同步操作，不需要 await）
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username
      }
    })
  } catch (error) {
    console.error('Failed to login.', error)
    res.status(500).json({ error: 'Failed to login' })
  }
})
```

**Async/Await 的关键点**：
- `async` 关键字：声明一个异步函数
- `await` 关键字：等待 Promise 完成，暂停函数执行直到 Promise resolve 或 reject
- `try/catch`：统一的错误处理机制

**Async/Await 的优点**：
- 代码看起来像同步代码，可读性最好
- 错误处理更直观（使用 try/catch）
- 避免了回调地狱和 Promise 链式调用的复杂性

---

## 对比总结

| 特性 | Callback | Promise | Async/Await |
|------|----------|---------|-------------|
| **可读性** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **错误处理** | 分散 | 集中（.catch()） | 集中（try/catch） |
| **嵌套问题** | 回调地狱 | 链式调用 | 扁平化 |
| **学习曲线** | 简单 | 中等 | 简单（如果熟悉同步代码） |
| **兼容性** | 所有版本 | ES6+ | ES2017+ |

## 实际应用建议

在你的 `server.js` 中：

1. **Callback**：适用于简单的回调场景（如 `jwt.verify`、`app.listen`）
2. **Promise**：当你需要链式调用多个异步操作时
3. **Async/Await**：**推荐用于路由处理器**，因为：
   - 需要顺序执行多个异步操作（读取文件 → 验证 → 写入文件）
   - 需要清晰的错误处理
   - 代码可读性最重要

---

## 转换示例

同一个操作，三种写法的对比：

### Callback 写法
```javascript
fs.readFile(dbPath, 'utf-8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const parsedData = JSON.parse(data)
  // 处理数据...
})
```

### Promise 写法
```javascript
fs.readFile(dbPath, 'utf-8')
  .then(data => {
    const parsedData = JSON.parse(data)
    // 处理数据...
  })
  .catch(err => {
    console.error(err)
  })
```

### Async/Await 写法（你当前使用的）
```javascript
try {
  const data = await fs.readFile(dbPath, 'utf-8')
  const parsedData = JSON.parse(data)
  // 处理数据...
} catch (err) {
  console.error(err)
}
```

---

**总结**：你的代码主要使用了 **Async/Await** 模式，这是现代 Node.js 开发的最佳实践，代码清晰、易维护！
