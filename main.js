start()

function start() {
    const grid = document.getElementById('grid')
    for (y = 0; y < 16; y++) {
        const row = document.createElement('div')
        row.className = 'gridRow'
        grid.appendChild(row)
        for (x = 0; x < 10; x++) {
            const block = document.createElement('div')
            block.className = 'gridBlock'
            row.appendChild(block)
        }
    }
}


function move(block,x,y) {
    const blockValues = types.find(function(blok) {if(blok.id === block.className) {return true;}})
    if(!((parseInt(block.style.left)+50*x) < blockValues.minL) && !((parseInt(block.style.left)+50*x) > blockValues.maxL)) {
        block.style.left = (parseInt(block.style.left)+50*x)+'px'
    }
    if(!((parseInt(block.style.top)-50*y) > blockValues.maxT)) {
        block.style.top = (parseInt(block.style.top)-50*y)+'px';
    }
}
const blocks = document.getElementsByClassName('cube')
for (i = 0; i < blocks.length; i++) {
    blocks[i].style.top = '0px'
    blocks[i].style.left = '200px'

}

//spawnCube()

window.setInterval(function() {
    const blocks = document.getElementsByClassName('cube')
    for (i = 0; i < blocks.length; i++) {
        move(blocks[i], 0,-1)
    }
}, 500)

function spawnCube() {
    const grid = document.getElementById('grid')
    const cube = document.createElement('div')
    cube.className = 'cube'
    cube.style.top = '0px'
    cube.style.left = '0px'
    cube.style.width = types[0].width+'px';
    cube.style.height = types[0].height+'px';
    for (i = 0; i < types[0].blocksL.length; i++) {
        const blockL = types[0].blocksL[i]
        const blockT = types[0].blocksT[i]
        const sub = document.createElement('div');
        sub.className = 'block'
        sub.style.left = blockL+'px';
        sub.style.top = blockT+'px'
        const color = document.createElement('div')
        color.className = 'block-color'
        sub.appendChild(color)
        cube.appendChild(sub);
    }
    grid.appendChild(cube)
}

document.onkeydown = function (e) {
    const blocks = document.getElementsByClassName('cube')
    for (i = 0; i < blocks.length; i++) {
        if(e.key === "ArrowRight") {
            move (blocks[i], 1,0)
        } else if(e.key === "ArrowLeft") {
            move (blocks[i],-1,0)
        } else if(e.key === "ArrowDown") {
            move (blocks[i],0,-1)
        } else if(e.key === "ArrowUp") {
            move (blocks[i],0,1)
        } else if(e.key === 'k') {
            spawnCube()
        }
    }
}