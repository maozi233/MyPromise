import { status } from './types/interface';

export class MyPromise {
  /**promise状态值 */
  private status: status = status.PENDING

  /**then的返回值 */
  private value: any

  /**catch的返回值 */
  private reason: any

  /**then的回调数组 */
  private onFulfilledCallbacks: Array<Function> = []
  
  /**catch的回调数组 */
  private onRejectedCallbacks: Array<Function> = []

  constructor(executor: Function) {
    const resolve = this.resolve.bind(this)
    const reject = this.reject.bind(this)

    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  resolve(value: any) {
    if (this.status === status.PENDING) {
      this.status = status.FULFILLED
      this.value = value

      // 依次执行 onFulfilledCallbacks 数组中的回调函数
      this.onFulfilledCallbacks.forEach(callback => callback(value))
    }
  }

  reject(reason: any) {
    if (this.status === status.PENDING) {
      this.status = status.REJECTED
      this.reason  = reason 
    }
    
    // 依次执行 onRejectedCallbacks 数组中的回调函数
    this.onRejectedCallbacks.forEach(callback => callback(reason))
  }

  then(onFulfilled: Function, onRejected: Function) {
    // 判断当前状态是否为 fulfilled，执行 onFulfilled
    if(this.status === status.FULFILLED) {
      onFulfilled(this.value)
    }
        
    // 判断当前状态是否为 rejected，执行 onRejected
    if(this.status === status.REJECTED) {
      onRejected(this.reason)
    }

    // 添加至队列中，等待回调
    if (this.status === status.PENDING) {
      this.onFulfilledCallbacks.push(onFulfilled.bind(this))
      this.onRejectedCallbacks.push(onRejected.bind(this))
    }
  }
}