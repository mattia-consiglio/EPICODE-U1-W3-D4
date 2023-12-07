const selectedNumbers = []
const masterBoard = document.getElementById('master-board')
const extractedNumberHtml = document.getElementById('etractedNumber')
const playerBaords = document.getElementById('players')
let players = 0

const createBaorard = ({ rows = 0, cols = 0, matrix = [], parent = null }) => {
	for (let i = 0; i < rows; i++) {
		const row = document.createElement('div')
		row.classList.add('row')
		for (let j = 0; j < cols; j++) {
			const cell = document.createElement('div')
			cell.classList.add('cell')
			const cellText = document.createElement('span')
			cellText.classList.add('cell-text')
			if (!matrix.length) {
				cell.setAttribute('data-cell', i * 10 + j + 1)
				cellText.innerText = `${i * 10 + j + 1}`
			} else {
				cell.setAttribute('data-cell', matrix[i][j])
				cellText.innerText = matrix[i][j]
			}
			cell.appendChild(cellText)
			row.appendChild(cell)
		}
		parent.appendChild(row)
	}
}

const generateRandomNumber = ({ doNotRepeat = [], min = 0, max = 0 }) => {
	let randomNumber = null
	while (randomNumber === null || doNotRepeat.includes(randomNumber)) {
		randomNumber = Math.floor(Math.random() * (max - min) + min)
	}
	return randomNumber
}

const extractNumber = () => {
	const randomNumber = generateRandomNumber({ doNotRepeat: selectedNumbers, min: 1, max: 90 })
	selectedNumbers.push(randomNumber)
	extractedNumberHtml.innerText = randomNumber
	document
		.querySelectorAll(`.cell[data-cell="${randomNumber}"]`)
		.forEach(cell => cell.classList.add('selected'))
	return randomNumber
}

const createPlayerBoard = () => {
	//numbers in the player card: 15
	const numbers = []
	const matrix = []
	for (let i = 0; i < 3; i++) {
		matrix.push([])
		const emptySpaces = []
		for (let y = 0; y < 4; y++) {
			const eptyIndexCell = generateRandomNumber({ doNotRepeat: emptySpaces, min: 0, max: 9 })
			emptySpaces.push(eptyIndexCell)
		}
		for (let j = 0; j < 9; j++) {
			if (!emptySpaces.includes(j)) {
				const randomNumber = generateRandomNumber({ doNotRepeat: numbers, min: 1, max: 90 })
				numbers.push(randomNumber)
				matrix[i].push(randomNumber)
			} else {
				matrix[i].push('')
			}
		}
	}
	const playerContainer = document.createElement('div')
	playerContainer.classList.add('player-container')

	const playerBoard = document.createElement('div')
	const playerBoardTitle = document.createElement('h2')
	playerBoardTitle.innerText = `Giocatore  ${players + 1}`
	playerBoard.classList.add('player-board')
	playerBoard.setAttribute('data-player', players)
	createBaorard({ rows: 3, cols: 9, matrix: matrix, parent: playerBoard })
	playerContainer.appendChild(playerBoardTitle)
	playerContainer.appendChild(playerBoard)

	playerBaords.appendChild(playerContainer)
	players++
}

const createMasterBoard = () => {
	createBaorard({ rows: 9, cols: 10, parent: masterBoard })
}

document.getElementById('etractNumber').addEventListener('click', () => {
	extractNumber()
})

document.getElementById('addPlayer').addEventListener('click', () => {
	createPlayerBoard()
})

createMasterBoard()
