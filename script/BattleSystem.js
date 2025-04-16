import { Application, Container, Graphics, Text, TextStyle, Assets } from 'pixi.js';
import { Player } from './Player.js';
import { Enemy } from './enemy.js';
import { GameState } from './Constants.js';
export class BattleSystem {
    constructor(game) {
      this.game = game;
      this.player = null;
      this.enemy = null;
      this.currentTurn = 'player'; // 'player' or 'enemy'
      this.battleLog = [];
      this.turnCount = 0;
      this.actionButtons = [];
      this.battleState = 'idle'; // 'idle', 'playerAction', 'enemyAction', 'victory', 'defeat'
      this.battleLogText = null;
      this.playerHealthText = null;
      this.enemyHealthText = null;
    }
    
    setupBattleUI(container) {
      // Create battle UI elements
      this.setupCharacterDisplays(container);
      this.setupActionButtons(container);
      this.setupBattleLog(container);
    }
    
    setupCharacterDisplays(container) {
      // Player stats display
      const playerStatsStyle = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 20,
        fill: '#FFFFFF'
      });
      
      this.playerHealthText = new Text({
        text: 'Player: 100/100 HP',
        style: playerStatsStyle
      });
      this.playerHealthText.x = 50;
      this.playerHealthText.y = 50;
      container.addChild(this.playerHealthText);
      
      // Enemy stats display
      this.enemyHealthText = new Text({
        text: 'Enemy: 50/50 HP',
        style: playerStatsStyle
      });
      this.enemyHealthText.x = this.game.app.screen.width - 200;
      this.enemyHealthText.y = 50;
      container.addChild(this.enemyHealthText);
    }
    
    setupActionButtons(container) {
      const actions = ['Attack', 'Defend', 'Item', 'Run'];
      const buttonY = this.game.app.screen.height - 100;
      const spacing = 220;
      
      this.actionButtons = [];
      
      actions.forEach((action, index) => {
        const button = this.game.createButton(action, 0x2196F3, 200, 60);
        button.x = 50 + (spacing * index);
        button.y = buttonY;
        
        // Add action handlers
        button.on('pointerdown', () => {
          this.handlePlayerAction(action.toLowerCase());
        });
        
        container.addChild(button);
        this.actionButtons.push(button);
      });
    }
    
    setupBattleLog(container) {
      const logStyle = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 18,
        fill: '#FFFFFF',
        wordWrap: true,
        wordWrapWidth: this.game.app.screen.width - 100
      });
      
      this.battleLogText = new Text({
        text: 'Battle started!',
        style: logStyle
      });
      this.battleLogText.x = 50;
      this.battleLogText.y = 120;
      container.addChild(this.battleLogText);
    }
    
    startNewBattle() {
      // Create or reset player if not already created
      if (!this.player) {
        this.player = new Player('Hero', 100, 20, 5, Assets.get(this.game.assets.playerSprite));
      } else {
        this.player.currentHealth = this.player.maxHealth;
      }
      
      // Create a new enemy
      this.enemy = new Enemy('Goblin', 50, 10, 3, Assets.get(this.game.assets.enemySprite));
      
      // Set up sprites
      if (!this.player.sprite) {
        const playerSprite = this.player.initSprite(200, 300, 2);
        this.game.containers[GameState.BATTLE].addChild(playerSprite);
      }
      
      const enemySprite = this.enemy.initSprite(this.game.app.screen.width - 200, 300, 2);
      this.game.containers[GameState.BATTLE].addChild(enemySprite);
      
      // Reset battle state
      this.currentTurn = 'player';
      this.turnCount = 0;
      this.battleState = 'playerAction';
      this.battleLog = ['A new battle has begun!', 'It\'s your turn.'];
      
      // Update UI
      this.updateBattleUI();
    }
    
    updateBattleUI() {
      // Update health displays
      if (this.playerHealthText && this.player) {
        this.playerHealthText.text = `${this.player.name}: ${this.player.currentHealth}/${this.player.maxHealth} HP`;
      }
      
      if (this.enemyHealthText && this.enemy) {
        this.enemyHealthText.text = `${this.enemy.name}: ${this.enemy.currentHealth}/${this.enemy.maxHealth} HP`;
      }
      
      // Update battle log
      if (this.battleLogText) {
        // Show the last 5 log entries
        const recentLogs = this.battleLog.slice(-5).join('\n');
        this.battleLogText.text = recentLogs;
      }
      
      // Enable/disable buttons based on turn
      this.actionButtons.forEach(button => {
        button.eventMode = this.currentTurn === 'player' ? 'static' : 'none';
        button.alpha = this.currentTurn === 'player' ? 1 : 0.5;
      });
    }
    
    handlePlayerAction(action) {
      if (this.battleState !== 'playerAction') return;
      
      let result = null;
      
      switch (action) {
        case 'attack':
          result = this.player.performAttack(this.enemy);
          this.addBattleLog(`${this.player.name} attacks ${this.enemy.name} for ${result.damage} damage!`);
          
          if (result.isDead) {
            this.handleVictory();
          } else {
            this.endTurn();
          }
          break;
          
        case 'defend':
          // Temporarily increase defense
          this.player.addStatusEffect(new StatusEffect('Defending', 1, { defense: 5 }));
          this.addBattleLog(`${this.player.name} takes a defensive stance!`);
          this.endTurn();
          break;
          
        case 'item':
          // For demo purposes, auto-use a healing potion
          this.player.heal(20);
          this.addBattleLog(`${this.player.name} uses a potion and recovers 20 HP!`);
          this.endTurn();
          break;
          
        case 'run':
          // 50% chance to run
          if (Math.random() > 0.5) {
            this.addBattleLog(`${this.player.name} successfully escaped!`);
            this.game.changeState(GameState.MAIN_MENU);
          } else {
            this.addBattleLog(`${this.player.name} failed to escape!`);
            this.endTurn();
          }
          break;
      }
      
      this.updateBattleUI();
    }
    
    handleEnemyTurn() {
      if (!this.enemy || this.enemy.currentHealth <= 0) return;
      
      this.battleState = 'enemyAction';
      this.addBattleLog(`It's ${this.enemy.name}'s turn.`);
      
      // Have the enemy decide its action
      const decision = this.enemy.decideAction(this.player);
      
      // Delay for a moment to show enemy "thinking"
      setTimeout(() => {
        switch (decision.action) {
          case 'attack':
            const result = this.enemy.performAttack(this.player);
            this.addBattleLog(`${this.enemy.name} attacks ${this.player.name} for ${result.damage} damage!`);
            
            if (result.isDead) {
              this.handleDefeat();
            } else {
              this.endTurn();
            }
            break;
            
          case 'heal':
            this.enemy.heal(10);
            this.addBattleLog(`${this.enemy.name} heals itself for 10 HP!`);
            this.endTurn();
            break;
            
          case 'special':
            // Apply a debuff to player
            this.player.addStatusEffect(new StatusEffect('Weakened', 2, { attack: -5 }));
            this.addBattleLog(`${this.enemy.name} weakens ${this.player.name}!`);
            this.endTurn();
            break;
        }
        
        this.updateBattleUI();
      }, 1000);
    }
    
    endTurn() {
      // Process status effects
      this.player.updateStatusEffects();
      this.enemy.updateStatusEffects();
      
      // Switch turns
      this.currentTurn = this.currentTurn === 'player' ? 'enemy' : 'player';
      this.turnCount++;
      
      if (this.currentTurn === 'player') {
        this.battleState = 'playerAction';
        this.addBattleLog(`It's your turn.`);
      } else {
        this.handleEnemyTurn();
      }
      
      this.updateBattleUI();
    }
    
    handleVictory() {
      this.battleState = 'victory';
      this.addBattleLog(`${this.enemy.name} has been defeated!`);
      this.addBattleLog(`You gained ${this.enemy.experienceValue} experience!`);
      
      const leveledUp = this.player.gainExperience(this.enemy.experienceValue);
      
      if (leveledUp) {
        this.addBattleLog(`${this.player.name} leveled up to level ${this.player.level}!`);
      }
      
      // Remove enemy sprite
      if (this.enemy.sprite && this.enemy.sprite.parent) {
        this.enemy.sprite.parent.removeChild(this.enemy.sprite);
      }
      
      // Show victory screen after a delay
      setTimeout(() => {
        this.game.changeState(GameState.VICTORY);
      }, 2000);
    }
    
    handleDefeat() {
      this.battleState = 'defeat';
      this.addBattleLog(`${this.player.name} has been defeated!`);
      
      // Show game over screen after a delay
      setTimeout(() => {
        this.game.changeState(GameState.GAME_OVER);
      }, 2000);
    }
    
    addBattleLog(message) {
      this.battleLog.push(message);
      console.log(message); // Also log to console for debugging
    }
    
    update(delta) {
      // Animation updates can be handled here
      // For example, flashing characters when damaged
      
      // Nothing to do in idle state
      if (this.battleState === 'idle') return;
      
      // Handle enemy turn if it's their turn
      if (this.battleState === 'enemyAction') {
        // Enemy actions are triggered by timeout in handleEnemyTurn
      }
    }
  }