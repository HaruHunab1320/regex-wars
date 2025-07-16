import { GameEvent, GameEventType } from '../types'

type EventCallback = (event: GameEvent) => void

export class EventManager {
  private listeners: Map<GameEventType, EventCallback[]> = new Map()
  private eventQueue: GameEvent[] = []
  private isProcessing: boolean = false

  public subscribe(eventType: GameEventType, callback: EventCallback): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, [])
    }

    const callbacks = this.listeners.get(eventType)!
    callbacks.push(callback)

    // Return unsubscribe function
    return () => {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  public emit(eventType: GameEventType, payload: any = {}): void {
    const event: GameEvent = {
      type: eventType,
      payload,
      timestamp: Date.now(),
    }

    // Add to queue to prevent recursive event emission
    this.eventQueue.push(event)

    // Process queue if not already processing
    if (!this.isProcessing) {
      this.processEventQueue()
    }
  }

  private processEventQueue(): void {
    this.isProcessing = true

    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift()!
      const callbacks = this.listeners.get(event.type) || []

      callbacks.forEach(callback => {
        try {
          callback(event)
        } catch (error) {
          console.error(`Error in event handler for ${event.type}:`, error)
        }
      })
    }

    this.isProcessing = false
  }

  public clear(): void {
    this.listeners.clear()
    this.eventQueue = []
  }

  // Utility method to emit multiple events
  public emitBatch(events: Array<{ type: GameEventType; payload?: any }>): void {
    events.forEach(({ type, payload }) => this.emit(type, payload))
  }

  // Debug method to log all registered listeners
  public getListenerCounts(): Map<GameEventType, number> {
    const counts = new Map<GameEventType, number>()
    
    for (const [eventType, callbacks] of this.listeners) {
      counts.set(eventType, callbacks.length)
    }
    
    return counts
  }
}

// Singleton instance for global access
export const gameEventManager = new EventManager()