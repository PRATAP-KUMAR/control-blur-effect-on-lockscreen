'use strict';

const Gtk = imports.gi.Gtk;

const ExtensionUtils = imports.misc.extensionUtils;

const SCHEMA_NAME = 'org.gnome.shell.extensions.blur';

function init() {
}

function buildPrefsWidget() {
    let widget = new PrefsWidget();
    widget.widget.show_all();
    
    return widget.widget;
}

class PrefsWidget {
    constructor() {
        this.gsettings = ExtensionUtils.getSettings(SCHEMA_NAME);

        this.widget = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            border_width: 10
        });

        this.vbox = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            margin: 20, margin_top: 0
        });
        this.vbox.set_size_request(65, 65);


        this.addBoldTextToBox("Adjust the Values as Required", this.vbox);
        
        this.vbox.add(new Gtk.HSeparator({margin_bottom: 5, margin_top: 5}));
        
        this.vbox.add(this.adjustBlur());
        this.vbox.add(this.adjustBrightness());
        
        this.addBoldTextToBox("Please note that when Blur Sigma Value is set to 0, the Brightness will be Maximum Irrespective of the value set above.", this.vbox);
        

        this.widget.add(this.vbox);
    }
    
    	adjustBlur() {
        let hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5 });
        let blur_label = new Gtk.Label({ label: "Adjust Sigma", xalign: 0, hexpand: true });
        
        this.blur_adjustment = new Gtk.Adjustment({
        lower: 0,
        'step-increment': 1,
        'page-increment': 10,
        upper: 999 });
        
        this.blur_scale = new Gtk.Scale({
        hexpand: true,
        margin_start: 20,
        visible: true,
        'can-focus': true,
        'value-pos': 'left',
        digits: 0,
        adjustment: this.blur_adjustment });
        
        this.resetBlurButton = new Gtk.Button({ margin_start: 5 });
        this.resetBlurButton.set_label("Reset to Extensions's Default Value");
        this.resetBlurButton.connect('clicked', ()=> { this.gsettings.set_int('sigma', 0);
        this.blur_scale.set_value(this.gsettings.get_int('sigma')); })
        
        this.blur_scale.set_value(this.gsettings.get_int('sigma'));
        this.blur_scale.connect('value-changed', (entry) => { this.gsettings.set_int('sigma', entry.get_value()); });

        hbox.add(blur_label, false, true, 0);
        hbox.add(this.blur_scale);
        hbox.add(this.resetBlurButton);

        return hbox;
    }
    
        adjustBrightness() {
        let hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5 });
        let brightness_label = new Gtk.Label({ label: "Adjust Brightness", xalign: 0, hexpand: true });
        
        this.brightness_adjustment = new Gtk.Adjustment({
        lower: 0,
        'step-increment': 0.05,
        'page-increment': 0.1,
        upper: 1 });
        
        this.brightness_scale = new Gtk.Scale({
        hexpand: true,
        margin_start: 20,
        visible: true,
        'can-focus': true,
        'value-pos': 'left',
        digits: 2,
        adjustment: this.brightness_adjustment });
        
        this.resetBrightnessButton = new Gtk.Button({ margin_start: 5 });
        this.resetBrightnessButton.set_label("Reset to Extensions's Default Value");
        this.resetBrightnessButton.connect('clicked', ()=> { this.gsettings.set_double('brightness', 0.55);
        this.brightness_scale.set_value(this.gsettings.get_double('brightness')); })
        
        this.brightness_scale.set_value(this.gsettings.get_double('brightness'));
        this.brightness_scale.connect('value-changed', (entry) => { this.gsettings.set_double('brightness', entry.get_value()); });

        hbox.add(brightness_label, false, true, 1);
        hbox.add(this.brightness_scale);
        hbox.add(this.resetBrightnessButton);

        return hbox;
    }

    addBoldTextToBox(text, box) {
        let txt = new Gtk.Label({xalign: 0, margin_top: 20});
        txt.set_markup('<b>' + text + '</b>');
        txt.set_line_wrap(true);
        box.add(txt);
    }
}
