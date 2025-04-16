import { Character } from './Character.js';
import { Application, Container, Graphics, Text, TextStyle, Assets } from 'pixi.js';

export class Enemy extends Character {
    constructor(name, maxHealth, attack, defense, sprite, experienceValue = 10) {
      super(name, maxHealth, attack, defense, sprite);
      this.experienceValue = experienceValue;
      this.aiType = 'aggressive'; // Can be 'aggressive', 'defensive', 'random'
    }
  
    decideAction(player) {
      // Basic AI for enemy decision making
      switch (this.aiType) {
        case 'aggressive':
          return { action: 'attack', target: player };
        case 'defensive':
          if (this.currentHealth < this.maxHealth * 0.3 && Math.random() > 0.5) {
            return { action: 'heal', target: this };
          } else {
            return { action: 'attack', target: player };
          }
        case 'random':
          const actions = ['attack', 'defend', 'special'];
          const randomAction = actions[Math.floor(Math.random() * actions.length)];
          return { action: randomAction, target: player };
        default:
          return { action: 'attack', target: player };
      }
    }
  }