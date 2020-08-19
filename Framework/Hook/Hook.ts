/** @noSelfInFile */

export default class Hook {
  /** @noSelf */
  static call(hookName: string, a?: any, b?: any, c?: any, d?: any, e?: any, f?: any, g?: any, h?: any, i?: any, j?: any) {
    // Performance boost, it's faster to use the params like that, instead of ...args
    // call the hook
  }
}
