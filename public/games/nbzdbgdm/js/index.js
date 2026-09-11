svgpong = function () {
    var field = document.getElementById('field');
    if (field === null) {
        alert("Couldn't find svg graphic");
        return;
    }

    (function () {
        var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        window.requestAnimationFrame = requestAnimationFrame;
    })();

    // Wrap SVG elements for easier access

    function wrapPaddle(name) {
        var e = document.getElementById(name)
        var r = {}

        r.width = e.width.baseVal.value
        r.height = e.height.baseVal.value

        function update() {
            r.right = r.x + r.width
            r.left = r.x
            r.top = r.y
            r.bottom = r.y + r.height
        }

        Object.defineProperty(r, "x", {
            get: function () { return e.x.baseVal.value },
            set: function (val) { e.x.baseVal.value = val; update(); }
        })
        Object.defineProperty(r, "y", {
            get: function () { return e.y.baseVal.value },
            set: function (val) { e.y.baseVal.value = val; update(); }
        })
        Object.defineProperty(r, "cx", {
            get: function () { return r.x + r.width / 2;},
            set: function (val) { r.x = val - r.width / 2; }
        })
        Object.defineProperty(r, "cy", {
            get: function () { return r.y + r.height / 2; },
            set: function (val) { r.y = val - r.height / 2; }
        })

        update();

        return r;
    }
    var player = wrapPaddle('paddleLeft')
    var computer = wrapPaddle('paddleRight')

    var ball = function () {
        var e = document.getElementById('ball')

        var r = {}
        r.dx = 0
        r.dy = 0

        function update() {
            r.right = r.cx + r.r;
            r.left = r.cx - r.r;
            r.top = r.cy - r.r;
            r.bottom = r.cy + r.r;
        }

        Object.defineProperty(r, "cx", {
            get: function () { return e.cx.baseVal.value },
            set: function (val) { e.cx.baseVal.value = val; update(); }
        })
        Object.defineProperty(r, "cy", {
            get: function () { return e.cy.baseVal.value },
            set: function (val) { e.cy.baseVal.value = val; update(); }
        })
        Object.defineProperty(r, "r", {
            get: function () { return e.r.baseVal.value },
            set: function (val) { e.r.baseVal.value = val; update(); }
        })

        update();

        return r;
    }();

    var playerScore= document.getElementById('playerScore')
    var computerScore = document.getElementById('computerScore')

    var box = field.viewBox.baseVal;

    // Initial ball state vector init
    var startX = box.width / 2;
    var startY = box.height / 2;

    var clock = function () {
        var last = Date.now();

        return {
            'reset': function () {
                var now = Date.now();
                var result = now - last;
                last = now;
                return result;
            }
        }
    }()

    var animSpeed = 0.1; // Pix per ms
    var computerSpeed = 7;

    var scorePlayer = 0;
    var scoreComputer = 0;

    var inputY = 0;

    var vertCenter = box.height / 2;
    var horCenter = box.width / 2;
    var deflectFactor = 0.1;

    function collideBallWith(what) {
        if (ball.bottom < what.top || ball.top > what.bottom) {
            // No collision
            return;
        }

        var voff = ball.cy - what.cy;

        if (ball.dx > 0) {
            // Collide with left border
            if (ball.right >= what.left && ball.left < what.right) {
                // Collision
                ball.cx -= ball.right - what.left;
                ball.dx *= -1;
                ball.dy += voff * deflectFactor;
            }
        } else {
            // Collide with right border
            if (ball.left <= what.right && ball.right > what.left) {
                // Collision
                ball.cx += what.right - ball.left;
                ball.dx *= -1;
                ball.dy += voff * deflectFactor;
            }
        }
    }

    function boundPaddle(paddle) {
        if (paddle.bottom > box.height) {
            paddle.y = box.height - paddle.height;
        } else if (paddle.top < 0) {
            paddle.y = 0;
        }
    }

    function scored() {
        ball.dx = 0;
        ball.dy = 0;

        ball.cx = startX;
        ball.cy = startY;

        setTimeout(function () {
            if (Math.random() > 0.5) ball.dx = 5;
            else ball.dx = -5;

            ball.dy = 5 - Math.random() * 10;
        }, 3000);
    }

    scored(); // Setup

    var animate = function () {
        var suspense = field.suspendRedraw(6000);

        var anim_factor = clock.reset() * animSpeed
        ball.cx += ball.dx * anim_factor;
        ball.cy += ball.dy * anim_factor;

        // Player movement
        player.cy = inputY;
        boundPaddle(player)

        // Computer ki
        if (ball.dx > 0) {
            var offset = ball.cy - computer.cy;
            var motivation = Math.min(1, Math.pow(Math.abs(offset) / (computer.height / 4), 2));
        } else {
            var offset = vertCenter - computer.cy;
            var motivation = Math.abs(offset) > vertCenter / 4 ? 0.5 : 0;
        }



        if (offset > 0) {
            computer.cy += computerSpeed * anim_factor * motivation;
        } else {
            computer.cy -= computerSpeed * anim_factor * motivation;
        }
        boundPaddle(computer)

        // Paddle bounding
        collideBallWith(player)
        collideBallWith(computer)

        // Wall bounding and scoring
        if (ball.right >= box.width) {
            ball.cx -= ball.right - box.width;
            ball.dx *= -1;
            // Score
            scorePlayer += 1;
            playerScore.textContent = scorePlayer;
            scored()
        } else if (ball.left <= 0) {
            ball.cx -= ball.left;
            ball.dx *= -1;

            //Score
            scoreComputer += 1;
            computerScore.textContent = scoreComputer;
            scored()
        }

        if (ball.top <= 0) {
            ball.cy -= ball.top
            ball.dy *= -1;
        } else if (ball.bottom >= box.height) {
            ball.cy -= ball.bottom - box.height;
            ball.dy *= -1;
        }
        field.unsuspendRedraw(suspense);
        requestAnimationFrame(animate);
    }

    var matrix = field.getScreenCTM().inverse();

    field.addEventListener("mousemove", function (event) {
        event.preventDefault();

        var p = field.createSVGPoint();
        p.x = event.clientX;
        p.y = event.clientY;
        var insvg = p.matrixTransform(matrix);

        inputY = insvg.y;
    });

    field.addEventListener("touchmove", function (event) {
        event.preventDefault();

        var p = field.createSVGPoint();
        p.x = event.touches[0].clientX
        p.y = event.touches[0].clientY
        var insvg = p.matrixTransform(matrix);

        inputY = insvg.y;
    });

    window.onresize = function (event) {
        matrix = field.getScreenCTM().inverse();
    };

    // Start animating
    requestAnimationFrame(animate);
}