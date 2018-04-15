# Voronoi-party

Voronoi diagrams are closest distance to a point maps. Since they define areas
and each area has to be distingished from another, colors are used to represent
those. Thus, a perfect party diagram is created if the colors are varied with
time.

This is an experiment with the JavaScript GPU computational library gpu.js. It
allows for GPU computations in the browser using the shader language from
WebGL. Ths idea is pretty cool as JavaScript has (1) a significantly simpler
syntax than OpenCL or CUDA and (2) JavaScript in the browser has access to HTML
so displaying graphics and pictures is easy.

The code in main.js contains a GPU routine that colors the area closest to a
point from an array of randomly placed points. Thus, the Voronoi diagram is
created on the GPU is real time.

The routine limits the maximum radius to the elapsed time since the page was
loaded so the areas grow. Finally, after some time the colors of the areas are
perturbed slightly.

This is nothing more than a visually appealing experiment with GPU computations
in JavaScript. Maybe teaching it in JavaScript is better than directly with
CUDA or OpenCL? Certainly quicker development time.
