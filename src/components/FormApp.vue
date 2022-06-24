<template>
  <div class="config-game">
    <h2>Configuración del juego:</h2>
    <form>
      <div style="display: flex">
        <label style="flex: 1 1 auto" for="level">Nivel del juego:</label>
        <select id="level" name="level" v-model="currentSettings.index" @change.prevent="handleSelect">
          <option value="0">Principiante</option>
          <option value="1">Intermedio</option>
          <option value="2">Avanzado</option>
          <option value="3">Personalizado</option>
        </select>
      </div>
      <div class="group-forms">
        <FormGroup
        label="N° de filas"
        name="row"
        v-model:digit="currentSettings.rows"
        :isDisabled="isDisabled()" />
        <FormGroup
        label="N° de columnas"
        name="cols"
        v-model:digit="currentSettings.cols"
        :isDisabled="isDisabled()" />
        <FormGroup
        label="N° de bombas"
        name="bombs"
        v-model:digit="currentSettings.bombs"
        :isDisabled="isDisabled()" />
      </div>
      <PageButton value="Jugar" :event="goToGame" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { gameData } from '../store/index'
import PageButton from './elements/PageButton.vue'
import FormGroup from './elements/FormGroup.vue'

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
const goToGame = () => {
  const totalCells: number = currentSettings.value.rows * currentSettings.value.cols
  if (totalCells <= currentSettings.value.bombs) {
    alert('Configuración no posible')
  } else {
    store.commit('setNewPage', 'game')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.config-game {
  width: min(100%, 350px);
}
.group-forms {
  margin-bottom: 2em;
}
</style>
