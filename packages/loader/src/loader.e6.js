import AMD from '../../amd/src/amd.e6';
import Core from '../../core/src/core.e6';
import Event from '../../event/src/event.e6';
import Detect from '../../detect/src/detect.e6';
import Module from '../../modules/src/base.es6';
import ModulesApi from '../../modules/src/api.e6';

window.Moff = new Core();
window.Moff.amd = new AMD();
window.Moff.event = new Event();
window.Moff.Module = new Module();
window.Moff.detect = new Detect();
window.Moff.modules = new ModulesApi();
