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

    ctx.moveTo(100, 30);
    ctx.lineTo(100, 75);
    ctx.lineTo(80, 75);
    ctx.fill();

  };

});


