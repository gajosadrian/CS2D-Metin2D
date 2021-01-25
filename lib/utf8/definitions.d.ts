declare module 'lib/utf8/utf8' {
  /**
   * Get the Unicode codepoint of the given character.
   * @noSelf
   */
  function codepoint(char: string): number;

  /**
   * Get the UTF-8 representation of a single character.
   * @noSelf
   */
  function encode(char: string): string;

  /**
   * Get a CS2D-ready UTF-8 representation of the given string.
   * @noSelf
   */
  function convert(string: string): string;
}
