cheek_thickness = 6;
cheek_depth = 22;
inner_gap = 40;
cheek_bottom_y = -112;
shaft_clearance_radius = 6.6;
top_bridge_y = 28;
top_bridge_height = 12;
top_bridge_depth = 14;
eye_outer_radius = 18;
eye_inner_radius = 7;
eye_center_y = 48;
bolt_hole_radius = 2.2;
bolt_hole_spacing = 56;
upper_bolt_y = 22;

module housing() {
  difference() {
    union() {
      for (offset = [
        -(inner_gap + cheek_thickness) / 2,
        (inner_gap + cheek_thickness) / 2,
      ]) {
        translate([offset, (top_bridge_y + cheek_bottom_y) / 2, 0])
          cube([cheek_thickness, top_bridge_y - cheek_bottom_y, cheek_depth], center = true);
      }

      translate([0, top_bridge_y, 0])
        cube([inner_gap + cheek_thickness * 2, top_bridge_height, top_bridge_depth], center = true);

      translate([0, eye_center_y, 0])
        rotate([0, 90, 0])
          cylinder(h = inner_gap + cheek_thickness * 2, r = eye_outer_radius, center = true, $fn = 128);
    }

    translate([0, eye_center_y, 0])
      rotate([0, 90, 0])
        cylinder(h = inner_gap + cheek_thickness * 2 + 2, r = eye_inner_radius, center = true, $fn = 128);

    for (offset = [
      -(inner_gap + cheek_thickness) / 2,
      (inner_gap + cheek_thickness) / 2,
    ]) {
      translate([offset, 0, 0])
        rotate([0, 90, 0])
          cylinder(h = cheek_thickness + 2, r = shaft_clearance_radius, center = true, $fn = 96);

      for (bolt_y = [upper_bolt_y, upper_bolt_y - bolt_hole_spacing]) {
        translate([offset, bolt_y, 0])
          rotate([0, 90, 0])
            cylinder(h = cheek_thickness + 2, r = bolt_hole_radius, center = true, $fn = 64);
      }
    }
  }
}

housing();
