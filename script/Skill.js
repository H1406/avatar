class Skill {
    constructor(name, power, mpCost, description, type = 'damage') {
      this.name = name;
      this.power = power;
      this.mpCost = mpCost;
      this.description = description;
      this.type = type; // 'damage', 'heal', 'buff', 'debuff'
      this.targetType = type === 'heal' || type === 'buff' ? 'friendly' : 'enemy';
    }
  
    use(user, target) {
      switch (this.type) {
        case 'damage':
          return target.takeDamage(this.power + user.attack);
        case 'heal':
          return target.heal(this.power);
        case 'buff':
          // Apply status effect to boost stats
          target.addStatusEffect(new StatusEffect('Buff', 3, { attack: 5 }));
          return { success: true };
        case 'debuff':
          // Apply status effect to reduce stats
          target.addStatusEffect(new StatusEffect('Debuff', 3, { defense: -3 }));
          return { success: true };
      }
    }
  }