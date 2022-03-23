
const { Gio, GLib, Shell, St } = imports.gi;

const Main = imports.ui.main;
const Background = imports.ui.background;
const UnlockDialog = imports.ui.unlockDialog;
const ExtensionUtils = imports.misc.extensionUtils;

const SCHEMA_NAME = 'org.gnome.shell.extensions.blur';

let native = UnlockDialog.UnlockDialog.prototype._updateBackgroundEffects;
let native2 = UnlockDialog.UnlockDialog.prototype._updateBackgrounds;

class modified {
    constructor() {
    }

    enable() {
    	UnlockDialog.UnlockDialog.prototype._updateBackgroundEffects = this._controlBlur;
    }

    disable() {
        if(Main.sessionMode.currentMode == 'unlock-dialog') {
        UnlockDialog.UnlockDialog.prototype._updateBackgroundEffects = this._controlBlur; } else {
        UnlockDialog.UnlockDialog.prototype._updateBackgroundEffects = native; }
    }
    
    _controlBlur() {
        const themeContext = St.ThemeContext.get_for_stage(global.stage);
        
        this.gsettings = ExtensionUtils.getSettings(SCHEMA_NAME);
        
        let BRIGHTNESS_VALUE = this.gsettings.get_double('brightness');
        let SIGMA_VALUE = this.gsettings.get_int('sigma');

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

function init() {
return new modified();
}
