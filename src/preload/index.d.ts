// import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    // electron: ElectronAPI
    api: {
      send(channel: string, value?: unknown): void
      on(channel: string, callback: (...args: unknown[]) => void): () => void
      invoke(channel: string, ...args: unknown[]): Promise<unknown>
    }
  }
}

export {}
