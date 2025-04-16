class Item {
    constructor(name, description, effect, value = 10) {
      this.name = name;
      this.description = description;
      this.effect = effect; // Function that applies the item effect
      this.value = value; // Gold value
    }
    
    use(target) {
      return this.effect(target);
    }
  }