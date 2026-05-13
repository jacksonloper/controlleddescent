barrel_radius = 15;
barrel_length = 30;
flange_radius = 30;
flange_thickness = 4;
square_bore = 12;

module spool() {
  difference() {
    union() {
      cylinder(h = barrel_length, r = barrel_radius, center = true, $fn = 96);

      for (offset = [
        -(barrel_length + flange_thickness) / 2,
        (barrel_length + flange_thickness) / 2,
      ]) {
        translate([offset, 0, 0])
          rotate([0, 90, 0])
            cylinder(h = flange_thickness, r = flange_radius, center = true, $fn = 96);
      }
    }

    cube([barrel_length + flange_thickness * 2 + 2, square_bore, square_bore], center = true);
  }
}

rotate([0, 90, 0]) spool();
