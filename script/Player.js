import { Character } from './Character.js';
import { Application, Container, Graphics, Text, TextStyle, Assets } from 'pixi.js';

export class Player extends Character {
    constructor(name, maxHealth, attack, defense, sprite) {
      super(name, maxHealth, attack, defense, sprite);
      this.level = 1;
      this.experience = 0;
      this.experienceToNextLevel = 100;
      this.inventory = [];
    }
  
    gainExperience(amount) {
      this.experience += amount;
      if (this.experience >= this.experienceToNextLevel) {
        this.levelUp();
        return true;
      }
      return false;
    }
  
    levelUp() {
      this.level++;
      this.experience -= this.experienceToNextLevel;
      this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.5);
      
      // Improve stats
      this.maxHealth += 10;
      this.currentHealth = this.maxHealth;
      this.attack += 2;
      this.defense += 1;
      
      console.log(`${this.name} leveled up to level ${this.level}!`);
    }
    
    addItemToInventory(item) {
      this.inventory.push(item);
    }
    
    useItem(itemIndex, target = this) {
      if (itemIndex >= 0 && itemIndex < this.inventory.length) {
        const item = this.inventory[itemIndex];
        item.use(target);
        this.inventory.splice(itemIndex, 1);
        return true;
      }
      return false;
    }
  }