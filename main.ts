/** @noSelfInFile */

function __DIR__() {
    return string.match(__FILE__(), '(.*/)')
}

function __FILE__() {
    return (<string> debug.getinfo(2, 'S').source).substring(1)
}

function __LINE__() {
    return debug.getinfo(2, 'l').currentline
}

_G.package.path = `./${__DIR__()}?.lua;${_G.package.path}`

require('./lualib_bundle')
