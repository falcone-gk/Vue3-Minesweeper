import { createStore } from 'vuex'

interface gameData {
  index: string
  level: "beginner" | "intermediate" | "advanced" | "custom";
  rows: number;
  cols: number;
  bombs: number;
}

interface StoreType {
  page: string,
  settings: gameData
}

export default createStore<StoreType>({
  state: () => {
    const settings: gameData = {
      index: "0",
      level: "beginner",
      rows: 9,
      cols: 9,
      bombs: 10
    }
    return {
      page: 'settings',
      settings: settings
    }
  },
  getters: {
    getCurrentSettings: (state: StoreType) => {
      return state.settings
    },
    getCurrentIndex: (state: StoreType): string => {
      return state.settings.index
    },
    getNumRows: (state: StoreType): number => {
      return state.settings.rows
    },
    getNumCols: (state: StoreType): number => {
      return state.settings.cols
    },
    getNumBombs: (state: StoreType): number => {
      return state.settings.bombs
    },
    totalCells: (state: StoreType): number => {
      return state.settings.cols * state.settings.rows
    },
    getCurrentPage: (state: StoreType): string => {
      return state.page
    }
  },
  mutations: {
    setSettings (state: StoreType, newSettings: gameData): void {
      state.settings = Object.assign(state.settings, newSettings)
    },
    setCustomGame (state) {
      state.settings.level = 'custom'
      state.settings.index = '3'
    },
    setNewPage (state: StoreType, newPage: string) {
      state.page = newPage
    }
  },
  actions: {
  },
  modules: {
  }
})

export {gameData}
