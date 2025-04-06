class SoundPlayer {
  private static sounds: { [key: string]: HTMLAudioElement } = {};

  static preloadSounds() {
    this.sounds = {
      click: new Audio("/sounds/click.wav"),
      success: new Audio("/sounds/success.wav"),
      error: new Audio("/sounds/error.wav"),
      showAnswer: new Audio("/sounds/reveal.wav"),
      switchPlayer: new Audio("/sounds/switch.wav"),
    };

    // Set volumes
    this.sounds.click.volume = 0.3;
    this.sounds.success.volume = 0.5;
    this.sounds.error.volume = 0.5;
    this.sounds.showAnswer.volume = 0.4;
    this.sounds.switchPlayer.volume = 0.4;
  }

  static play(soundName: keyof typeof this.sounds) {
    const sound = this.sounds[soundName];
    if (sound) {
      sound.currentTime = 0; // Reset the audio to start
      sound.play().catch((e) => console.log("Error playing sound:", e));
    }
  }
}

export default SoundPlayer;
