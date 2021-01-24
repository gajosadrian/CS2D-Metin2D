local imageFont = { fontTable = {} }

-- /// Misc Func /// --
function imageFont.fileExists(file)
    local f = io.open(file, "rb")
    if f then
        f:close()
    end
    return(f ~= nil)
end

function imageFont.linesFromFile(file)
    if not imageFont.fileExists(file) then
        return({})
    end
    local lines = {}
    for line in io.lines(file) do 
        lines[#lines + 1] = line
    end
    return(lines)
end

local function split(t, b)
    if t then
        local cmd, match = {}, [[[^]]..b..[[]+]]
        for word in string.gmatch(t, match) do
            table.insert(cmd, word)
        end
        return(cmd)
    else
        return({nil})
    end
end

-- /// Image Font Functions /// --
function imageFont.Load(file)
    local lines = imageFont.linesFromFile(file)
    local textSize = 0
    for k,v in pairs(lines) do
        if string.find(v, "textsize") then
            textSize = tonumber(split(v,"=")[2])
            if (textSize == nil) then
                textSize = 13
            end
            if (imageFont.fontTable[textSize] == nil) then
                imageFont.fontTable[textSize] = {}
            end
        else
            local char = string.sub(v, 1, 1    )
            local size = string.sub(v, 3)
            imageFont.fontTable[textSize][char] = size
        end
    end
end

local function charwidth(char, textSize)
    if (textSize == nil) then
        textSize = 13
    end
    if (imageFont.fontTable[textSize] ~= nil) then
        if (imageFont.fontTable[textSize][char] ~= nil) then
            return(imageFont.fontTable[textSize][char])
        end    
    end
    return(0)
end

local len, sub = string.len, string.sub

local function textwidth(text, textSize)
    if (textSize == nil) then
        textSize = 13
    end
    local len = 0
    for i = 1, len(text) do
        len = len + charwidth(sub(text, i, i), textSize)
    end
    return(len)
end

return {
	imageFont = imageFont,
	charwidth = charwidth,
	textwidth = textwidth,
}
