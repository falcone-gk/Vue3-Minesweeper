<template>
  <div class="game">
    <div class="menu">
      <div class="bar">
        <div class="digital-number">
          {{ bombsMenu }}
        </div>
        <div @click.prevent="setNewGame" class="reset">{{ menuIcon[gameStatus] }}</div>
        <div class="digital-number">
          {{ String(counter).padStart(3, '0') }}
        </div>
      </div>
    </div>
    <div
    class="gameboard"
    :class="{'game-disabled': gameStatus === 'lost' || gameStatus === 'winner'}"
    :style="gameboardStyle">
      <div
      v-for="index in store.getters.totalCells"
      class="box"
      :class="{shown: gameGrid[index-1].isShown, flagged: gameGrid[index-1].isFlagged}"
      @click.prevent="onClick(index-1)"
      @contextmenu.prevent="rightClick(index-1)"
      :key="index">
        <span v-if="gameGrid[index-1].isShown" :style="colorStyle(index-1)">{{ gameGrid[index-1].value }}</span>
      </div>
    </div>
  </div>
  <table v-if="records.length">
    <thead align="left">
      <tr>
        <th>N°</th>
        <th>Dificultad</th>
        <th>Tiempo</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(record, i) in records" :key="i">
        <td>{{ i+1 }}</td>
        <td>{{ dictLevels[record.level] }}</td>
        <td>{{ record.time }} segundos</td>
      </tr>
    </tbody>
  </table>
  <PageButton value="Configuración" :event="goToSetup" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { gameRecord } from '../store/index'
import PageButton from './elements/PageButton.vue'
import rangeRandomSample from '../common/RandomSample'
import getAllPossibleDirections from '../common/Directions'

interface cellState {
  isShown: boolean;
  value: string;
  isFlagged: boolean;
}

const store = useStore()
const level = store.getters.getCurrentLevel
const numRows = store.getters.getNumRows
const numCols = store.getters.getNumCols
const numBombs = store.getters.getNumBombs
const records = computed<gameRecord[]>(() => store.getters.getTimesByLevel)

// Chronometer elements
const counter = ref<number>(0)
let timerId: ReturnType<typeof setTimeout>;

const defaultCellState: cellState = {
  isShown: false,
  value: "",
  isFlagged: false,
}

// Colors for numbers in cells
const colors:string[] = ["#0000ff", "#008100", "#ff1300", "#000083", "#810500", "#2a9494", "#000000", "#808080"]
const dictLevels: {[key: string]: string} = {
  'beginner': 'Principiante',
  'intermediate': 'Intermedio',
  'advanced': 'Avanzado'
}

const gameStatus = ref<'waiting'|'playing'|'lost'|'winner'>('playing')
const menuIcon: {[key: string]: string} = {
  'waiting': '😃',
  'playing': '😃',
  'lost': '💀',
  'winner': '😎'
}

const gameGrid = ref<cellState[]>(Array(numRows * numCols).fill(undefined).map(() => {
  // Using expansion when giving default object because when changing una key value it will
  // change every key with the same value, so we the solution is using expansion to make a copy.
  return {...defaultCellState};
}))

const indexBombs = ref<number[]>([])

const gameboardStyle = computed(() => {
  return {
    display: 'grid',
    "grid-template": `repeat(${numRows}, 1fr) / repeat(${numCols}, 1fr)`,
    margin: "0 auto",
    width: "max-content",
    height: "max-content",
    border: "solid #808080",
    "border-width": "1px 0 0 1px",
    }
  }
)

// Style to give color format depending on number value
const colorStyle = (index: number) => {
  const cellValue: number = parseInt(gameGrid.value[index].value)
  return {color: colors[cellValue-1]}
}

// Bombs left to use as value in the game
const bombsLeft = computed(() => {
  const cellsFlagged: number = gameGrid.value.filter((obj) => obj.isFlagged).length
  const bombsLeft: number = numBombs - cellsFlagged
  return bombsLeft
})

// Bombs left value to show in the menu
const bombsMenu = computed(() => {
  return String(bombsLeft.value).padStart(3, '0')
})

const goToSetup = () => store.commit('setNewPage', 'settings')
const rightClick = (index: number) => {
  const getFlagged: boolean = gameGrid.value[index].isFlagged

  // Stop flagging when bombs flagged are already the same as bombs number
  // And when the right click is done in a cell already flagged
  if (bombsLeft.value <= 0 && !getFlagged) return

  gameGrid.value[index].isFlagged = !getFlagged
}
const propagationClick = (index: number): void => {

  let boxMapped: number[] = [index];
  let i = 0;
  do {
    const currentCell: number = boxMapped[i]
    if (gameGrid.value[currentCell].value === "") {
      const nearCells: number[] = getAllPossibleDirections(currentCell, numRows, numCols).filter((c) => {
        // Check if near box is already mapped
        const alreadyMapped: boolean = boxMapped.some(
          (ind) => ind === c
        );
        return !alreadyMapped && !gameGrid.value[c].isFlagged;
      });
      boxMapped.push(...nearCells);
    }
    i++;
  } while (i < boxMapped.length);
  boxMapped.forEach((index) => {
    gameGrid.value[index].isShown = true
  });
};

const wonEvent = () => {
  const cellsNotShown: number = gameGrid.value.filter((obj) => !obj.isShown).length
  if (cellsNotShown === numBombs) {
    // We just add to record the game when is not custom
    if (level !== 'custom') {
      const newRecord: gameRecord = {
        level: level,
        time: counter.value
      }
      store.commit('setNewRecord', newRecord)
    }

    gameStatus.value = 'winner'
    clearInterval(timerId)
  }
}
const lostEvent = (): void => {
  clearInterval(timerId)
  gameStatus.value = 'lost'
  indexBombs.value.forEach((ind) => gameGrid.value[ind].isShown = true)
}

const onClick = (index: number): void => {

  // Changing settings when the game starts because the user starts with a click in a cell.
  if (gameStatus.value === 'waiting') {
    gameStatus.value = 'playing'
    timerId = setInterval(function () {counter.value++}, 1000)
  }

  if (gameGrid.value[index].isFlagged) {
    return
  } else if (gameGrid.value[index].value === '💣') {
    lostEvent()
    return
  } else {
    propagationClick(index)
  }
  wonEvent()
}

const setNewGame = () => {
  gameStatus.value = 'waiting'

  // Restarting chronometer
  counter.value = 0
  clearInterval(timerId)

  const emptyGrid = Array(numRows * numCols).fill(undefined).map(() => {
  // Using expansion when giving default object because when changing una key value it will
  // change every key with the same value, so we the solution is using expansion to make a copy.
  return {...defaultCellState};
  })

  // Getting new indexes for bombs when starting a new game
  indexBombs.value = rangeRandomSample(store.getters.totalCells, numBombs)

  // Basically to hide every cell that has been shown and clean bombs index
  gameGrid.value = emptyGrid
  indexBombs.value.forEach((index) => {
    // Getting bombs coords from index value in bombsArray.
    gameGrid.value[index].value = "💣";

    // Sum one to each box near a bomb.
    const nearCells: number[] = getAllPossibleDirections(
      index,
      numRows,
      numCols
    );
    nearCells.forEach((cellIndex) => {
      let nearValue: string = gameGrid.value[cellIndex].value;
      // Avoid box that are bombs
      if (nearValue !== "💣") {
        // If it's the first time the box is used we set to '0'.
        if (nearValue === "") {
          nearValue = "0";
        }
        gameGrid.value[cellIndex].value = `${parseInt(nearValue) + 1}`;
      }
    });
  });
}
setNewGame()

</script>
<style scoped>
@import url('http://fonts.cdnfonts.com/css/digital-dismay');
.game {
  background-color: lightgray;
  padding: 2px;
  margin-bottom: 1em;
}
.menu {
  display: flex;
  box-sizing: border-box;
  height: 60px;
  background-color: #C0C0C0;
  border: 1.5px solid;
  border-top-color: #ffffff;
  border-right-color: #7B7B7B;
  border-bottom-color: #7B7B7B;
  border-left-color: #ffffff;
  text-align: center;
  vertical-align: middle;
}
.bar {
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
  padding: 2px;
  margin: 6px;
  border-top: 2px solid #7B7B7B;
  border-right: 2px solid #ffffff;
  border-bottom: 2px solid #ffffff;
  border-left: 2px solid #7B7B7B;
}
.reset {
  text-align: center;
  cursor: pointer;
  font-size: 25px;
  width: 35px;
  height: 35px;
  border-top: 2px solid #ffffff;
  border-right: 2px solid #7B7B7B;
  border-bottom: 2px solid #7B7B7B;
  border-left: 2px solid #ffffff;
}
.reset:active {
  background: #bdbdbd;
  border: solid #999;
  border-width: 2px 0 0 2px;
}
.digital-number {
  font-family: 'Digital Dismay';
  font-size: 30px;
  letter-spacing: 1px;
  color: red;
  background-color: black;
  text-align: center;
  padding: 4px 4px 0 7px;
  line-height: 1em;
}
.game-disabled {
  pointer-events: none;
}
.box {
  display: flex;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  height: 30px;
  width: 30px;
  background: #c0c0c0;
  box-sizing: border-box;
  border: solid #808080;
  border-width: 0 1px 1px 0;
  cursor: pointer;
}
.box::after {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: #c0c0c0;
  border: 2px outset #ececec;
  font-size: 0.75rem;
  text-align: center;
}
.flagged::after {
  content: "🚩";
  font-size: 15px;
}
.box.shown::after {
    display: none;
}
.box:active::after {
  background: #bdbdbd;
  border: solid #999;
  border-width: 2px 0 0 2px;
}
table {
  padding: 1em 0;
  border-collapse: separate;
  border-spacing: 1em 0;
}
</style>