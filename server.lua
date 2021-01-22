function __DIR__()
    return (__FILE__()):match('(.*/)')
end

function __FILE__()
    return debug.getinfo(2, 'S').source:sub(2)
end

function __LINE__()
    return debug.getinfo(2, 'l').currentline
end

_G.package.path = ('./' .. __DIR__() .. '/?.lua;') .. ('./' .. __DIR__() .. '/?/index.lua;') .. tostring(_G.package.path)
require('lualib_bundle')
require('main')
