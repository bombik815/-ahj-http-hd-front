import Widget from './widget';
import Memory from './memory';

console.log('app started');

const memory = new Memory();
const conteiner = new Widget(memory);

conteiner.events();
