/**
 * 统一的日志管理工具
 * 用于替换项目中散落的console语句
 */

// 日志级别枚举
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

// 当前环境的日志级别
const currentLogLevel = process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG;

/**
 * 格式化日志消息
 */
function formatMessage(level: string, message: string, context?: string): string {
  const timestamp = new Date().toISOString();
  const contextStr = context ? `[${context}]` : '';
  return `[${timestamp}] ${level} ${contextStr} ${message}`;
}

/**
 * 日志工具类
 */
export class Logger {
  private context?: string;

  constructor(context?: string) {
    this.context = context;
  }

  /**
   * 调试日志
   */
  debug(message: string, data?: any): void {
    if (currentLogLevel <= LogLevel.DEBUG) {
      console.log(formatMessage('DEBUG', message, this.context));
      if (data !== undefined) {
        console.log(data);
      }
    }
  }

  /**
   * 信息日志
   */
  info(message: string, data?: any): void {
    if (currentLogLevel <= LogLevel.INFO) {
      console.info(formatMessage('INFO', message, this.context));
      if (data !== undefined) {
        console.info(data);
      }
    }
  }

  /**
   * 警告日志
   */
  warn(message: string, data?: any): void {
    if (currentLogLevel <= LogLevel.WARN) {
      console.warn(formatMessage('WARN', message, this.context));
      if (data !== undefined) {
        console.warn(data);
      }
    }
  }

  /**
   * 错误日志
   */
  error(message: string, error?: any): void {
    if (currentLogLevel <= LogLevel.ERROR) {
      console.error(formatMessage('ERROR', message, this.context));
      if (error !== undefined) {
        console.error(error);
      }
    }
  }

  /**
   * 创建子上下文
   */
  child(subContext: string): Logger {
    const newContext = this.context ? `${this.context}:${subContext}` : subContext;
    return new Logger(newContext);
  }
}

// 默认日志实例
export const logger = new Logger();

// 为不同模块创建专用日志实例
export const apiLogger = new Logger('API');
export const storeLogger = new Logger('Store');
export const componentLogger = new Logger('Component');
export const utilLogger = new Logger('Util');

/**
 * 性能监控装饰器
 */
export function logPerformance(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;
  
  descriptor.value = function (...args: any[]) {
    const start = performance.now();
    const result = method.apply(this, args);
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const end = performance.now();
        logger.debug(`${target.constructor.name}.${propertyName} 执行时间: ${(end - start).toFixed(2)}ms`);
      });
    } else {
      const end = performance.now();
      logger.debug(`${target.constructor.name}.${propertyName} 执行时间: ${(end - start).toFixed(2)}ms`);
      return result;
    }
  };
  
  return descriptor;
}

/**
 * 错误边界日志记录
 */
export function logError(error: Error, errorInfo?: any, context?: string): void {
  const errorLogger = context ? new Logger(context) : logger;
  errorLogger.error('组件错误', {
    message: error.message,
    stack: error.stack,
    errorInfo,
  });
}