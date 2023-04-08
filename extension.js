'use strict';

const {St} = imports.gi;

const UnlockDialog = imports.ui.unlockDialog;
const ExtensionUtils = imports.misc.extensionUtils;

let native = UnlockDialog.UnlockDialog.prototype._updateBackgroundEffects;

class modified {
    enable() {
        UnlockDialog.UnlockDialog.prototype._updateBackgroundEffects = this._controlBlur;
    }

    disable() {
        UnlockDialog.UnlockDialog.prototype._updateBackgroundEffects = native;
        // unlock-dialog is used because this extension purpose is
        // to control the blur effect on lock screen itself.
    }

    _controlBlur() {
        const themeContext = St.ThemeContext.get_for_stage(global.stage);


        this._settings = ExtensionUtils.getSettings();
        let BRIGHTNESS_VALUE = this._settings.get_double('brightness');
        let SIGMA_VALUE = this._settings.get_int('sigma');

        for (const widget of this._backgroundGroup) {
            const effect = widget.get_effect('blur');

            if (effect) {
                effect.set({
                    brightness: BRIGHTNESS_VALUE,
                    sigma: SIGMA_VALUE * themeContext.scale_factor,
                });
            }
        }
    }
}

/**
 *
 */
function init() {
    return new modified();
}
