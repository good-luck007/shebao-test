'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          五险一金计算器
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 数据上传卡片 */}
          <Link href="/upload" className="block">
            <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-gray-100">
              <div className="text-5xl mb-4">📤</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">数据上传</h2>
              <p className="text-gray-600">
                上传城市社保标准和员工工资数据
              </p>
            </div>
          </Link>

          {/* 结果查询卡片 */}
          <Link href="/results" className="block">
            <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-gray-100">
              <div className="text-5xl mb-4">📊</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">结果查询</h2>
              <p className="text-gray-600">
                查看公司为员工缴纳的社保公积金明细
              </p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
