import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';

import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class ControlBlurExtensionPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        window._settings = this.getSettings();

        const adjustBlur = () => {
            let hbox = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5});
            let blurLabel = new Gtk.Label({label: 'Adjust Sigma', xalign: 0, hexpand: true});

            this.blur_adjustment = new Gtk.Adjustment({
                lower: 0,
                'step-increment': 1,
                'page-increment': 10,
                upper: 999,
            });

            this.blur_scale = new Gtk.Scale({
                hexpand: true,
                margin_start: 20,
                visible: true,
                'draw-value': true,
                'value-pos': 'left',
                'can-focus': true,
                digits: 0,
                adjustment: this.blur_adjustment,
            });

            this.resetBlurButton = new Gtk.Button({margin_start: 5});
            this.resetBlurButton.set_label("Reset to Extensions's Default Value");
            this.resetBlurButton.connect('clicked', () => {
                window._settings.set_int('sigma', 1);
                this.blur_scale.set_value(window._settings.get_int('sigma'));
            });

            this.blur_scale.set_value(window._settings.get_int('sigma'));
            this.blur_scale.connect('value-changed', entry => {
                window._settings.set_int('sigma', entry.get_value());
            });

            hbox.append(blurLabel);
            hbox.append(this.blur_scale);
            hbox.append(this.resetBlurButton);

            return hbox;
        };

        const adjustBrightness = () => {
            let hbox = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5});
            let brightnessLabel = new Gtk.Label({label: 'Adjust Brightness', xalign: 0, hexpand: true});

            this.brightness_adjustment = new Gtk.Adjustment({
                lower: 0,
                'step-increment': 0.05,
                'page-increment': 0.1,
                upper: 1,
            });

            this.brightness_scale = new Gtk.Scale({
                hexpand: true,
                margin_start: 20,
                visible: true,
                'draw-value': true,
                'value-pos': 'left',
                'can-focus': true,
                digits: 2,
                adjustment: this.brightness_adjustment,
            });

            this.resetBrightnessButton = new Gtk.Button({margin_start: 5});
            this.resetBrightnessButton.set_label("Reset to Extensions's Default Value");
            this.resetBrightnessButton.connect('clicked', () => {
                window._settings.set_double('brightness', 0.65);
                this.brightness_scale.set_value(window._settings.get_double('brightness'));
            });

            this.brightness_scale.set_value(window._settings.get_double('brightness'));
            this.brightness_scale.connect('value-changed', entry => {
                window._settings.set_double('brightness', entry.get_value());
            });

            hbox.append(brightnessLabel);
            hbox.append(this.brightness_scale);
            hbox.append(this.resetBrightnessButton);

            return hbox;
        };

        const addBoldText = text => {
            let txt = new Gtk.Label({xalign: 0, margin_top: 20});
            txt.set_markup(`<b>${text}</b>`);
            txt.set_wrap(true);
            return txt;
        };

        const page = new Adw.PreferencesPage();
        window.add(page);

        const group = new Adw.PreferencesGroup();
        page.add(group);

        group.add(adjustBlur());
        group.add(adjustBrightness());
        group.add(addBoldText(
            'Please note that when Blur Sigma Value is set to 0, the Brightness will be Maximum Irrespective of the value set above.'
        ));
    }
}
