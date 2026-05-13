square_width = 12;
square_length = 30;
round_radius = 4;
round_length = 30;

module shaft() {
  union() {
    cube([square_length, square_width, square_width], center = true);

    for (offset = [
      -(square_length + round_length) / 2,
      (square_length + round_length) / 2,
    ]) {
      translate([offset, 0, 0])
        rotate([0, 90, 0])
          cylinder(h = round_length, r = round_radius, center = true, $fn = 96);
    }
  }
}

shaft();
