import { useEffect, useState } from 'react'

/**
 * 模拟的视图数据 Hook
 * 原本使用 Supabase 获取页面访问量数据，现已移除
 * 返回模拟数据以保持组件正常运行
 */
export const useViewData = (slug) => {
  const [viewData, setViewData] = useState(null)

  useEffect(() => {
    // 模拟异步数据获取
    const timer = setTimeout(() => {
      if (slug) {
        // 为特定页面返回模拟数据
        setViewData([{
          slug: slug,
          view_count: Math.floor(Math.random() * 1000) + 100 // 随机生成100-1099的访问量
        }])
      } else {
        // 返回所有页面的模拟数据
        setViewData([
          { slug: 'home', view_count: 1234 },
          { slug: 'writing', view_count: 856 },
          { slug: 'journey', view_count: 432 },
          { slug: 'stack', view_count: 678 },
          { slug: 'workspace', view_count: 321 },
          { slug: 'bookmarks', view_count: 543 }
        ])
      }
    }, 100) // 模拟网络延迟

    return () => clearTimeout(timer)
  }, [slug])

  return viewData
}
