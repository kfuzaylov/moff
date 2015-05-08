import Core from './core.e6';
import Module from './module.e6';
import Detect from './detect.e6';
import Event from './event.e6';

var Moff = this.Moff = new Core();
Moff.extend('module', Module, true);
Moff.extend('detect', Detect, true);
Moff.extend('event', Event, true);
