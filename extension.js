import St from 'gi://St';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as Config from 'resource:///org/gnome/shell/misc/config.js';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

const GNOME_SHELL_VERSION = Number(Config.PACKAGE_VERSION.split('.')[0]);

export default class ControlBlurExtension extends Extension {
    enable() {
        this._settings = this.getSettings();
        this._dialog = Main.screenShield._dialog;
        if (this._dialog)
            this._dialog._updateBackgroundEffects = this._myEffects();
    }

    _myEffects() {
        const themeContext = St.ThemeContext.get_for_stage(global.stage);

        for (const widget of this._dialog._backgroundGroup) {
            const effect = widget.get_effect('blur');

            if (effect) {
                if (GNOME_SHELL_VERSION === 46) {
                    effect.set({
                        brightness: this._settings.get_double('brightness'),
                        radius: this._settings.get_int('sigma') * themeContext.scale_factor,
                    });
                } else {
                    effect.set({
                        brightness: this._settings.get_double('brightness'),
                        sigma: this._settings.get_int('sigma') * themeContext.scale_factor,
                    });
                }
            }
        }
    }

    // unlock-dialog is used in session-modes because this extension purpose is
    // to tweak blur effect on lock screen itself.
    disable() {
        this._dialog = null;
        this._settings = null;
    }
}
