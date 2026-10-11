let peces = []; 
let tiburon; 
 
let cantidadPeces = 100; 
let radio = 150;
 
function setup() { 
  createCanvas(800, 600); 
   
  crearPeces(); 
  crearTiburon(); 
} 
 
function draw() { 
  background(0, 127, 255); 
  perseguirPeces(tiburon, peces);
  mover(tiburon);
  aplicarBorde(tiburon); 
  mostrarTiburon(tiburon); 
 
  for(let i = 0; i < peces.length; i++) {

  let margen = 20;

 
  if(
    peces[i].x > margen &&
    peces[i].x < width - margen &&
    peces[i].y > margen &&
    peces[i].y < height - margen
  ) {

    alinearPez(peces[i], peces);
    escapeDeTiburon(peces[i], tiburon);
  }

  mover(peces[i]);

  aplicarBorde(peces[i]);

  mostrarPez(peces[i]);

  }
} 
 
function crearPeces() { 
  for(let i = 0; i < cantidadPeces; i++) { 
    let unPez = { 
      
      x: random(width / 3, width * 2 / 3), 
      y: random(height / 3, height * 2 / 3), 
      vx: random(-1.5, 1.5), 
      vy: random(-1.5, 1.5), 
      d: 8  
    }; 
    peces.push(unPez); 
  } 
} 
 
function crearTiburon() { 
  tiburon = { 
    x: width / 2, 
    y: height / 2, 
    vx: random(-1.3, 1.3), 
    vy: random(-1.3, 1.3), 
    d: 32  
  }; 
} 
 
function mostrarPez(pez) {
  noStroke();
  fill(255, 140, 0);

  if (pez.vx >= 0) {
    
    triangle(
      pez.x + pez.d / 2, pez.y,
      pez.x - pez.d / 2, pez.y - pez.d / 2,
      pez.x - pez.d / 2, pez.y + pez.d / 2
    );
  } else {
    
    triangle(
      pez.x - pez.d / 2, pez.y,
      pez.x + pez.d / 2, pez.y - pez.d / 2,
      pez.x + pez.d / 2, pez.y + pez.d / 2
    );
  }
} 
 
function mostrarTiburon(tiburon) { 
  noStroke(); 
  fill(150);  
  ellipse(tiburon.x, tiburon.y, tiburon.d, tiburon.d); 
} 
 
function mover(a) { 
  a.x += a.vx; 
  a.y += a.vy; 
} 

function esVecino(a, b, r) {
  if(a === b) {
    return false;
  }
  return dist(a.x, a.y, b.x, b.y) < r;
}

function vecinosDe(a, peces, r) {
  let vecinos = [];
  for(let i = 0; i < peces.length; i++) {
    let b = peces[i];
    if(esVecino(a, b, r)) {
      vecinos.push(b);
    }
  }
  return vecinos;
}

function alinearPez(a, peces) {
  let vecinos = vecinosDe(a, peces, radio);

  if(vecinos.length > 0) {
    let sumaVx = 0;
    let sumaVy = 0;

    for(let i = 0; i < vecinos.length; i++) {
      sumaVx += vecinos[i].vx;
      sumaVy += vecinos[i].vy;
    }

    let promedioVx = sumaVx / vecinos.length;
    let promedioVy = sumaVy / vecinos.length;

    
    a.vx = lerp(a.vx, promedioVx, 0.2);
    a.vy = lerp(a.vy, promedioVy, 0.2);
  }
}
function aplicarBorde(a) {

  let r = a.d / 2;

  if(a.x <= r && a.vx < 0) {
    a.x = r;
    a.vx *= -1;
  }

  if(a.x >= width - r && a.vx > 0) {
    a.x = width - r;
    a.vx *= -1;
  }

  if(a.y <= r && a.vy < 0) {
    a.y = r;
    a.vy *= -1;
  }

  if(a.y >= height - r && a.vy > 0) {
    a.y = height - r;
    a.vy *= -1;
  }
}

function escapeDeTiburon(pez, tiburon) { //Juan pablo Barriga
  let distancia = dist(pez.x, pez.y, tiburon.x, tiburon.y);
  
  let radioMiedo = 100; 

  if(distancia < radioMiedo && distancia > 0) {
    let direccionX = pez.x - tiburon.x;
    let direccionY = pez.y - tiburon.y;

    let velocidadEscapeX = direccionX / 30;
    let velocidadEscapeY = direccionY / 30;

    pez.vx = lerp(pez.vx, velocidadEscapeX, 0.3);
    pez.vy = lerp(pez.vy, velocidadEscapeY, 0.3);
  }
}


function perseguirPeces(tiburon, peces) { //Juan pablo Barriga
  let radioCaza = 200;

  let sumaX = 0;
  let sumaY = 0;
  let cantidad = 0;

  for(let i = 0; i < peces.length; i++) {
    let distancia = dist(tiburon.x, tiburon.y, peces[i].x, peces[i].y);
    if(distancia < radioCaza) {
      sumaX += peces[i].x;
      sumaY += peces[i].y;
      cantidad++;
    }
  }

  if(cantidad > 0) {
    let promedioX = sumaX / cantidad;
    let promedioY = sumaY / cantidad;

    let direccionX = promedioX - tiburon.x;
    let direccionY = promedioY - tiburon.y;

    let velocidadObjetivoX = direccionX / 100;
    let velocidadObjetivoY = direccionY / 100;

    tiburon.vx = lerp(tiburon.vx, velocidadObjetivoX, 0.05);
    tiburon.vy = lerp(tiburon.vy, velocidadObjetivoY, 0.05);
  }
}
