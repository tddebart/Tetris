let curBlockPosX = []
let curBlockPosY = []
const grid = document.getElementById('grid')
let currentBlock;


createGrid()

function createGrid() {
    for (y = 0; y < 17; y++) {
        const row = document.createElement('div')
        row.className = 'gridRow'
        grid.appendChild(row)
        for (x = 0; x < 10; x++) {
            const block = document.createElement('div')
            block.className = 'gridItem'
            row.appendChild(block)
        }
    }
}


function move(xM,yM) {
    for (y = 0; y < curBlockPosY.length; y++) {
        if((curBlockPosY[y] + yM) >= 17 || (curBlockPosY[y] + yM) < 0) {
            spawnCube()
            return;
        }
    }
    for (x = 0; x < curBlockPosX.length; x++) {
        if((curBlockPosX[x] + xM) < 0 || (curBlockPosX[x] + xM) >= 10) {
            return;
        }
    }

    for (y = 0; y < curBlockPosY.length; y++) {
            if(grid.children[curBlockPosY[y]+yM].children[curBlockPosX[y]+xM].className.includes('block') && !grid.children[curBlockPosY[y]+yM].children[curBlockPosX[y]+xM].className.includes('moving')) {
                if(yM!==0) {
                    spawnCube()
                }
                return;
            }
    }

    clearCurrentBlock()

    for (y = 0; y < curBlockPosY.length; y++) {
        curBlockPosY[y] += yM
        curBlockPosX[y] += xM
    }

    for (y = 0; y < curBlockPosY.length; y++) {
            grid.children[curBlockPosY[y]].children[curBlockPosX[y]].className = 'gridItem block moving'
    }
}

function clearCurrentBlock() {
    for (y = 0; y < curBlockPosY.length; y++) {
            grid.children[curBlockPosY[y]].children[curBlockPosX[y]].className = 'gridItem'
    }
}

function checkForLines() {
    for (y = 0; y < 17; y++) {
        let good = 0
        for (x = 0; x < 10; x++) {
            if(grid.children[y].children[x].className.includes('block')) {
                good++
            }
        }
        if(good === 10) {
            for (x = 0; x < 10; x++) {
               grid.children[y].children[x].className = 'gridItem'
            }
            moveAllLinesDown(y)
        }
    }
}

function moveAllLinesDown(upBlocks) {
    for (let y = upBlocks-1; y > 0; y--) {
        for (x = 0; x < 10; x++) {
            if(grid.children[y].children[x].className.includes('block')) {
                grid.children[y].children[x].className = 'gridItem'
                grid.children[y+1].children[x].className = 'gridItem block'

            }
        }
    }
}

window.setInterval(function() {
    move(0,1)

}, 500)

function spawnCube() {

    // reset previous block
    for (y = 0; y < curBlockPosY.length; y++) {
        grid.children[curBlockPosY[y]].children[curBlockPosX[y]].className = 'gridItem block'

    }
    checkForLines()

    const rand = getRndInteger(0, types.length-1)

    for (i = 0; i < types[rand].xPos.length; i++) {
        const x = (types[rand].xPos[i])+4
        const y = types[rand].yPos[i]

        grid.children[y].children[x].className += ' block moving'
        curBlockPosX[i] = x
        curBlockPosY[i] = y
    }
    //move(4,0)
}

function rotate() {
    let morBlockPos = [];
    for(x = 0; x < curBlockPosX.length; x++) {
        morBlockPos[x] = curBlockPosY[x] + curBlockPosX[0] - curBlockPosY[0]
    }
    for(y = 0; y < curBlockPosY.length; y++) {
        curBlockPosY[y] = curBlockPosX[0] + curBlockPosY[0] - curBlockPosY[y]
    }
    curBlockPosX = morBlockPos;

    clearCurrentBlock()

    for (y = 0; y < curBlockPosY.length; y++) {
        grid.children[curBlockPosY[y]].children[curBlockPosX[y]].className = 'gridItem block moving'
    }
}

document.onkeydown = function (e) {
    if(e.key === "ArrowRight") {
        move (1,0)
    } else if(e.key === "ArrowLeft") {
        move (-1,0)
    } else if(e.key === "ArrowDown") {
        move (0,1)
    } else if(e.key === "ArrowUp") {
        rotate()
    } else if(e.key === 'k') {
        spawnCube()
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}