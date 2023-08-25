// 'use strict';

// import St from 'gi://St';
// import * as UnlockDialog from 'resource:///org/gnome/shell/ui/unlockDialog.js';
// import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

// let native = UnlockDialog.UnlockDialog.prototype._updateBackgroundEffects;

// class ControlBlurEffectOnLockScreenExtension extends Extension {
//     enable() {
//         this._settings = this.getSettings();
//         UnlockDialog.UnlockDialog.prototype._updateBackgroundEffects = this._controlBlur;
//     }

//     disable() {
//         UnlockDialog.UnlockDialog.prototype._updateBackgroundEffects = native;
//         // unlock-dialog is used because this extension purpose is
//         // to control the blur effect on lock screen itself.
//     }

//     _controlBlur() {
//         const themeContext = St.ThemeContext.get_for_stage(global.stage);

//         let BRIGHTNESS_VALUE = this._settings.get_double('brightness');
//         let SIGMA_VALUE = this._settings.get_int('sigma');

//         for (const widget of this._backgroundGroup) {
//             const effect = widget.get_effect('blur');

//             if (effect) {
//                 effect.set({
//                     brightness: BRIGHTNESS_VALUE,
//                     sigma: SIGMA_VALUE * themeContext.scale_factor,
//                 });
//             }
//         }
//     }
// }

import {Extension, InjectionManager} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as UnlockDialog from 'resource:///org/gnome/shell/ui/unlockDialog.js';
import St from 'gi://St';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';

export default class ControlBlurExtension extends Extension {
    constructor(metadata) {
        super(metadata);

        this._injectionManager = new InjectionManager();
    }

    enable() {
        this._settings = this.getSettings();

        // Overriding a method with an *arrow function*
        this._injectionManager.overrideMethod(UnlockDialog.UnlockDialog.prototype, '_updateBackgroundEffects',
            originalMethod => {
                return () => {
                    const themeContext = St.ThemeContext.get_for_stage(global.stage);

                    let BRIGHTNESS_VALUE = this._settings.get_double('brightness');
                    let SIGMA_VALUE = this._settings.get_int('sigma');

                    Main.notify(JSON.stringify(UnlockDialog.UnlockDialog._backgroundGroup));

                    for (const widget of this._backgroundGroup) {
                        const effect = widget.get_effect('blur');

                        if (effect) {
                            effect.set({
                                brightness: BRIGHTNESS_VALUE,
                                sigma: SIGMA_VALUE * themeContext.scale_factor,
                            });
                        }
                    }
                    originalMethod.call();
                };
            });
    }

    disable() {
        this._injectionManager.clear();
        this._settings = null;
    }
}
