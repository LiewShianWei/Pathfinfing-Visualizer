from re import findall

f = open('generatedMaze.txt', 'r')
r = ''.join(f.readlines())

maze = []

for i in r.split(': Array(50)'):
    layer = []
    for j in i.split(': {'):
        info = findall('x: (.+), y: (.+), state: "(.)"', j)
        if info:
            info = info[0]
            layer.append([float(info[0]), float(info[1]), info[2]])
    
    maze.append(layer)

print(maze)
