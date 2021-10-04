let curBlockPosX = []
let curBlockPosY = []
let curTopLeftCorX = 4;
let curTopLeftCorY = 0;
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
            spawnTeri()
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
                    spawnTeri()
                }
                return;
            }
    }

    clearCurrentBlock()

    for (y = 0; y < curBlockPosY.length; y++) {
        curBlockPosY[y] += yM
        curBlockPosX[y] += xM
    }
    curTopLeftCorX += xM;
    curTopLeftCorY += yM;

    for (y = 0; y < curBlockPosY.length; y++) {
            grid.children[curBlockPosY[y]].children[curBlockPosX[y]].className = 'gridItem block moving ' + currentBlock.color;
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
                grid.children[y+1].children[x].className = grid.children[y].children[x].className
                grid.children[y].children[x].className = 'gridItem'

            }
        }
    }
}

window.setInterval(function() {
    move(0,1)

}, 500)

function spawnTeri() {

    // reset previous block
    for (y = 0; y < curBlockPosY.length; y++) {
        grid.children[curBlockPosY[y]].children[curBlockPosX[y]].className = 'gridItem block ' + currentBlock.color;
    }

    checkForLines()

    while (true) {
        const rand = getRndInteger(0, types.length-1)

        if(parseInt(types[rand].id[types[rand].id.length-1]) === 1) {
            for (i = 0; i < types[rand].xPos.length; i++) {
                const x = (types[rand].xPos[i])+4
                const y = types[rand].yPos[i]

                grid.children[y].children[x].className += ' block moving ' + types[rand].color;
                curBlockPosX[i] = x
                curBlockPosY[i] = y
            }
            currentBlock = types[rand]
            curTopLeftCorX = 4;
            curTopLeftCorY = 0;
            break;
        }
    }
}

function HardDrop() {
    for (j = 0; j < 15; j++) {
        for (i = 0; i < currentBlock.xPos.length; i++) {
            const x = (currentBlock.xPos[i])+curTopLeftCorX
            const y = (currentBlock.yPos[i])+curTopLeftCorY+1

            if(y > 16 || DetectIfBlock(x,y)) {
                move(0,1)
                return;
            }
        }
        move(0,1)
    }
}

function DetectIfBlock(x,y) {
    return !(grid.children[y].children[x].className.includes('moving')) && grid.children[y].children[x].className.includes('block')
}

function rotate() {
    let currentId = parseInt(currentBlock.id[currentBlock.id.length-1])
    if(currentId === 4) currentId = 0
    const type = currentBlock.id.replace(/[0-9]/g, '')
    const nexBlock = types.find(value => {
        if(value.id === type+(currentId+1)) return true;
    })

    for (i = 0; i < nexBlock.xPos.length; i++) {
        while ((nexBlock.xPos[i])+curTopLeftCorX < 0) {
            curTopLeftCorX++
        }
        while ((nexBlock.xPos[i])+curTopLeftCorX > 9) {
            curTopLeftCorX--;
        }
        while((nexBlock.yPos[i])+curTopLeftCorY > 16) {
            curTopLeftCorY--;
        }

        const x = (nexBlock.xPos[i])+curTopLeftCorX
        const y = (nexBlock.yPos[i])+curTopLeftCorY

        if(DetectIfBlock(x,y)) {
            return;
        }
    }

    clearCurrentBlock()

    for (i = 0; i < nexBlock.xPos.length; i++) {
        const x = (nexBlock.xPos[i])+curTopLeftCorX
        const y = (nexBlock.yPos[i])+curTopLeftCorY

        grid.children[y].children[x].className = 'gridItem block moving ' + currentBlock.color;
        curBlockPosX[i] = x
        curBlockPosY[i] = y
    }
    currentBlock = nexBlock;
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
        spawnTeri()
    } else if(e.key === ' ') {
        HardDrop()
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}