barrel_radius = 15;
barrel_length = 30;
flange_radius = 30;
flange_thickness = 4;
square_bore = 12;

module spool() {
  difference() {
    union() {
      // barrel along Z; outer rotate([0,90,0]) will convert the whole module to X-axis
      cylinder(h = barrel_length, r = barrel_radius, center = true, $fn = 96);

      // flanges also along Z, translated along Z so they land at x = ±17 after the outer rotation
      for (offset = [
        -(barrel_length + flange_thickness) / 2,
        (barrel_length + flange_thickness) / 2,
      ]) {
        translate([0, 0, offset])
          cylinder(h = flange_thickness, r = flange_radius, center = true, $fn = 96);
      }
    }

    // bore along Z (long axis); outer rotation converts it to align with the barrel
    cube([square_bore, square_bore, barrel_length + flange_thickness * 2 + 2], center = true);
  }
}

rotate([0, 90, 0]) spool();
