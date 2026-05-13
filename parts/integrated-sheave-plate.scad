$fn = 120;

plate_width = 42;
plate_height = 28;
plate_thickness = 4;
bolt_hole_diameter = 4.5;
bolt_hole_spacing = 26;

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

module mounting_plate() {
  translate([0, 0, 28.7])
  linear_extrude(height = plate_thickness)
  difference() {
    square([plate_width, plate_height], center = true);
    translate([-bolt_hole_spacing / 2, 0])
    circle(d = bolt_hole_diameter);
    translate([bolt_hole_spacing / 2, 0])
    circle(d = bolt_hole_diameter);
  }
}

union() {
  stepped_sheave_body();
  mounting_plate();
}
