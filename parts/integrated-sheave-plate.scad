$fn = 120;

outer_flange_thickness = 4;
flange_hole_diameter = 4.5;
flange_hole_offset = 7;
epsilon = 0.1;

profile_points = [
  [0, -28.7],
  [10, -28.7],
  [10, -24.7],
  [2.5, -24.7],
  [2.5, -16.7],
  [10, -16.7],
  [10, -12.7],
  [2, -12.7],
  [2, 12.7],
  [10, 12.7],
  [10, 16.7],
  [2.5, 16.7],
  [2.5, 24.7],
  [10, 24.7],
  [10, 28.7],
  [0, 28.7],
];

module stepped_sheave_body() {
  rotate_extrude()
  polygon(points = profile_points);
}

module outer_flange_holes(z_start) {
  for (x = [-flange_hole_offset, flange_hole_offset]) {
    translate([x, 0, z_start - epsilon])
    cylinder(h = outer_flange_thickness + 2 * epsilon, d = flange_hole_diameter);
  }
}

difference() {
  stepped_sheave_body();
  outer_flange_holes(-28.7);
  outer_flange_holes(24.7);
}
