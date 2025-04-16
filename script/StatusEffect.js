class StatusEffect {
    constructor(name, duration, statChanges = {}) {
      this.name = name;
      this.duration = duration; // Number of turns
      this.statChanges = statChanges; // Object with stat names and change values
    }
    
    apply(character) {
      // Apply stat changes each turn
      for (const [stat, value] of Object.entries(this.statChanges)) {
        if (character[stat] !== undefined) {
          // Store original value if not already stored
          if (!character[`original_${stat}`]) {
            character[`original_${stat}`] = character[stat];
          }
          character[stat] = character[`original_${stat}`] + value;
        }
      }
    }
    
    remove(character) {
      // Reset stats to original values
      for (const stat of Object.keys(this.statChanges)) {
        if (character[`original_${stat}`] !== undefined) {
          character[stat] = character[`original_${stat}`];
          delete character[`original_${stat}`];
        }
      }
    }
  }