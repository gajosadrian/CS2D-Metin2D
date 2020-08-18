/** @noSelfInFile */

export default class Hook {
  /** @noSelf */
  static call(hookName: string, a?: any, b?: any, c?: any, d?: any, e?: any, f?: any, g?: any, h?: any, i?: any, j?: any) {
    // Performance boost, I'm not using ...args because it's slower
    // call the hook
  }
}
