let curBlockPosX = []
let curBlockPosY = []

let prevPosX = []
let prevPosY = []

let curTopLeftCorX = 4;
let curTopLeftCorY = 0;

const grid = document.getElementById('grid')
const hold = document.getElementById('hold-Holder')
const next = document.getElementById('next-holder')

let currentBlock;
let currentHold;

let isMoving;
let isRotating;
let end = false;

let nextNumbers = [];

// Create the 3 grids
CreateGrids()
// Generate the randomNumbers for the upcoming 5 blocks
for (g = 0; g < 5; g++) {
    GenerateNumber()
}
// Create the preview on the right side for the upcoming blocks
CreateNextPreview()

// Set the highscore to the local storage highscore
document.getElementById('highScore').textContent = localStorage.getItem('hScore')
if(document.getElementById('highScore').textContent === "") {
    document.getElementById('highScore').textContent = "0"
}

function CreateGrids() {
    // Main grid
    CreateGrid(grid, 10,17)

    // Hold grid
    CreateGrid(hold, 4, 4, true)

    // Next grid
    CreateGrid(next, 4, 19, true)

    end = false;
}

function CreateGrid(parent, xAmount, yAmount, small = false) {
    for (y = 0; y < yAmount; y++) {
        const row = document.createElement('div')
        row.className = (small) ? 'gridRowSmall' : 'gridRow'
        parent.appendChild(row)
        for (x = 0; x < xAmount; x++) {
            const block = document.createElement('div')
            block.className = (small) ? 'gridItemSmall' : 'gridItem'
            row.appendChild(block)
        }
    }
}

function GenerateNumber() {
    while(true) {
        const rand = getRndInteger(0, types.length-1)
        if(parseInt(types[rand].id[types[rand].id.length-1]) === 1) {
            nextNumbers.push(rand);
            break;
        }
    }
}

function CreateNextPreview() {
    // Clear the next preview
    for (y = 0; y < 19; y++) {
        for (x = 0; x < 4; x++) {
            next.children[y].children[x].className = 'gridItemSmall'
        }
    }

    for (i = 0; i < 5; i++) {
        for (j = 0; j < types[nextNumbers[i]].xPos.length; j++) {
            const type = types[nextNumbers[i]]
            let x = type.xPos[j]
            let y = type.yPos[j]+1+i*4

            if(type.id.includes('cube')) {
                x++;
            }

            if(type.id.includes('straight')) {
                y--;
            }

            next.children[y].children[x].className = 'gridItemSmall block ' + type.color;
        }
    }
}

function move(xM,yM) {
    if(isRotating || currentBlock == null) return;
    isMoving = true;

    // Check if
    for (y = 0; y < curBlockPosY.length; y++) {
        if((curBlockPosY[y] + yM) >= 17 || (curBlockPosY[y] + yM) < 0) {
            spawnPiece()
            return;
        }
    }
    for (x = 0; x < curBlockPosX.length; x++) {
        if((curBlockPosX[x] + xM) < 0 || (curBlockPosX[x] + xM) >= 10) {
            return;
        }
    }

    for (y = 0; y < curBlockPosY.length; y++) {
            if(DetectIfBlock(curBlockPosX[y]+xM, curBlockPosY[y]+yM)) {
                if(yM!==0) {
                    spawnPiece()
                }
                return;
            }
    }

    ClearCurBlockVis()

    for (y = 0; y < curBlockPosY.length; y++) {
        curBlockPosY[y] += yM
        curBlockPosX[y] += xM
    }
    curTopLeftCorX += xM;
    curTopLeftCorY += yM;

    for (y = 0; y < curBlockPosY.length; y++) {
            grid.children[curBlockPosY[y]].children[curBlockPosX[y]].className = 'gridItem block moving ' + currentBlock.color;
    }
    isMoving = false;
    UpdateDropPreview()
}

function UpdateDropPreview() {
    let done = false;
    let extraYs = [0, 0, 0, 0];
    for (i = 0; i < currentBlock.xPos.length; i++) {
        while(!done) {
            const x = (currentBlock.xPos[i]) + curTopLeftCorX
            const y = (currentBlock.yPos[i]) + curTopLeftCorY + extraYs[i]

            if((y > 16 || DetectIfBlock(x,y))) {
                break;
            } else {
                extraYs[i] = extraYs[i]+1;
            }
        }
    }
    const howFarDown = extraYs.reduce((a, b) => Math.min(a, b))-1
    ClearDropPreview();
    if(howFarDown < 4) return;
    for (i = 0; i < currentBlock.xPos.length; i++) {
        const x = (currentBlock.xPos[i]) + curTopLeftCorX
        const y = (currentBlock.yPos[i]) + curTopLeftCorY + howFarDown

        prevPosX.push(x)
        prevPosY.push(y)

        grid.children[y].children[x].className = 'gridItem preview Gray'
    }
}

function ClearDropPreview() {
    for (i = 0; i < prevPosX.length; i++) {
        const x = (prevPosX[i])
        const y = (prevPosY[i])

        if(grid.children[y].children[x].className.includes('preview')) {
            grid.children[y].children[x].className = 'gridItem'

        }
    }
}

function ClearCurBlockVis() {
    for (i = 0; i < currentBlock.xPos.length; i++) {
        const x = (currentBlock.xPos[i]) + curTopLeftCorX
        const y = (currentBlock.yPos[i]) + curTopLeftCorY
        grid.children[y].children[x].className = 'gridItem'
    }
    for (y = 0; y < curBlockPosY.length; y++) {
        grid.children[curBlockPosY[y]].children[curBlockPosX[y]].className = 'gridItem'
    }
}

function checkForLines() {
    let howManyLines = 0;
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
            howManyLines++;
        }
    }
    document.getElementById('score').textContent = (parseInt(document.getElementById('score').textContent)+pointForLines[howManyLines]).toString()

    UpdateHighScore();
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

function spawnPiece(spawnNumber = -1) {

    // solid previous block
    for (y = 0; y < curBlockPosY.length; y++) {
        if(grid.children[curBlockPosY[y]].children[curBlockPosX[y]].className.includes('block')) {
            grid.children[curBlockPosY[y]].children[curBlockPosX[y]].className = 'gridItem block ' + currentBlock.color;
        }
    }

    holdThisMove = false;

    checkForLines()

    while (true) {
        let rand;
        if (spawnNumber === -1) {
            rand = nextNumbers[0]
            for (i = 0; i < types[rand].xPos.length; i++) {
                const x = (types[rand].xPos[i])+4
                const y = types[rand].yPos[i]

                if(DetectIfBlock(x,y)) {
                    endGame();
                    return;
                }
            }
            GenerateNumber()
            nextNumbers.shift()
            CreateNextPreview()
        } else if(parseInt(types[spawnNumber].id[types[spawnNumber].id.length-1]) !== 1) {
            const supSpawn = types[spawnNumber];
            rand = types.findIndex(b => b.id.includes(supSpawn.id.slice(0,-1)))
        } else {
            rand = spawnNumber;
        }

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
            UpdateDropPreview()
            break;
        }
    }
}

function endGame() {
    document.getElementById('end').style.display = 'unset';
    isEnd = true;
}

function UpdateHighScore() {
    const currentHighScore = parseInt(document.getElementById('highScore').textContent)
    const currentScore = parseInt(document.getElementById('score').textContent)

    if(currentScore > currentHighScore) {
        document.getElementById('highScore').textContent = currentScore.toString()
    }
    localStorage.setItem('hScore', currentScore.toString())
}

function HardDrop() {
    for (j = 0; j < 16; j++) {
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
    if(isMoving) return;
    isRotating = true;
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
        isRotating = false;
    }

    ClearCurBlockVis()

    for (i = 0; i < nexBlock.xPos.length; i++) {
        const x = (nexBlock.xPos[i])+curTopLeftCorX
        const y = (nexBlock.yPos[i])+curTopLeftCorY

        grid.children[y].children[x].className = 'gridItem block moving ' + currentBlock.color;
        curBlockPosX[i] = x
        curBlockPosY[i] = y
    }
    currentBlock = nexBlock;
    UpdateDropPreview()
}

function ClearHoldVis() {
    for (y = 0; y < 4; y++) {
        for (x = 0; x < 4; x++) {
            hold.children[y].children[x].className = 'gridItemSmall'
        }
    }
}

function Hold() {
    if(currentBlock == null) return;
    if(holdThisMove) return;
    ClearHoldVis();
    ClearCurBlockVis()
    for (i = 0; i < currentBlock.xPos.length; i++) {
        let x = currentBlock.xPos[i]
        let y = currentBlock.yPos[i]

        // If its a cube move it a bit to the left
        if(currentBlock.id.includes('cube')) {
            x++;
        }

        // If its not a straight piece move it down a bit
        if(!currentBlock.id.includes('straight')) {
            y++;
        }

        hold.children[y].children[x].className = 'gridItemSmall block ' + currentBlock.color;
    }
    const wasBlock = currentBlock;
    if(currentHold === undefined) {
        spawnPiece()
    } else {
        spawnPiece(types.findIndex((e) => e.id === currentHold.id))
    }
    currentHold = wasBlock;
    holdThisMove = true;
}

// Key presses for the actions
document.onkeydown = function (e) {
    if(end) return;
    if(e.key === "ArrowRight") {
        move (1,0)
    } else if(e.key === "ArrowLeft") {
        move (-1,0)
    } else if(e.key === "ArrowDown") {
        move (0,1)
    } else if(e.key === "ArrowUp") {
        rotate()
    } else if(e.key === 'k' && currentBlock === undefined) {
        spawnPiece()
    } else if(e.key === ' ') {
        HardDrop()
    } else if(e.key === "Shift") {
        Hold()
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}