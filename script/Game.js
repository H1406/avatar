import { Application, Container, Graphics, Text, TextStyle, Assets } from 'pixi.js';
import { Player } from './Player.js';
import { Character } from './Character.js';
import { BattleSystem } from './BattleSystem.js';
import { GameState } from './Constants.js';
export class Game {

    constructor() {
      this.app = null;
      this.currentState = GameState.MAIN_MENU;
      this.containers = {};
      this.battleSystem = null;
      this.player = null;
      this.assets = {
        playerSprite: './images/main.png',
        enemySprite: './images/main.png',
        // Add more assets here
      };
    }
    
    async init() {
      // Create and initialize the PixiJS application
      this.app = new Application();
      await this.app.init({ background: '#333333', resizeTo: window });
      document.body.appendChild(this.app.canvas);
  
      // Load all assets
      await this.loadAssets();
  
      // Create game states
      this.setupContainers();
      
      // Create the player character
      this.player = new Character('aang', 100, 20, 1, Assets.get(this.assets.playerSprite));
      
      // Initialize battle system
      this.battleSystem = new BattleSystem(this);
      
      // Setup UI screens
      this.setupMainMenu();
      this.setupBattleScreen();
      this.setupGameOverScreen();
      this.setupVictoryScreen();
      
      // Start with main menu
      this.changeState(GameState.MAIN_MENU);
      
      // Setup game loop
      this.app.ticker.add(delta => this.update(delta));
    }
  
    async loadAssets() {
      const assetPromises = Object.values(this.assets).map(asset => Assets.load(asset));
      await Promise.all(assetPromises);
      console.log('All assets loaded');
    }
  
    setupContainers() {
      for (const state in GameState) {
        const container = new Container();
        container.visible = false;
        this.app.stage.addChild(container);
        this.containers[GameState[state]] = container;
      }
    }
  
    changeState(newState) {
      // Hide all containers
      for (const container in this.containers) {
        this.containers[container].visible = false;
      }
  
      // Show the container for the new state
      this.containers[newState].visible = true;
      this.currentState = newState;
      console.log(`Game state changed to: ${newState}`);
  
      // Special state initialization
      if (newState === GameState.BATTLE) {
        this.battleSystem.startNewBattle();
      }
    }
  
    setupMainMenu() {
      const container = this.containers[GameState.MAIN_MENU];
      
      // Create title
      const titleStyle = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 48,
        fontWeight: 'bold',
        fill: '#FFFFFF',
        stroke: '#000000',
        strokeThickness: 4
      });
  
      const title = new Text({
        text: 'Turn-Based Battle Game',
        style: titleStyle
      });
      title.x = (this.app.screen.width - title.width) / 2;
      title.y = this.app.screen.height * 0.2;
      container.addChild(title);
  
      // Create start button
      const startButton = this.createButton('Start Battle', 0x4CAF50, 200, 60);
      startButton.x = (this.app.screen.width - startButton.width) / 2;
      startButton.y = this.app.screen.height * 0.5;
      startButton.on('pointerdown', () => this.changeState(GameState.BATTLE));
      container.addChild(startButton);
    }
  
    setupBattleScreen() {
      const container = this.containers[GameState.BATTLE];
      this.battleSystem.setupBattleUI(container);
    }
  
    setupGameOverScreen() {
      const container = this.containers[GameState.GAME_OVER];
      
      const gameOverStyle = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 48,
        fontWeight: 'bold',
        fill: '#FF0000',
        stroke: '#000000',
        strokeThickness: 4
      });
  
      const gameOverText = new Text({
        text: 'Game Over',
        style: gameOverStyle
      });
      gameOverText.x = (this.app.screen.width - gameOverText.width) / 2;
      gameOverText.y = this.app.screen.height * 0.3;
      container.addChild(gameOverText);
  
      // Restart button
      const restartButton = this.createButton('Try Again', 0x4CAF50, 200, 60);
      restartButton.x = (this.app.screen.width - restartButton.width) / 2;
      restartButton.y = this.app.screen.height * 0.6;
      restartButton.on('pointerdown', () => this.changeState(GameState.MAIN_MENU));
      container.addChild(restartButton);
    }
  
    setupVictoryScreen() {
      const container = this.containers[GameState.VICTORY];
      
      const victoryStyle = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 48,
        fontWeight: 'bold',
        fill: '#00FF00',
        stroke: '#000000',
        strokeThickness: 4
      });
  
      const victoryText = new Text({
        text: 'Victory!',
        style: victoryStyle
      });
      victoryText.x = (this.app.screen.width - victoryText.width) / 2;
      victoryText.y = this.app.screen.height * 0.3;
      container.addChild(victoryText);
  
      // Continue button
      const continueButton = this.createButton('Next Battle', 0x4CAF50, 200, 60);
      continueButton.x = (this.app.screen.width - continueButton.width) / 2;
      continueButton.y = this.app.screen.height * 0.6;
      continueButton.on('pointerdown', () => this.changeState(GameState.BATTLE));
      container.addChild(continueButton);
    }
  
    createButton(text, color, width, height) {
      const buttonContainer = new Container();
      
      // Create button background
      const buttonBg = new Graphics();
      buttonBg.stroke({width: 2, color: 0x000000});  
      buttonBg.roundRect(0, 0, width, height, 10);
      buttonBg.fill(color);
      
      // Create text style
      const style = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 24,
        fontWeight: 'bold',
        fill: 0xFFFFFF
      });
      
      // Create button text
      const buttonText = new Text({
        text: text,
        style: style
      });
      
      // Center the text inside the button
      buttonText.x = (width - buttonText.width) / 2;
      buttonText.y = (height - buttonText.height) / 2;
      
      // Add background and text to button container
      buttonContainer.addChild(buttonBg);
      buttonContainer.addChild(buttonText);
      
      // Make the button interactive
      buttonContainer.eventMode = 'static';
      buttonContainer.cursor = 'pointer';
      
      return buttonContainer;
    }
  
    update(delta) {
      // Update game based on current state
      switch (this.currentState) {
        case GameState.BATTLE:
          this.battleSystem.update(delta);
          break;
        // Add other state updates as needed
      }
    }
  }