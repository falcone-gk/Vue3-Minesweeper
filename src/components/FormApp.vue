<template>
  <div class="config-game">
    <h1>Configuración del juego:</h1>
    <form>
      <div class="form-group">
        <label for="level">Nivel del juego:</label>
          <select class="form-control" v-model="currentSettings.index" @change.prevent="handleSelect" name="level" id="level">
          <option value="0">Principiante</option>
          <option value="1">Intermedio</option>
          <option value="2">Avanzado</option>
          <option value="3">Personalizado</option>
        </select>
      </div>
      <div class="custom-form">
        <div class="form-group">
          <label for="rows">N° de filas:</label>
          <input class="form-control" type="number" name="rows" v-model="currentSettings.rows" :disabled="isDisabled()" @click.prevent="" />
        </div>
        <div class="form-group">
          <label for="cols">N° de columnas:</label>
          <input class="form-control" type="number" name="cols" v-model="currentSettings.cols" :disabled="isDisabled()" @click.prevent="" />
        </div>
        <div class="form-group">
          <label for="bombs">N° de bombas:</label>
          <input class="form-control" type="number" name="bombs" v-model="currentSettings.bombs" :disabled="isDisabled()" @click.prevent="" />
        </div>
        <div class="div-btn">
          <button id="update-btn" @click.prevent="goToGame">
            Actualizar
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { gameData } from '../store/index'
const store = useStore()

const defaultLevels: gameData[] = [
  { index: "0", level: "beginner", rows: 9, cols: 9, bombs: 10 },
  { index: "1", level: "intermediate", rows: 16, cols: 16, bombs: 40 },
  { index: "2", level: "advanced", rows: 16, cols: 30, bombs: 99 },
]
const currentSettings = computed(() => store.getters.getCurrentSettings)
const handleSelect = (event: Event): void => {
  const target: HTMLSelectElement = event.target as HTMLSelectElement
  const value: string = target.value
  if (value === "3") {
    store.commit('setCustomGame')
  } else {
    store.commit('setSettings', defaultLevels[parseInt(value)])
  }
}

const isDisabled = (): boolean => !(currentSettings.value.index==="3")
const goToGame = () => store.commit('setNewPage', 'game')
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.config-game {
  width: min(100%, 350px);
}

.config-game h1 {
  font-size: 25px;
}

.custom-form input[type=number] {
  width: 50px;
}

.form-group {
  display: flex;
  margin: 4px 0;
}

.form-group label {
  flex: 1 1 auto;
}

.div-btn {
  display: flex;
  margin-top: 2em;
}

#update-btn {
  margin-left: auto;
  margin-right: auto;
  padding: .5em 40px;
  font-size: 15px;
}
</style>
