# 五险一金计算器

一个迷你的 Web 应用，用于计算公司为员工应缴纳的社保公积金费用。

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI/样式**: Tailwind CSS
- **数据库/后端**: Supabase
- **Excel 解析**: xlsx (SheetJS)

## 快速开始

### 1. 环境配置

在 Supabase 控制台创建项目后，复制项目 URL 和 Anon Key 到 `.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 2. 数据库设置

在 Supabase SQL Editor 中运行 `supabase/schema.sql` 脚本创建三张数据表：
- `cities` - 城市社保标准表
- `salaries` - 员工工资表
- `results` - 计算结果表

### 3. 安装依赖

```bash
npm install
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 使用说明

### 步骤 1: 上传数据

1. 访问 `/upload` 页面
2. 选择 `cities.xlsx` 文件（城市社保标准）
3. 选择 `salaries.xlsx` 文件（员工工资数据）
4. 点击"上传数据"按钮

### 步骤 2: 执行计算

点击"执行计算并存储结果"按钮，系统将：
1. 计算每位员工的年度月平均工资
2. 根据佛山社保基数上下限确定缴费基数
3. 计算公司应缴纳金额
4. 将结果存入 `results` 表

### 步骤 3: 查看结果

访问 `/results` 页面查看计算结果表格。

## 核心业务逻辑

**缴费基数确定规则**（以佛山 2024 年为例）：
- 社保基数下限：4546 元
- 社保基数上限：26421 元
- 缴纳比例：14%

| 平均工资范围 | 缴费基数 |
|------------|---------|
| < 4546 | 4546 |
| 4546 - 26421 | 平均工资本身 |
| > 26421 | 26421 |

**公司应缴纳金额** = 缴费基数 × 0.14

## 项目结构

```
shebao-calculator/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── calculate/
│   │   │       └── route.ts      # 计算 API
│   │   ├── results/
│   │   │   └── page.tsx          # 结果查询页
│   │   ├── upload/
│   │   │   └── page.tsx          # 数据上传页
│   │   ├── globals.css           # 全局样式
│   │   ├── layout.tsx            # 根布局
│   │   └── page.tsx              # 主页
│   └── lib/
│       └── supabase.ts           # Supabase 客户端
├── supabase/
│   └── schema.sql                # 数据库脚本
├── .env.local                    # 环境变量
├── claude.md                     # 项目上下文文档
└── package.json
```

## 注意事项

- 暂时固定使用**佛山**城市标准
- **不需要**用户认证/登录功能
- 每次执行计算时**清空** results 表后重新插入
- Excel 文件在前端使用 xlsx 库解析
