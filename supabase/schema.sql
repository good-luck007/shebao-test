-- 五险一金计算器 - Supabase 数据库架构
-- 在 Supabase SQL Editor 中运行此脚本

-- 创建 cities 表（城市社保标准表）
CREATE TABLE IF NOT EXISTS cities (
    id INTEGER PRIMARY KEY,
    city_name TEXT NOT NULL,
    year TEXT NOT NULL,
    base_min INTEGER NOT NULL,
    base_max INTEGER NOT NULL,
    rate FLOAT NOT NULL
);

-- 创建 salaries 表（员工工资表）
CREATE TABLE IF NOT EXISTS salaries (
    id INTEGER PRIMARY KEY,
    employee_id TEXT NOT NULL,
    employee_name TEXT NOT NULL,
    month TEXT NOT NULL,
    salary_amount INTEGER NOT NULL
);

-- 创建 results 表（计算结果表）
CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    employee_name TEXT NOT NULL,
    avg_salary FLOAT NOT NULL,
    contribution_base FLOAT NOT NULL,
    company_fee FLOAT NOT NULL
);

-- 添加注释
COMMENT ON TABLE cities IS '城市社保标准表';
COMMENT ON COLUMN cities.city_name IS '城市名称';
COMMENT ON COLUMN cities.year IS '年份';
COMMENT ON COLUMN cities.base_min IS '社保基数下限';
COMMENT ON COLUMN cities.base_max IS '社保基数上限';
COMMENT ON COLUMN cities.rate IS '综合缴纳比例';

COMMENT ON TABLE salaries IS '员工工资表';
COMMENT ON COLUMN salaries.employee_id IS '员工工号';
COMMENT ON COLUMN salaries.employee_name IS '员工姓名';
COMMENT ON COLUMN salaries.month IS '年月 (YYYYMM 格式)';
COMMENT ON COLUMN salaries.salary_amount IS '月工资金额';

COMMENT ON TABLE results IS '计算结果表';
COMMENT ON COLUMN results.employee_name IS '员工姓名';
COMMENT ON COLUMN results.avg_salary IS '年度月平均工资';
COMMENT ON COLUMN results.contribution_base IS '最终缴费基数';
COMMENT ON COLUMN results.company_fee IS '公司缴纳金额';
