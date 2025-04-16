import { Application, Container, Graphics, Text, TextStyle, Assets,Sprite } from 'pixi.js';
export class Character {
  constructor(name, maxHealth, attack, defense, sprite) {
    this.name = name;
    this.maxHealth = maxHealth;
    this.currentHealth = maxHealth;
    this.attack = attack;
    this.defense = defense;
    this.sprite = null;
    this.spriteTexture = sprite;
    this.skills = [];
    this.statusEffects = [];
  }

  initSprite(x, y) {
    this.sprite = new Sprite(this.spriteTexture);
    this.sprite.anchor.set(0.5);
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.scale.set(0.7, 0.7);
    return this.sprite;
  }

  takeDamage(amount) {
    // Apply defense reduction
    const actualDamage = Math.max(1, amount - this.defense);
    this.currentHealth = Math.max(0, this.currentHealth - actualDamage);
    return {
      damage: actualDamage,
      isDead: this.currentHealth <= 0
    };
  }

  heal(amount) {
    this.currentHealth = Math.min(this.maxHealth, this.currentHealth + amount);
    return this.currentHealth;
  }

  performAttack(target) {
    return target.takeDamage(this.attack);
  }

  addSkill(skill) {
    this.skills.push(skill);
  }

  addStatusEffect(effect) {
    this.statusEffects.push(effect);
  }

  updateStatusEffects() {
    // Process active status effects
    this.statusEffects = this.statusEffects.filter(effect => {
      effect.apply(this);
      effect.duration--;
      return effect.duration > 0;
    });
  }
}
