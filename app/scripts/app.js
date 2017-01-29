let ctx;
let stage;

// Debugger for position
$('#stage').on('click', (e) => {
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  console.log(x, y);
});

// Init
$(() => {
  const canvas = document.getElementById('stage');
  ctx = canvas.getContext('2d');

  const img = new Image();
  img.src = "../assets/calliePattern.png";

  img.onload = () => {
    const pattern = ctx.createPattern(img, "");

    ctx.beginPath();
    ctx.fillStyle = pattern;
    ctx.rect(10, 10, 20, 20);
    ctx.stroke();
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = pattern;
    ctx.arc(40, 30, 10, 0, Math.PI * 2, false);
    ctx.stroke();
    ctx.fill();
  };

});

