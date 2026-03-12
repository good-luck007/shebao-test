'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function UploadPage() {
  const router = useRouter();
  const [citiesFile, setCitiesFile] = useState<File | null>(null);
  const [salariesFile, setSalariesFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string; redirect?: boolean } | null>(null);

  // 解析 Excel 文件
  const parseExcel = (data: ArrayBuffer, type: 'cities' | 'salaries'): any[] => {
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet);

    // 处理 cities 文件的列名映射（修复 Excel 中的拼写错误）
    if (type === 'cities') {
      return rawData.map((row: any) => ({
        id: row.id,
        city_name: row.city_name || row.city_namte, // 兼容拼写错误
        year: row.year,
        base_min: row.base_min,
        base_max: row.base_max,
        rate: row.rate,
      }));
    }

    // 处理 salaries 文件
    if (type === 'salaries') {
      return rawData.map((row: any) => ({
        id: row.id,
        employee_id: row.employee_id,
        employee_name: row.employee_name,
        month: row.month,
        salary_amount: row.salary_amount,
      }));
    }

    return rawData;
  };

  // 上传数据到 Supabase
  const handleUpload = async () => {
    if (!citiesFile || !salariesFile) {
      setMessage({ type: 'error', text: '请选择两个 Excel 文件' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      // 读取并解析 cities 文件
      const citiesData = await readFileAsArrayBuffer(citiesFile);
      const citiesRows = parseExcel(citiesData, 'cities');

      // 读取并解析 salaries 文件
      const salariesData = await readFileAsArrayBuffer(salariesFile);
      const salariesRows = parseExcel(salariesData, 'salaries');

      // 插入 cities 数据
      const { error: citiesError } = await supabase
        .from('cities')
        .upsert(citiesRows, { onConflict: 'id' });

      if (citiesError) throw citiesError;

      // 插入 salaries 数据
      const { error: salariesError } = await supabase
        .from('salaries')
        .upsert(salariesRows, { onConflict: 'id' });

      if (salariesError) throw salariesError;

      setMessage({ type: 'success', text: '数据上传成功！' });
    } catch (error: any) {
      setMessage({ type: 'error', text: `上传失败：${error.message}` });
    } finally {
      setUploading(false);
    }
  };

  // 执行计算
  const handleCalculate = async () => {
    setCalculating(true);
    setMessage(null);

    try {
      const response = await fetch('/api/calculate', { method: 'POST' });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error);

      setMessage({
        type: 'success',
        text: `计算完成！共计算 ${result.count} 位员工的数据。`,
        redirect: true
      });

      // 3 秒后自动跳转到结果页面
      setTimeout(() => {
        router.push('/results');
      }, 2000);
    } catch (error: any) {
      setMessage({ type: 'error', text: `计算失败：${error.message}` });
    } finally {
      setCalculating(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
          &larr; 返回首页
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">数据上传与操作</h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">步骤 1: 上传 Excel 文件</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                城市社保标准 (cities.xlsx)
              </label>
              <input
                type="file"
                accept=".xlsx"
                onChange={(e) => setCitiesFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                员工工资数据 (salaries.xlsx)
              </label>
              <input
                type="file"
                accept=".xlsx"
                onChange={(e) => setSalariesFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <button
              onClick={handleUpload}
              disabled={uploading || !citiesFile || !salariesFile}
              className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? '上传中...' : '上传数据'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">步骤 2: 执行计算</h2>
          <p className="text-gray-600 mb-4 text-sm">
            上传数据后，点击此按钮将计算每位员工的社保公积金缴纳金额
          </p>
          <button
            onClick={handleCalculate}
            disabled={calculating}
            className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {calculating ? '计算中...' : '执行计算并存储结果'}
          </button>
        </div>

        {message && (
          <div className={`mt-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <div className="flex items-center justify-between">
              <span>{message.text}</span>
              {message.type === 'success' && (
                <Link href="/results" className="ml-4 text-sm font-semibold text-green-600 hover:text-green-700 hover:underline">
                  立即查看结果 &rarr;
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// 辅助函数：读取文件为 ArrayBuffer
function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
