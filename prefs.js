import Adw from 'gi://Adw';
import Gio from 'gi://Gio';

import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class BringoutExtensionPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const page = new Adw.PreferencesPage();
        window.add(page);

        const group = new Adw.PreferencesGroup();
        page.add(group);

        const brightnessSlider = new Adw.SwitchRow({
            title: 'Adjust Brightness',
        });
        group.add(brightnessSlider);

        const sigmaSlider = new Adw.SwitchRow({
            title: 'Adjust Sigma',
        });
        group.add(sigmaSlider);


        window._settings = this.getSettings();
        window._settings.bind('brightness', brightnessSlider, 'active', Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind('sigma', sigmaSlider, 'active', Gio.SettingsBindFlags.DEFAULT);
    }
}
