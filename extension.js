'use strict';

import {Extension, InjectionManager} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as UnlockDialog from 'resource:///org/gnome/shell/ui/unlockDialog.js';
import St from 'gi://St';

export default class ControlBlurExtension extends Extension {
    enable() {
        this._injectionManager = new InjectionManager();
        this._injectionManager.overrideMethod(UnlockDialog.UnlockDialog.prototype, '_updateBackgroundEffects',
            () => {
                const settings = this.getSettings();
                return function () {
                    const themeContext = St.ThemeContext.get_for_stage(global.stage);

                    let BRIGHTNESS_VALUE = settings.get_double('brightness');
                    let SIGMA_VALUE = settings.get_int('sigma');

                    for (const widget of this._backgroundGroup) {
                        const effect = widget.get_effect('blur');

                        if (effect) {
                            effect.set({
                                brightness: BRIGHTNESS_VALUE,
                                sigma: SIGMA_VALUE * themeContext.scale_factor,
                            });
                        }
                    }
                };
            });
    }

    disable() {
        this._injectionManager.clear();
        this._injectionManager = null;
    }
}
