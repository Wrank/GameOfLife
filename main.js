const MouseClickPos = {
        totalOffsetX: 0,
        totalOffsetY: 0
    }

    const RectSize = {
        height: 10,
        width: 10
    }

    const BoardSize = {
        height: 50,
        width: 50
    };

    // Initialize BlockList which contains the definition of block's position and size.
    const InitializeBlocksStatus = (BlockList) => {
        for (let i = 0; i < BoardSize.height; i++) {
            for (let j = 0; j < BoardSize.width; j++) {
                BlockList.push({
                    indexX: i,
                    indexY: j,
                    x: RectSize.width * i,
                    y: RectSize.height * j,
                    width: RectSize.width,
                    height: RectSize.height,
                    alive: Math.random() > 0.5
                });
            }
        }
    }

    const InitializeCanvas = (canvas, BlockList) => {
        MouseClickPos.totalOffsetX += canvas.offsetLeft - canvas.scrollLeft;
        MouseClickPos.totalOffsetY += canvas.offsetTop - canvas.scrollTop;


        const ctx = canvas.getContext("2d");
        console.log("Context got.");

        // fill the canvas with random blocks.
        UpdateCanvas(BlockList, ctx);

        // Initialize Event Listener
        canvas.addEventListener("click", (event) => {
            console.log(`X:${event.clientX}, Y:${event.clientY} clicked`);

            var pos = {
                x: Math.floor((event.x - MouseClickPos.totalOffsetX) / RectSize.width),
                y: Math.floor((event.y - MouseClickPos.totalOffsetY) / RectSize.height)
            }

            // ctx.clearRect(RectSize.width * pos.x, RectSize.height * pos.y, RectSize.width, RectSize.height);
            ctx.fillRect(pos.x * RectSize.width, pos.y * RectSize.height, RectSize.width, RectSize.height);
        });
        return ctx;
    }

    const LifeLoop = () => {


        BlockList = [];

        const canvas = document.getElementById("canvas");
        InitializeBlocksStatus(BlockList);
        const ctx = InitializeCanvas(canvas, BlockList);

        setInterval(function () {
            // calculate everything
            const updatedBlocks = UpdatedStatus(BlockList);

            // update canvas
            UpdateCanvas(updatedBlocks, ctx);

            BlockList = updatedBlocks;
        }, 1000);
    }

    const GoAhead = (BlockList, ctx) => {
        // calculate everything
        const updatedBlocks = UpdatedStatus(BlockList);

        // update canvas
        UpdateCanvas(updatedBlocks, ctx);
        return updatedBlocks
    }
    const UpdatedStatus = (BlockList) => {
        updatedBlocks = [];
        // status of blocks changes at the same time.
        // so we need a new list to store the 
        BlockList.map(block => {
            const blockCopy = Object.assign({}, block)
            blockCopy.alive = isAlive(block, BlockList);
            updatedBlocks.push(blockCopy);
        });

        return updatedBlocks;
    }

    const isAlive = (block, BlockList) => {
        const neighbors = [{
            // top
            indexX: block.indexX - BoardSize.width,
            indexY: block.indexY - 1
        }, {
            // bottom
            indexX: block.indexX,
            indexY: block.indexY + 1
        }, {
            // left
            indexX: block.indexX - 1,
            indexY: block.indexY
        }, {
            // right
            indexX: block.indexX + 1,
            indexY: block.indexY
        }, {
            // top-left
            indexX: block.indexX - 1,
            indexY: block.indexY - 1
        }, {
            // top-right
            indexX: block.indexX + 1,
            indexY: block.indexY - 1
        }, {
            // bottom-left
            indexX: block.indexX - 1,
            indexY: block.indexY + 1
        }, {
            // bottom-right
            indexX: block.indexX + 1,
            indexY: block.indexY + 1
        }];

        let aliveNeighbors = 0;

        neighbors.map(
            neighbor => {
                const n = BlockList.filter(b => b.indexX === neighbor.indexX && b.indexY === neighbor.indexY)[0]
                if (n && n.alive) {
                    aliveNeighbors += 1;
                }
            }
        );

        return aliveNeighbors >= 2 && aliveNeighbors <= 3
    }

    const UpdateCanvas = (blocks, context) => {
        blocks.map(
            block => {
                if (block.alive) {
                    context.clearRect(block.x, block.y, block.width, block.height);
                    context.fillRect(block.x, block.y, block.width, block.height);
                } else {
                    context.clearRect(block.x, block.y, block.width, block.height);
                    context.strokeRect(block.x, block.y, block.width, block.height);
                }
            }
        );
    }

    LifeLoop();