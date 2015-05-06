import Core from './core';
import Module from './module';
import Detect from './detect';
import Event from './event';

var Moff = this.Moff = new Core();
Moff.extend('module', Module, true);
Moff.extend('detect', Detect, true);
Moff.extend('event', Event, true);
