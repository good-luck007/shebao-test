import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // 1. 从 salaries 表读取所有数据
    const { data: salariesData, error: salariesError } = await supabase
      .from('salaries')
      .select('*');

    if (salariesError) throw salariesError;
    if (!salariesData || salariesData.length === 0) {
      return NextResponse.json({ error: '没有工资数据' }, { status: 400 });
    }

    // 2. 按员工姓名分组，计算年度月平均工资
    const employeeSalaries: Record<string, number[]> = {};
    salariesData.forEach((row) => {
      if (!employeeSalaries[row.employee_name]) {
        employeeSalaries[row.employee_name] = [];
      }
      employeeSalaries[row.employee_name].push(row.salary_amount);
    });

    const employeeAvgSalary: Record<string, number> = {};
    Object.entries(employeeSalaries).forEach(([name, salaries]) => {
      employeeAvgSalary[name] = salaries.reduce((a, b) => a + b, 0) / salaries.length;
    });

    // 3. 从 cities 表获取佛山的社保标准
    const { data: cityData, error: cityError } = await supabase
      .from('cities')
      .select('*')
      .eq('city_name', '佛山')
      .single();

    if (cityError) throw cityError;
    if (!cityData) {
      return NextResponse.json({ error: '未找到佛山社保标准' }, { status: 400 });
    }

    const { base_min, base_max, rate } = cityData;

    // 4 & 5. 计算每位员工的缴费基数和公司应缴纳金额
    const results = Object.entries(employeeAvgSalary).map(([name, avgSalary]) => {
      // 确定最终缴费基数
      let contributionBase: number;
      if (avgSalary < base_min) {
        contributionBase = base_min;
      } else if (avgSalary > base_max) {
        contributionBase = base_max;
      } else {
        contributionBase = avgSalary;
      }

      // 计算公司应缴纳金额
      const companyFee = contributionBase * rate;

      return {
        employee_name: name,
        avg_salary: avgSalary,
        contribution_base: contributionBase,
        company_fee: companyFee,
      };
    });

    // 6. 清空 results 表并插入新数据
    const { error: deleteError } = await supabase.from('results').delete().neq('id', 0);
    if (deleteError) throw deleteError;

    const { error: insertError } = await supabase.from('results').insert(results);
    if (insertError) throw insertError;

    return NextResponse.json({ success: true, count: results.length });
  } catch (error: any) {
    console.error('Calculation error:', error);
    return NextResponse.json({ error: error.message || '计算失败' }, { status: 500 });
  }
}
