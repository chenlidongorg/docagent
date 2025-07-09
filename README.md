### `README.md`
```markdown
# Document Agent - 文档生成智能体

基于 Cloudflare Workers 的文档生成智能体，支持多种文档格式生成。

## 功能特性

- 📄 支持多种文档格式生成 (PPT, PDF, Word, Excel 等)
- 🌐 多语言支持 (中文/英文)
- 📱 响应式设计，支持移动端
- 🔐 访问权限控制
- 📊 任务进度跟踪
- 💾 文件存储与管理

## 部署说明

### 1. 环境变量配置

在 Cloudflare Workers 控制台设置以下环境变量：

```bash
PPT_AI_AGENT_API_KEY=your-api-key
ACCESS_KEY=your-access-key
BUCKET_NAME=your-bucket-name
R2_ACCESS_KEY=your-r2-access-key
R2_SECRET_KEY=your-r2-secret-key
R2_ENDPOINT=your-r2-endpoint
```

### 2. 数据库配置

创建 D1 数据库并执行以下 SQL：

```sql
CREATE TABLE pptaiagent (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    taskid TEXT NOT NULL,
    userid TEXT NOT NULL,
    filename TEXT DEFAULT '',
    note TEXT DEFAULT '',
    createat INTEGER NOT NULL,
    status TEXT DEFAULT 'processing',
    hasdeleted INTEGER DEFAULT 0
);

CREATE INDEX idx_userid ON pptaiagent(userid);
CREATE INDEX idx_taskid ON pptaiagent(taskid);
```

### 3. 部署步骤

```bash
# 1. 安装依赖
npm install

# 2. 登录 Cloudflare
npx wrangler login

# 3. 部署
npm run deploy
```

### 4. 绑定资源

在 Cloudflare Workers 控制台手动绑定：
- D1 数据库 (binding: D1)
- R2 存储桶 (binding: R2)

## 项目结构

```

```

## 本地开发

```bash
# 启动开发服务器
npm run dev

# 构建项目
npm run build
```

## API 接口

### 上传文件
```
POST /api/upload?access_key=xxx
```

### 获取任务列表
```
GET /api/tasks?userid=xxx&access_key=xxx
```

### 下载文件
```
GET /api/download?task_id=xxx&access_key=xxx
```

### 删除任务
```
DELETE /api/delete?task_id=xxx&userid=xxx&access_key=xxx
```

## 许可证

© 2025 Endless AI LLC. 版权所有
```

## 部署说明

1. **准备工作**：
   - 确保已安装 Node.js 和 npm
   - 安装 Wrangler CLI: `npm install -g wrangler`

2. **配置环境**：
   ```bash
   # 克隆项目
   git clone <your-repo-url>
   cd docagent
   
   # 安装依赖
   npm install
   
   # 登录 Cloudflare
   npx wrangler login
   ```

3. **设置资源**：
    - 创建 D1 数据库
    - 创建 R2 存储桶
    - 在 `wrangler.toml` 中更新相应的 ID

4. **部署**：
   ```bash
   npm run deploy
   ```

5. **配置环境变量**：
   在 Cloudflare Workers 控制台设置所需的环境变量

这个重构后的项目保持了原有的所有功能，但代码结构更清晰，更易于维护和扩展。每个模块都有明确的职责，类型定义完善，便于后续开发和调试。