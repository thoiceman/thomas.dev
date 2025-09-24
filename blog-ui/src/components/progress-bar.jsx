'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置 NProgress
NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 800,
  showSpinner: false,
})

/**
 * 路由进度条组件
 * 在路由切换时显示顶部进度条
 */
export default function ProgressBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // 当路由或搜索参数发生变化时，先启动进度条
    NProgress.start()
    
    // 设置一个短暂的延迟来模拟加载过程，然后完成进度条
    const timer = setTimeout(() => {
      NProgress.done()
    }, 300) // 增加延迟时间让用户能看到进度条

    return () => {
      clearTimeout(timer)
    }
  }, [pathname, searchParams])

  // 组件卸载时确保进度条完成
  useEffect(() => {
    return () => {
      NProgress.done()
    }
  }, [])

  return null
}