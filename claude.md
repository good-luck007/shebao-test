# 五险一金计算器 - 项目上下文文档

## 项目概述
构建一个迷你 Web 应用，根据员工工资数据和城市社保标准，计算公司为每位员工应缴纳的社保公积金费用。

## 技术栈
- **前端框架**: Next.js 14+ (App Router)
- **UI/样式**: Tailwind CSS
- **数据库/后端**: Supabase (PostgreSQL)
- **Excel 解析**: xlsx (SheetJS) - 前端解析

## 数据库设计 (Supabase)

### cities 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键 |
| city_name | text | 城市名 |
| year | text | 年份 |
| base_min | int | 社保基数下限 |
| base_max | int | 社保基数上限 |
| rate | float | 综合缴纳比例 (如 0.14) |

### salaries 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键 |
| employee_id | text | 员工工号 |
| employee_name | text | 员工姓名 |
| month | text | 年月 (YYYYMM 格式) |
| salary_amount | int | 月工资金额 |

### results 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键 |
| employee_name | text | 员工姓名 |
| avg_salary | float | 年度月平均工资 |
| contribution_base | float | 最终缴费基数 |
| company_fee | float | 公司缴纳金额 |

## 核心业务逻辑

### 计算函数执行步骤
1. 从 `salaries` 表读取所有数据
2. 按 `employee_name` 分组，计算每位员工的**年度月平均工资**（全年工资和 ÷ 12）
3. 从 `cities` 表获取佛山的 `year`, `base_min`, `base_max`, `rate`
4. 确定**最终缴费基数**：
   - 若平均工资 < base_min → 缴费基数 = base_min
   - 若平均工资 > base_max → 缴费基数 = base_max
   - 否则 → 缴费基数 = 平均工资
5. 计算**公司应缴纳金额** = 缴费基数 × rate
6. **清空** results 表，将计算结果插入

## 前端页面

### `/` 主页 - 导航中枢
- 两个功能卡片（Card）布局
- **卡片一 "数据上传"**: 可点击，跳转到 `/upload`
- **卡片二 "结果查询"**: 可点击，跳转到 `/results`

### `/upload` 数据上传与操作页
- **按钮一 "上传数据"**: 选择本地 Excel 文件，前端解析后插入 `cities` 和 `salaries` 表
- **按钮二 "执行计算并存储结果"**: 触发核心计算逻辑，结果存入 `results` 表

### `/results` 结果查询与展示页
- 页面加载时自动从 `results` 表获取所有数据
- 使用 Tailwind CSS 样式简洁的表格展示结果
- 表头：employee_name, avg_salary, contribution_base, company_fee

---

## TodoList - 开发任务清单

### 阶段一：环境搭建
- [ ] 1.1 初始化 Next.js 项目 (`npx create-next-app@latest`)
- [ ] 1.2 配置 Tailwind CSS（通常已内置）
- [ ] 1.3 安装依赖：`@supabase/supabase-js`, `xlsx`
- [ ] 1.4 创建 `.env.local`，配置 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] 1.5 创建 Supabase 客户端工具文件 `lib/supabase.ts`

### 阶段二：数据库设置
- [ ] 2.1 在 Supabase 创建 `cities` 表
- [ ] 2.2 在 Supabase 创建 `salaries` 表
- [ ] 2.3 在 Supabase 创建 `results` 表
- [ ] 2.4 编写 SQL 脚本文件 `supabase/schema.sql` 便于复用

### 阶段三：主页开发 (`/`)
- [ ] 3.1 创建主页布局（page.tsx）
- [ ] 3.2 设计并实现功能卡片组件（Card）
- [ ] 3.3 添加卡片点击跳转逻辑（链接到 `/upload` 和 `/results`）
- [ ] 3.4 使用 Tailwind CSS 美化样式

### 阶段四：上传页开发 (`/upload`)
- [ ] 4.1 创建上传页布局
- [ ] 4.2 实现 Excel 文件选择器组件
- [ ] 4.3 使用 xlsx 库前端解析 Excel（cities.xlsx 和 salaries.xlsx）
- [ ] 4.4 实现"上传数据"按钮逻辑（批量插入 Supabase）
- [ ] 4.5 实现"执行计算"按钮及 API 路由
- [ ] 4.6 添加上传状态反馈（成功/失败提示）

### 阶段五：结果页开发 (`/results`)
- [ ] 5.1 创建结果页布局
- [ ] 5.2 实现从 Supabase 获取 results 数据
- [ ] 5.3 设计并实现数据表格组件
- [ ] 5.4 使用 Tailwind CSS 美化表格样式
- [ ] 5.5 处理空数据状态（无结果时的提示）

### 阶段六：核心计算逻辑
- [ ] 6.1 创建 API 路由 `/api/calculate`
- [ ] 6.2 实现计算函数（读取 salaries → 分组平均 → 基数判定 → 计算费用）
- [ ] 6.3 实现清空 results 表并插入新数据
- [ ] 6.4 添加错误处理和日志输出

### 阶段七：测试与优化
- [ ] 7.1 测试完整流程：上传 Excel → 执行计算 → 查看结果
- [ ] 7.2 验证计算逻辑正确性（边界值测试：低于下限、高于上限、在中间）
- [ ] 7.3 优化 UI 交互体验
- [ ] 7.4 代码清理和注释

---

## 注意事项
- 暂时固定使用**佛山**城市标准
- **不需要**用户认证/登录功能
- 每次执行计算时**清空** results 表后重新插入
- Excel 文件在前端使用 xlsx 库解析
