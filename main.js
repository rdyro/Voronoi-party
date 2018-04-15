"use strict";

window.onload=main;

function main() {
  //var width = 1024;
  //var height = 576;
  var width = window.innerWidth - 20;
  var height = window.innerHeight - 20;
  const gpu = new GPU({mode: "webgl"});

  /* create N particles with a position and color */
  const N = 30;
  var position = new Array(N * 2);
  for (var i = 0; i < (2 * N); i++) {
    position[i] = Math.random();
  }
  var color = new Array(3 * N);
  for (var i = 0; i < N; i++) {
    var rand_color = [Math.random(), Math.random(), Math.random()];
    color[3 * i + 0] = rand_color[0];
    color[3 * i + 1] = rand_color[1];
    color[3 * i + 2] = rand_color[2];
  }

  /* render the Voronoi diagram every 16 ms (~60 frames per second) */
  setInterval(function() { 
    width = window.innerWidth - 20;
    height = window.innerHeight - 20;
    makeDiagram(gpu, width, height, position, color); 
  }, 16);
}

var t = 0;
function makeDiagram(gpu, width, height, position, color) {
  /* hard-code constant */
  const GRID = 0;
  const RADIUS = 1;

  /* extract the number of particles from the length of the position array */
  const N = position.length / 2;

  /* once the grid is fairly established, after 200 frames, perturb */
  if (t > 200) {
    //randomlyPerturbPositionAndColor(position, color);
    randomlyPerturbColor(color);
    //randomlyPerturbPosition(position);
  }

  /* translate position in (0.0, 1.0) to (0, width/height) */
  var p = new Array(N * 2);
  for (var i = 0; i < (position.length / 2); i++) {
    p[2*i] = position[2*i] * width;
    p[2*i + 1] = position[2*i + 1] * height;
  }

  /* create a GPU function */
  const render = gpu.createKernel(function(p, color, n, width, height, max_radius, typeOfDistance) {
    const infinity = 2147483647;
    const GRID = 0;
    const RADIUS = 1;

    if (n != 0) {
      /* get x and y position from the GPU thread */
      var x = this.thread.x;
      var y = this.thread.y;
      var idx = 0;

      /* find the cell center to which the pixel is closest */
      var rmin = infinity;
      for (var i = 0; i < n; i++) {
        var r;
        var px = p[2 * i + 0];
        var py = p[2 * i + 1];
        if (typeOfDistance == GRID) {
          r = Math.abs(px - x) + Math.abs(py - y);
        } else if (typeOfDistance == RADIUS) {
          r = Math.sqrt((px - x) * (px - x) + (py - y) * (py - y));
        }
        if (r < rmin) {
          idx = i;
          rmin = r;
        }
      }
      /* color the center of the cell black */
      if (rmin < 3) {
        this.color(0, 0, 0, 1);
      } 
      /* set color only to locations within max radius from a center */
      else if (rmin > max_radius) {
        this.color(1, 1, 1, 1);
      } else {
        this.color(color[3*idx], color[3*idx + 1], color[3*idx + 2], 1);
      }
    /* if no particles, then color everything black */
    } else {
      this.color(0, 0, 0, 1);
    }
  }).setOutput([width, height]).setGraphical(true);
  /* call the GPU function */
  render(p, color, (p.length) / 2, width, height, t, RADIUS);

  /* place the GPU rendering as a canvas in HTML */
  const canvas = render.getCanvas();
  canvas.id = "my_canvas";
  document.getElementsByTagName("body")[0].replaceChild(canvas, document.getElementById("my_canvas"));

  /* advance the time, increase the radius for coloring */
  t += 1;
}

function randomlyPerturbPositionAndColor(position, color) {
  for (var i = 0; i < position.length; i++) {
    position[i] += 0.05 * (Math.random() - 0.5);
    if (position[i] < 0.0) {
      position[i] = 0.0;
    }
    if (position[i] > 1.0) {
      position[i] = 1.0;
    }
  }
  for (var i = 0; i < color.length; i++) {
    color[i] += 0.6 * (Math.random() - 0.5);
    if (color[i] < 0.0) {
      color[i] = 0.0;
    }
    if (color[i] > 1.0) {
      color[i] = 1.0;
    }
  }
}

function randomlyPerturbPosition(position) {
  for (var i = 0; i < position.length; i++) {
    position[i] += 0.05 * (Math.random() - 0.5);
    if (position[i] < 0.0) {
      position[i] = 0.0;
    }
    if (position[i] > 1.0) {
      position[i] = 1.0;
    }
  }
}

function randomlyPerturbColor(color) {
  for (var i = 0; i < color.length; i++) {
    color[i] += 0.6 * (Math.random() - 0.5);
    if (color[i] < 0.0) {
      color[i] = 0.0;
    }
    if (color[i] > 1.0) {
      color[i] = 1.0;
    }
  }
}
