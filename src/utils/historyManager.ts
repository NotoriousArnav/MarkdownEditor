
export class HistoryManager<T> {
  private history: T[] = [];
  private currentIndex = -1;

  constructor(initialState?: T) {
    if (initialState) {
      this.push(initialState);
    }
  }

  push(state: T): void {
    // If we're not at the end of the history, remove future states
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }
    
    this.history.push(state);
    this.currentIndex = this.history.length - 1;
  }

  undo(): T | undefined {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.history[this.currentIndex];
    }
    return undefined;
  }

  redo(): T | undefined {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      return this.history[this.currentIndex];
    }
    return undefined;
  }

  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }
}
