export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      <div className="bg-white rounded-lg overflow-hidden p-8">
        {/* ← 목록 버튼 스켈레톤 */}
        <div className="mb-8 h-6 w-20 bg-gray-200 rounded"></div>

        {/* 제목, 날짜, 구분선 스켈레톤 */}
        <div className="mb-8 text-center">
          <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4" />
          <div className="border-t border-gray-200 mt-8" />
        </div>

        {/* 본문 스켈레톤 */}
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
        </div>
      </div>
    </div>
  );
}
