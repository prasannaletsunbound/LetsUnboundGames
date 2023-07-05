const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let mouseX = 0;
    let mouseY = 0;
    let patternMode = false;
    let dotsMode = false;
    let triMode = false;
    let dots = [];
    let points = [];

    function activatePatternMode() {
      patternMode = true;
      dotsMode = false;
      triMode = false;
      clearCanvas();
      alert("Hover your mouse/hover on your touch screen to create or draw patterns")
    }

    function activateDotsMode() {
      patternMode = false;
      dotsMode = true;
      triMode = false;
      clearCanvas();
      alert("Hover your mouse/hover on your touch screen to see cool effects")
    }

    function activateTriMode() {
      patternMode = false;
      dotsMode = false;
      triMode = true;
      clearCanvas();
      alert("Use mouse/touch to create a triangle with three dots")
    }


    function handleInput(x, y) {
      const rect = canvas.getBoundingClientRect();
      mouseX = x - rect.left;
      mouseY = y - rect.top;

      if (patternMode) {
        createPattern(x,y);
      }

      if (dotsMode) {
        updateDots();
      }

      if (triMode) {
        Triangle();
      }
    }

    function handleTouchEvent(e) {
      e.preventDefault();
      const touch = e.touches[0];
      handleInput(touch.clientX, touch.clientY);
    }

    function handleClickEvent(e) {
      handleInput(e.clientX, e.clientY);
    }

    canvas.addEventListener('mousemove', (e) => {
      handleInput(e.clientX, e.clientY);
    });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleInput(touch.clientX, touch.clientY);
    }, { passive: false });

    canvas.addEventListener('click', (e) => {
      handleInput(e.clientX, e.clientY);
    });
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (points.length < 3) {
            points.push({ x, y });
        }


        if (points.length === 3) {
          setTimeout(() => {
            points = [];
          }, 1000);
        }

        clearCanvas()

        if(triMode){
        Triangle();
        

      }
    });

    function clearCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
  
    function createPattern(x, y) {
      const radius = Math.random() * 25 + 10;
      const color = getRandomColor();
  
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.closePath();
    }
    function updateDots() {
      const cohesionFactor = 0;
      const separationFactor = 0.02;
      const alignmentFactor = 0.02;
      const maxSpeed = 2;

      dots.push({
        x: mouseX,
        y: mouseY,
        vx: Math.random() * maxSpeed - maxSpeed / 2,
        vy: Math.random() * maxSpeed - maxSpeed / 2,
        color: getRandomColor(),
        size: Math.floor(Math.random() * 10) + 2
      });

      dots.forEach((dot) => {
        dot.x += dot.vx;
        dot.y += dot.vy;

        let dx = 0;
        let dy = 0;
        let count = 0;

        dots.forEach((otherDot) => {
          if (dot !== otherDot) {
            const distance = Math.sqrt((dot.x - otherDot.x) ** 2 + (dot.y - otherDot.y) ** 2);

            if (distance < 50) {
              dx += otherDot.x - dot.x;
              dy += otherDot.y - dot.y;
              count++;
            }

            if (distance < 10) {
              dot.vx -= (otherDot.x - dot.x) * separationFactor;
              dot.vy -= (otherDot.y - dot.y) * separationFactor;
            }
          }
        });

        if (count > 0) {
          dx /= count;
          dy /= count;
          dot.vx += dx * cohesionFactor;
          dot.vy += dy * cohesionFactor;
        }

        dot.vx += Math.random() * alignmentFactor - alignmentFactor / 2;
        dot.vy += Math.random() * alignmentFactor - alignmentFactor / 2;

        const speed = Math.sqrt(dot.vx ** 2 + dot.vy ** 2);
        if (speed > maxSpeed) {
          dot.vx = (dot.vx / speed) * maxSpeed;
          dot.vy = (dot.vy / speed) * maxSpeed;
        }

        dot.x = Math.max(0, Math.min(dot.x, canvas.width));
        dot.y = Math.max(0, Math.min(dot.y, canvas.height));
      });

      dots = dots.filter((dot) => dot.x > 0 && dot.x < canvas.width && dot.y > 0 && dot.y < canvas.height);

      drawDots();
    }

    function drawDots() {
      clearCanvas();

      dots.forEach((dot) => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.fill();
        ctx.closePath();
      });
    }

    function getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }


    function Triangle(){
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the points
      ctx.fillStyle = '#ff0000';
      points.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw the triangle
      if (points.length === 3) {
        const p1 = points[0];
        const p2 = points[1];
        const p3 = points[2];

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();

        // Set the color for the two non-hypotenuse lines
        ctx.strokeStyle = 'red'; // Change to the desired color for the non-hypotenuse lines
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw the hypotenuse line with a different color
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.strokeStyle = 'blue'; // Change to the desired color for the hypotenuse line
        ctx.stroke();

        const hypotenuseLength = Math.sqrt(
          Math.pow(p3.x - p1.x, 2) + Math.pow(p3.y - p1.y, 2)
        );
        const hypotenuseAngle = Math.atan2(p3.y - p1.y, p3.x - p1.x);

        // Draw the hypotenuse angle
        ctx.font = '16px Arial';
        ctx.fillStyle = '#ff0000';
        ctx.fillText(
          `Hypotenuse Angle: ${Math.round((hypotenuseAngle * 180) / Math.PI)}°`,
          p1.x + 10,
          p1.y - 10
        );
        

        // Draw the hypotenuse length
        ctx.font = '16px Arial';
        ctx.fillStyle = '#ff0000';
        ctx.fillText(`Hypotenuse Length: ${Math.round(hypotenuseLength)}`, p3.x - 150, p3.y - 10);
      }
    }

    function clearScreen(){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function animate() {
      requestAnimationFrame(animate);

      // Insert any additional animations or updates here

    }

    animate();