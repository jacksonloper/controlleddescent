inch = 25.4;

$fn = 96;

// Design inputs from the brief.
rope_contact_width = 1.00 * inch;
drum_diameter = 2.00 * inch;
flange_height = 0.20 * inch;
flange_thickness = 0.12 * inch;
shaft_diameter = 0.4375 * inch;
axle_clearance_diameter = shaft_diameter + 0.012 * inch;
side_running_clearance = 0.040 * inch;

outer_plate_diameter = 2.80 * inch;
outer_plate_thickness = 0.25 * inch;
center_boss_diameter = 0.90 * inch;
center_boss_extra = 0.15 * inch;
sheave_hub_diameter = 1.10 * inch;
sheave_hub_width = 0.50 * inch;

bolt_hole_count = 4;
bolt_hole_diameter = 0.270 * inch;
bolt_circle_diameter = 2.00 * inch;
bolt_boss_diameter = 0.55 * inch;

eyelet_opening_width = 0.45 * inch;
eyelet_outer_width = 0.30 * inch;
eyelet_opening_height = 0.80 * inch;
eyelet_outer_height = 1.35 * inch;
eyelet_center_z = outer_plate_diameter / 2 + 0.60 * inch;
support_radius = 0.16 * inch;

texture_enabled = true;
texture_depth = 0.020 * inch;
texture_pitch = 0.080 * inch;
texture_slice_height = 0.030 * inch;

exploded_view = false;
exploded_sheave_offset = outer_plate_diameter * 0.90;

drum_radius = drum_diameter / 2;
flange_radius = drum_radius + flange_height;
shaft_radius = shaft_diameter / 2;
axle_clearance_radius = axle_clearance_diameter / 2;
outer_plate_radius = outer_plate_diameter / 2;
total_sheave_width = rope_contact_width + 2 * flange_thickness;
frame_inner_width = total_sheave_width + 2 * side_running_clearance;
frame_outer_width = frame_inner_width + 2 * outer_plate_thickness;
eyelet_span = frame_outer_width + 0.10 * inch;
eyelet_bottom_z = eyelet_center_z - eyelet_outer_height / 2;

module x_cylinder(length, radius, center = true) {
    rotate([0, 90, 0]) cylinder(h = length, r = radius, center = center);
}

module capsule_2d(height, width) {
    hull() {
        translate([0, -(height - width) / 2]) circle(d = width);
        translate([0, (height - width) / 2]) circle(d = width);
    }
}

module textured_drum(width, radius, depth, pitch, slice_height) {
    if (!texture_enabled || depth <= 0) {
        x_cylinder(width, radius);
    } else {
        slices = max(1, ceil(width / slice_height));
        for (i = [0 : slices - 1]) {
            x = -width / 2 + (i + 0.5) * width / slices;
            band_radius = radius - depth * 0.5 * (1 - cos(360 * x / pitch));
            translate([x, 0, 0])
                x_cylinder(width / slices + 0.01, band_radius);
        }
    }
}

module sheave() {
    difference() {
        union() {
            textured_drum(rope_contact_width, drum_radius, texture_depth, texture_pitch, texture_slice_height);

            for (side = [-1, 1]) {
                translate([side * (rope_contact_width / 2 + flange_thickness / 2), 0, 0])
                    x_cylinder(flange_thickness, flange_radius);
            }

            x_cylinder(sheave_hub_width, sheave_hub_diameter / 2);
        }

        x_cylinder(total_sheave_width + 0.20, axle_clearance_radius);
    }
}

module outer_plate(side = 1) {
    plate_center_x = side * (frame_inner_width / 2 + outer_plate_thickness / 2);
    boss_center_x = side * (frame_inner_width / 2 + outer_plate_thickness + center_boss_extra / 2);

    difference() {
        union() {
            translate([plate_center_x, 0, 0])
                x_cylinder(outer_plate_thickness, outer_plate_radius);

            translate([boss_center_x, 0, 0])
                x_cylinder(center_boss_extra, center_boss_diameter / 2);

            for (i = [0 : bolt_hole_count - 1]) {
                angle = i * 360 / bolt_hole_count;
                y = (bolt_circle_diameter / 2) * cos(angle);
                z = (bolt_circle_diameter / 2) * sin(angle);
                translate([plate_center_x, y, z])
                    x_cylinder(outer_plate_thickness + 0.02, bolt_boss_diameter / 2);
            }
        }

        translate([0, 0, 0])
            x_cylinder(frame_outer_width + 2 * center_boss_extra + 0.20, shaft_radius);

        for (i = [0 : bolt_hole_count - 1]) {
            angle = i * 360 / bolt_hole_count;
            y = (bolt_circle_diameter / 2) * cos(angle);
            z = (bolt_circle_diameter / 2) * sin(angle);
            translate([plate_center_x, y, z])
                x_cylinder(outer_plate_thickness + center_boss_extra + 0.10, bolt_hole_diameter / 2);
        }
    }
}

module eyelet() {
    difference() {
        translate([0, 0, eyelet_center_z])
            rotate([0, 90, 0])
                linear_extrude(height = eyelet_span, center = true)
                    capsule_2d(eyelet_outer_height, eyelet_opening_width + 2 * eyelet_outer_width);

        translate([0, 0, eyelet_center_z])
            rotate([0, 90, 0])
                linear_extrude(height = eyelet_span + 0.10, center = true)
                    capsule_2d(eyelet_opening_height, eyelet_opening_width);
    }
}

module eyelet_supports() {
    support_x = frame_inner_width / 2 + outer_plate_thickness * 0.35;
    for (side = [-1, 1]) {
        hull() {
            translate([side * support_x, 0, flange_radius * 0.85]) sphere(r = support_radius);
            translate([side * support_x, 0, eyelet_bottom_z + eyelet_outer_width / 2]) sphere(r = support_radius);
        }

        hull() {
            translate([side * (frame_inner_width / 2 + outer_plate_thickness * 0.8), 0, outer_plate_radius * 0.75]) sphere(r = support_radius * 1.1);
            translate([side * support_x, 0, eyelet_bottom_z + eyelet_outer_width / 2]) sphere(r = support_radius);
        }
    }

    hull() {
        translate([-support_x, 0, eyelet_bottom_z + eyelet_outer_width / 2]) sphere(r = support_radius);
        translate([support_x, 0, eyelet_bottom_z + eyelet_outer_width / 2]) sphere(r = support_radius);
    }
}

module frame() {
    union() {
        outer_plate(-1);
        outer_plate(1);
        eyelet_supports();
        eyelet();
    }
}

module assembly() {
    sheave_y = exploded_view ? -exploded_sheave_offset : 0;

    frame();
    translate([0, sheave_y, 0]) sheave();
}

assembly();
