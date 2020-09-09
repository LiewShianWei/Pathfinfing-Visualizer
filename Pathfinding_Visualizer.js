let canvas
let ctx
let disableButton = false;
let finishTransition = false;
let running = false;
let parentChild = {};
let incr = 1;
let boundX = 0;     // To prevent checking and unchecking a wall (flickering) if right click held down on same rect
let boundY = 0;
let dropStartNode = false;
let dropFinishNode = false;
let visitedS = false;
let visitedF = false;
let noNeedFillRect;

let startImg = new Image();
startImg.src = "https://cdn4.iconfinder.com/data/icons/geomicons/32/672374-chevron-right-512.png";
let finishImg = new Image();
finishImg.src = "https://cdn2.iconfinder.com/data/icons/font-awesome/1792/dot-circle-o-512.png";

let width = 1515;
let height = 700;

let rectX = 30;
let rectY = 30;

let gridX = 50;
let gridY = 21;

let startNode = [10, 10];
let finishNode = [10, 39];

let grid = [];



for (let y = 0; y < gridY; y++) {
    grid[y] = [];

    for (let x = 0; x < gridX; x++) {
        grid[y][x] = {x: x * (rectX + 0.022), y: y * (rectY + 0.022), state: 'e'};
    }
}

grid[startNode[0]][startNode[1]].state = 's';
grid[finishNode[0]][finishNode[1]].state = 'f';



function arrayEquals(a, b) {
    return Array.isArray(a) && Array.isArray(b) & a.length === b.length && a.every((val, index) => val === b[index]);
}



  function inArray(a, b) {
    for (let i = 0; i < b.length; i ++) {

        if (arrayEquals(a, b[i])) {
            return true;
        }
    }

    return false;
}



function parentNode(child, parent, finish) {
    if (finish == true) { 
        var finalPath = [finishNode];
        let prev = finishNode;
        parentChild[child] = parent;

        while (arrayEquals(prev, startNode) == false) {
            prev = parentChild[prev];
            finalPath.unshift(prev);
        }

        parentChild = {};

        return finalPath;

    } else {
        parentChild[child] = parent;
    }

}


function generateMaze () {
    if (disableButton == true) {
        return null;
    }
    startNode = [1, 1];
    finishNode = [19, 48];

    for (let y = 0; y < gridY; y++) {
    
        for (let x = 0; x < gridX; x++) {
            grid[y][x].state = 'w';
        }
    }

    canvas.onmousedown = null;
    disableButton = true;
    init(30);

    let stk = [startNode];
    let max_Y = grid.length - 2;
    let max_X = grid[0].length - 2;
    let y, x, dir_Y, dir_X, check_Y, check_X;
    let dir;
    let next;
    let options;
    let checkNeigh;
    let pathFound;

    let loop = setInterval(() => {
        if (stk.length == 0) {
            clearInterval(loop);
            canvas.onmousedown = down;
            disableButton = false;

            grid[startNode[0]][startNode[1]].state = 's';
            grid[finishNode[0]][finishNode[1]].state = 'f';

        } else {
            next = stk[stk.length - 1];
            y = next[0];
            x = next[1];
            
            if (grid[y][x].state == 'w') {
                grid[y][x].state = 'x';
            }
    
            options = [[y, x - 1, 'l'], [y - 1, x, 'u'], [y, x + 1, 'r'], [y + 1, x, 'd']];
            console.log('restarting', next);
            while (options.length != 0) {
                random = options.splice(Math.floor(Math.random() * options.length), 1)[0];
                console.log(options.length);
                dir_Y = random[0];
                dir_X = random[1];
                dir = random[2];
    
                if (1 <= dir_Y && dir_Y <= max_Y && 1 <= dir_X && dir_X <= max_X) {
    
                    if (grid[dir_Y][dir_X].state == 'w') {
                        if (dir == 'l') {
                            checkNeigh = [[dir_Y - 1, dir_X], [dir_Y - 1, dir_X - 1], [dir_Y, dir_X - 1], [dir_Y + 1, dir_X - 1], [dir_Y + 1, dir_X]];
    
                        } else if (dir == 'u') {
                            checkNeigh = [[dir_Y, dir_X - 1], [dir_Y - 1, dir_X - 1], [dir_Y - 1, dir_X], [dir_Y - 1, dir_X + 1], [dir_Y, dir_X + 1]];
    
                        } else if (dir == 'r') {
                            checkNeigh = [[dir_Y - 1, dir_X], [dir_Y - 1, dir_X + 1], [dir_Y, dir_X + 1], [dir_Y + 1, dir_X + 1], [dir_Y + 1, dir_X]];
    
                        } else if (dir == 'd') {
                            checkNeigh = [[dir_Y, dir_X - 1], [dir_Y + 1, dir_X - 1], [dir_Y + 1, dir_X], [dir_Y + 1, dir_X + 1], [dir_Y, dir_X + 1]];
                        }
                        
                        for (let j = 0; j < 5; j++) {
                            pathFound = true;
                            check_Y = checkNeigh[j][0];
                            check_X = checkNeigh[j][1];
    
                            if (1 <= check_Y && check_Y <= max_Y && 1 <= check_X && check_X <= max_X) {
                                if (grid[check_Y][check_X].state == 'w') {
                                    null;
    
                                } else {
                                    pathFound = false;
                                    break;
                                }
                            }
                        }
    
                        if (pathFound == true) {
                            stk.push([dir_Y, dir_X]);
                            break;
                        }
                    }
                }
            }
    
            if (pathFound == false) {
                stk.pop();
                grid[y][x].state = 'e';
            }
        }
    }, 15);
}



function depthFirstSearch() {
    if (disableButton == true) {
        return null;
    }

    canvas.onmousedown = null;
    disableButton = true;
    running = true;
    init(30);

    let stk = [startNode];
    let max_Y = grid.length - 1;
    let max_X = grid[0].length - 1;
    let y, x;
    let y_path, x_path;
    let dir;
    let next;

    let visitedS = true;
    ctx.fillStyle = '#00CEF6';
    ctx.fillRect(grid[startNode[0]][startNode[1]].x, grid[startNode[0]][startNode[1]].y, rectX, rectY);
    ctx.drawImage(startImg, grid[startNode[0]][startNode[1]].x, grid[startNode[0]][startNode[1]].y, rectX, rectY);

    let loop = setInterval(() => {
        next = stk.pop();
        y = next[0];
        x = next[1];

        if (grid[y][x].state == 'e') {
            grid[y][x].state = 'v';

        } else if (grid[y][x].state == 'f') {
            running = false;
            visitedF = true;
            let path = parentNode(null, null, true);

            grid[startNode[0]][startNode[1]].state = 'xStart';

            for (let i = 1; i < path.length; i++) {
                setTimeout(function () {
                    y_path = path[i][0];
                    x_path = path[i][1];

                    if (y_path == finishNode[0] && x_path == finishNode[1]) {
                        grid[y_path][x_path].state = 'xFinish';

                    } else {
                        grid[y_path][x_path].state = 'x';
                    }
                }, i * 30);
            }

            removeUnrenderedVisitedNodes();
            clearInterval(loop);
        }

        dir = [[y, x - 1], [y - 1, x], [y, x + 1], [y + 1, x]];

        for (let i = 0; i < 4; i++) {
            dir_Y = dir[i][0];
            dir_X = dir[i][1];

            if (0 <= dir_Y && dir_Y <= max_Y && 0 <= dir_X && dir_X <= max_X) {

                if (grid[dir_Y][dir_X].state == 'e' || grid[dir_Y][dir_X].state == 'f') {
                    stk.push([dir_Y, dir_X]);
                    parentNode([dir_Y, dir_X], [y, x], false);
                }
            }
        }
    }, 65);
}



function removeUnrenderedVisitedNodes() {
    // To remove bug where the program finishes while the color transition loop is still running
    // Which caused the unfinished rendered node who's state is still 'v' to turn yellow
    for (let y = 0; y < gridY; y++) {

        for (let x = 0; x < gridX; x++) {

            if (grid[y][x].state == 'v') {
                grid[y][x].state = 'tran';
            }
        }
    }
}



function breadthFirstSearch() {
    if (disableButton == true) {
        return null;
    }
    
    canvas.onmousedown = null;
    disableButton = true;
    running = true;
    incr = 2;
    init(30);

    let queue = [startNode];
    let max_Y = grid.length - 1;
    let max_X = grid[0].length - 1;
    let y, x;
    let path;
    let y_path, x_path;
    let dir;
    let next;

    let visitedS = true;
    ctx.fillStyle = '#00CEF6';
    ctx.fillRect(grid[startNode[0]][startNode[1]].x, grid[startNode[0]][startNode[1]].y, rectX, rectY);
    ctx.drawImage(startImg, grid[startNode[0]][startNode[1]].x, grid[startNode[0]][startNode[1]].y, rectX, rectY);
    
    let loop = setInterval(() => {
        next = queue.shift();
        y = next[0];
        x = next[1];

        dir = [[y - 1, x], [y, x + 1], [y + 1, x], [y, x - 1]];

        if (inArray(finishNode, dir)) {
            running = false;
            visitedF = true;
            path = parentNode(finishNode, [y, x], true);

            grid[startNode[0]][startNode[1]].state = 'xStart';
            
            for (let i = 1; i < path.length; i++) {
                setTimeout(function () {
                    y_path = path[i][0];
                    x_path = path[i][1];
                    
                    if (y_path == finishNode[0] && x_path == finishNode[1]) {
                        grid[y_path][x_path].state = 'xFinish';

                    } else {
                        grid[y_path][x_path].state = 'x';
                    }
                }, i * 30);
            }

            removeUnrenderedVisitedNodes();
            clearInterval(loop);

        } else { 

                for (let i = 0; i < 4; i++) {
                dir_Y = dir[i][0];
                dir_X = dir[i][1];

                if (0 <= dir_Y && dir_Y <= max_Y && 0 <= dir_X && dir_X <= max_X) {

                    if (grid[dir_Y][dir_X].state == 'e') {
                        queue.push([dir_Y, dir_X]);
                        grid[dir_Y][dir_X].state = 'v';
                        parentNode([dir_Y, dir_X], [y, x], false)
                    }
                }
            }
        }
    }, 10);
}



let GColor = function(r,g,b) {
    r = (typeof r === 'undefined')?0:r;
    g = (typeof g === 'undefined')?0:g;
    b = (typeof b === 'undefined')?0:b;
    return {r:r, g:g, b:b};
}

let createColorRange = function(c1, c2) {
    var colorList = [], tmpColor;

    for (var i=0; i<247; i+=4) {
        tmpColor = new GColor();
        tmpColor.r = c1.r + ((i*(c2.r-c1.r))/247);
        tmpColor.g = c1.g + ((i*(c2.g-c1.g))/247);
        tmpColor.b = c1.b + ((i*(c2.b-c1.b))/247);
        colorList.push('rgb('+tmpColor.r+', '+tmpColor.g+', '+tmpColor.b+')');
    }

    return colorList;
}

let range = createColorRange(GColor(64 , 224, 208), GColor(0, 206, 246));


function rect(x, y, w, h, state) {
    noNeedFillRect = false;

    if (state == 's') {
        if (visitedS == true) {
            ctx.fillStyle = '#00CEF6';
            ctx.fillRect(x, y, w, h);
        }
        ctx.drawImage(startImg, x, y, w, h);
        noNeedFillRect = true;

    } else if (state == 'f') {
        if (visitedF == true) {
            ctx.fillStyle = '#00CEF6';
            ctx.fillRect(x, y, w, h);
        }
        ctx.drawImage(finishImg, x - 1.5, y, 33, 33);
        noNeedFillRect = true;

    } else if (state == 'e') {
        ctx.lineWidth = 0.7;
        ctx.strokeStyle = '#e7ebed';
    
    } else if (state == 'w') {
        ctx.fillStyle = '#23395d';

    } else if (state == 'x') {
        ctx.fillStyle = '#FFFF00';

    } else if (state == 'tran') {   // Tran for transitioned color effect
        ctx.fillStyle = '#00CEF6';

    } else if (state == 'moveStart') {
        ctx.globalAlpha = 0.4;
        ctx.drawImage(startImg, x, y, w, h);
        ctx.globalAlpha = 1.0;
        noNeedFillRect = true;

    } else if (state == 'moveFinish') {
        ctx.globalAlpha = 0.4;
        ctx.drawImage(finishImg, x - 1.5, y, 33, 33);
        ctx.globalAlpha = 1.0;
        noNeedFillRect = true;

    } else if (state == 'xStart') {
        ctx.fillStyle = '#FFFF00';
        let y = startNode[0];
        let x = startNode[1];
        ctx.fillRect(grid[y][x].x, grid[y][x].y, w, h);
        ctx.drawImage(startImg, grid[y][x].x, grid[y][x].y, w, h);
        noNeedFillRect = true;

    } else if (state == 'xFinish') {
        ctx.fillStyle = '#FFFF00';
        let y = finishNode[0];
        let x = finishNode[1];
        ctx.fillRect(grid[y][x].x, grid[y][x].y, w, h);
        ctx.drawImage(finishImg, grid[y][x].x - 1.5, grid[y][x].y, 33, 33);
        noNeedFillRect = true;
    }
    
    
    if (state == 'e') {
        ctx.strokeRect(x, y, w, h);

    } else if (noNeedFillRect == false) {
        ctx.fillRect(x, y, w, h);
    }
}



function clear() {
    ctx.clearRect(0, 0, width, height);     
}



function draw() {
    if (running == false) {
        clear();    // Resets grid to draw again

        for (let y = 0; y < gridY; y++) {

            for (let x = 0; x < gridX; x++) {
                rect(grid[y][x].x, grid[y][x].y, rectX, rectY, grid[y][x].state);
            }
        }

    } else {

        for (let y = 0; y < gridY; y++) {

            for (let x = 0; x < gridX; x++) {

                if (grid[y][x].state == 'v') {

                    let i = 0;
                    let individual = setInterval(function() {

                        if (i == range.length - 2) {
                            clearInterval(individual);
                        }
                        ctx.fillStyle = range[i];
                        ctx.fillRect(grid[y][x].x, grid[y][x].y, rectX, rectY);
                        ctx.lineWidth = 0.08;
                        ctx.strokeRect(grid[y][x].x, grid[y][x].y, rectX, rectY);
                        
                        i+= incr;
                    }, 25); 

                    grid[y][x].state = 'tran';
                }
            }
        }
    }
}



function reset() {
    return location.reload();
}



function init(speed) {
    canvas = document.getElementById('Canvas');
    ctx = canvas.getContext('2d');
    return setInterval(draw, speed);   // Sets timer to run function over and over again
}



function hold(e) {
    let x_cord = e.pageX - canvas.offsetLeft;    // Adjust the coordinates so that top left of grid is 0,0
    let y_cord = e.pageY - canvas.offsetTop;     // No matter where the canvas is sitting on the page

    if (!dropFinishNode && !dropStartNode) {

        for (let y = 0; y < gridY; y++) {

            for (let x = 0; x < gridX; x++) {

                if ((x * (rectX + 0.022)) < x_cord && x_cord < (x * (rectX + 0.022) + rectX) && (y * (rectY + 0.022)) < y_cord && y_cord < (y * (rectY + 0.022) + rectY)) {

                    if (grid[y][x].state == 'e' && (x != boundX || y != boundY)) {
                        grow((x * (rectX + 0.022)), (y * (rectY + 0.022)), y, x);
                        boundX = x;
                        boundY = y;
        
                    } else if (grid[y][x].state == 'w' && (x != boundX || y != boundY)) {
                        grid[y][x].state = 'e';
                        boundX = x;
                        boundY = y;
                    }       
                }
            }
        }
    }
}


function grow(x, y, indexY, indexX) {
    ctx.fillStyle = '#23395d';
    let xGrowAnimation = x + 15;
    let yGrowAnimation = y + 15;
    let i = 0;

    let grow = setInterval(function() {
        ctx.fillRect(xGrowAnimation - i, yGrowAnimation - i, i * 2, i * 2);

        if (i == 15) {
            clearInterval(grow);
            grid[indexY][indexX].state = 'w';
        }

        i+=3.75;
        }, 15);
}



function down(e) {
    canvas.onmousemove = hold;

    let x_cord = e.pageX - canvas.offsetLeft;    // Adjust the coordinates so that top left of grid is 0,0
    let y_cord = e.pageY - canvas.offsetTop;     // No matter where the canvas is sitting on the page

    for (let y = 0; y < gridY; y++) {

        for (let x = 0; x < gridX; x++) {

            if ((x * (rectX + 0.022)) < x_cord && x_cord < (x * (rectX + 0.022) + rectX) && (y * (rectY + 0.022)) < y_cord && y_cord < (y * (rectY + 0.022) + rectY)) {

                if (!dropStartNode && !dropFinishNode) {

                    if (grid[y][x].state == 'e') {
                        grow((x * (rectX + 0.022)), (y * (rectY + 0.022)), y, x);
                        boundX = x;
                        boundY = y;
    
                    } else if (grid[y][x].state == 'w') {
                        grid[y][x].state = 'e';
                        boundX = x;
                        boundY = y;
    
                    } else if (grid[y][x].state == 's') {
                        grid[y][x].state = 'moveStart';
                        dropStartNode = true;

                    } else if (grid[y][x].state == 'f') {
                        grid[y][x].state = 'moveFinish';
                        dropFinishNode = true;
                    }

                } else {

                    if (grid[y][x].state == 'e') {

                        if (dropStartNode) {
                            grid[startNode[0]][startNode[1]].state = 'e';
                            startNode = [y, x];
                            grid[y][x].state = 's';
                            dropStartNode = false;

                        } else if (dropFinishNode) {
                            grid[finishNode[0]][finishNode[1]].state = 'e';
                            finishNode = [y, x];
                            grid[y][x].state = 'f';
                            dropFinishNode = false;
                        } 

                    } else {

                        if (dropStartNode) {
                            grid[startNode[0]][startNode[1]].state = 's';
                            dropStartNode = false;

                        } else if (dropFinishNode) {
                            grid[finishNode[0]][finishNode[1]].state = 'f';
                            dropFinishNode = false;
                        }
                    }
                }
            }
        }
    }
}



function up(e) {
    canvas.onmousemove = null;
}



init(100);
canvas.onmousedown = down;
canvas.onmouseup = up;