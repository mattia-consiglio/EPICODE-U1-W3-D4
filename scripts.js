const selectedNumbers = [] //Keep track of selected numbers
const extractableNumbers = [] //Keep track aff extractable naumber in the master board
const allNumbers = [] //keep track af all numbers for player board genetration
const playersCol1Numbers = []
const playersCol2to8Numbers = []
const playersCol9Numbers = []
const masterBoard = document.getElementById('master-board')
const extractedNumberHtml = document.getElementById('etractedNumber')
const playerBaords = document.getElementById('players')
const autoExtracBtn = document.getElementById('autoEtractNumber')
let players = 0
let playerGroups = 0
let intervalID = null
const timer = 500
let col1MaxSpaces = 9
let col2to8MaxSpaces = 56
let col9MaxSpaces = 7

const createBaorard = ({ rows = 0, cols = 0, matrix = [], parent = null }) => {
	const numbers = []
	for (let i = 0; i < rows; i++) {
		const row = document.createElement('div')
		row.classList.add('row')
		for (let j = 0; j < cols; j++) {
			const cell = document.createElement('div')
			cell.classList.add('cell')
			const cellText = document.createElement('span')
			cellText.classList.add('cell-text')
			if (!matrix.length) {
				const number = i * 10 + j + 1
				cell.setAttribute('data-cell', number)
				cellText.innerText = `${number}`
				numbers.push(number)
			} else {
				const dataCell = matrix[i][j] === '' ? 'empty' : matrix[i][j]
				cell.setAttribute('data-cell', dataCell)
				cellText.innerText = matrix[i][j]
			}
			cell.appendChild(cellText)
			row.appendChild(cell)
		}
		parent.appendChild(row)
	}
	return numbers
}

const generateRandomNumber = (use = []) => {
	const randomNumber = Math.floor(Math.random() * use.length)
	return randomNumber
}

const extractNumber = () => {
	if (extractableNumbers.length === 0) {
		console.log('No more numbers to extract', extractableNumbers, intervalID)
		if (intervalID) {
			clearInterval(intervalID)
			autoExtracBtn.innerText = 'Inizia estrazione'
		}
		return
	}
	const randomNumberIndex = generateRandomNumber(extractableNumbers)
	const randomNumber = extractableNumbers[randomNumberIndex]
	extractableNumbers.splice(randomNumberIndex, 1)
	selectedNumbers.push(randomNumber)
	extractedNumberHtml.innerText = randomNumber
	document
		.querySelectorAll(`.cell[data-cell="${randomNumber}"]`)
		.forEach(cell => cell.classList.add('selected'))

	return randomNumber
}

const genarateBaseRanges = () => {
	playersCol1Numbers.length = 0
	playersCol2to8Numbers.length = 0
	playersCol9Numbers.length = 0
	playersCol1Numbers.push(...Array.from({ length: 9 }, (_, i) => i + 1))
	playersCol2to8Numbers.push(...Array.from({ length: 70 }, (_, i) => i + 10))
	playersCol9Numbers.push(...Array.from({ length: 11 }, (_, i) => i + 80))
	col1MaxSpaces = 9
	col2to8MaxSpaces = 56
	col9MaxSpaces = 7
	if (players > 0) {
		playerGroups++
	}
	players = 0
}

const updatePlayesBoard = () => {
	selectedNumbers.forEach(selected => {
		document
			.querySelectorAll(`.cell[data-cell="${selected}"]`)
			.forEach(cell => cell.classList.add('selected'))
	})
}

const createPlayerBoard = () => {
	//numbers in the player card: 15
	if (players % 6 === 0 && players !== 0) {
		genarateBaseRanges()
	}
	const matrix = []
	// const col1Limit = players === 5 ? 0 : 2
	const col1Limit = Math.floor(Math.random() * 3)
	const col1Min = 1
	let col1Count = 0
	const col9Limit = Math.floor(Math.random() * 4)
	const col9Min = players === 5 ? 1 : 2

	let col9Count = 0

	//generare row
	for (let i = 0; i < 3; i++) {
		matrix.push([])
		let rowMaxEmptySpaces = 4

		//generate cells
		for (let j = 0; j < 9; j++) {
			//add empty spaces
			if (rowMaxEmptySpaces > 0) {
				if (j === 0) {
					if (playersCol1Numbers.length === 0 || (col1Count >= col1Limit && col1MaxSpaces > 0)) {
						matrix[i].push('')
						col1MaxSpaces--
						rowMaxEmptySpaces--
						continue
					} else {
						if (col1MaxSpaces > 0 && col1Count > col1Min) {
							const addEmptyCell = Math.random() < 0.5

							if (addEmptyCell) {
								matrix[i].push('')
								col1MaxSpaces--
								rowMaxEmptySpaces--
								continue
							}
						}
					}
				}
				if (j >= 1 && j <= 7) {
					if (playersCol2to8Numbers.length === 0) {
						matrix[i].push('')
						col2to8MaxSpaces--
						rowMaxEmptySpaces--
						continue
					} else {
						if (playersCol9Numbers.length > 0 && col2to8MaxSpaces > 0) {
							const addEmptyCell = Math.random() < 0.4

							if (addEmptyCell) {
								matrix[i].push('')
								col2to8MaxSpaces--
								rowMaxEmptySpaces--
								continue
							}
						}
					}
				}
				if (j === 8) {
					if (playersCol9Numbers.length === 0 || (col9Count >= col9Limit && col9MaxSpaces > 0)) {
						matrix[i].push('')
						col9MaxSpaces--
						rowMaxEmptySpaces--
						continue
					} else {
						if (col9MaxSpaces > 0 && col9Count > col9Limit) {
							const addEmptyCell = Math.random() < 0.4
							if (addEmptyCell) {
								matrix[i].push('')
								col9MaxSpaces--
								rowMaxEmptySpaces--
								continue
							}
						}
					}
				}
			}

			let randomIndex
			let randomNumber
			if (j === 0) {
				randomIndex = generateRandomNumber(playersCol1Numbers)
				// console.log(
				// 	'number extracted col 1',
				// 	randomIndex,
				// 	playersCol1Numbers,
				// 	playersCol1Numbers[randomIndex]
				// )
				randomNumber = playersCol1Numbers[randomIndex]
				playersCol1Numbers.splice(randomIndex, 1)
				col1Count++
			}
			if (j >= 1 && j <= 7) {
				randomIndex = generateRandomNumber(playersCol2to8Numbers)
				// console.log(
				// 	'number extracted col 2-8',
				// 	randomIndex,
				// 	playersCol2to8Numbers,
				// 	playersCol2to8Numbers[randomIndex]
				// )

				randomNumber = playersCol2to8Numbers[randomIndex]
				playersCol2to8Numbers.splice(randomIndex, 1)
			}
			if (j === 8) {
				randomIndex = generateRandomNumber(playersCol9Numbers)
				// console.log(
				// 	'number extracted col 9',
				// 	randomIndex,
				// 	playersCol9Numbers,
				// 	playersCol9Numbers[randomIndex]
				// )
				randomNumber = playersCol9Numbers[randomIndex]
				playersCol9Numbers.splice(randomIndex, 1)
				col9Count++
			}

			matrix[i].push(randomNumber)

			// console.log('remaining numbers col1', playersCol1Numbers)
			// console.log('remaining numbers col2-8', playersCol2to8Numbers)
			// console.log('remaining numbers col9', playersCol9Numbers)
		}

		if (rowMaxEmptySpaces !== 0) {
			for (let y = 1; y < matrix[i].length - 1; y++) {
				const element = matrix[i][y]
				if (!rowMaxEmptySpaces) {
					break
				}
				if (element !== '' && rowMaxEmptySpaces) {
					playersCol2to8Numbers.push(element)
					matrix[i][y] = ''
					rowMaxEmptySpaces--
				}
			}
		}
	}

	const playerContainer = document.createElement('div')
	playerContainer.classList.add('player-container')

	const playerBoard = document.createElement('div')
	const playerBoardTitle = document.createElement('h2')
	// console.log('playerGroups', playerGroups)
	playerBoardTitle.innerText = `Cartella  ${players + 1 + playerGroups * 6}`
	playerBoard.classList.add('player-board')
	playerBoard.setAttribute('data-player', players)
	createBaorard({ rows: 3, cols: 9, matrix: matrix, parent: playerBoard })
	playerContainer.appendChild(playerBoardTitle)
	playerContainer.appendChild(playerBoard)

	playerBaords.appendChild(playerContainer)
	updatePlayesBoard()
	players++
}

const createMasterBoard = () => {
	const numbers = createBaorard({ rows: 9, cols: 10, parent: masterBoard })
	extractableNumbers.push(...numbers)
	allNumbers.push(...numbers)
	genarateBaseRanges()
}

document.getElementById('etractNumber').addEventListener('click', () => {
	extractNumber()
})

document.getElementById('addPlayer').addEventListener('click', () => {
	for (let i = 0; i < 6; i++) {
		createPlayerBoard()
	}
})

autoExtracBtn.addEventListener('click', () => {
	if (intervalID) {
		clearInterval(intervalID)
		intervalID = null
		autoExtracBtn.innerText = 'Inizia estrazione'
	} else {
		extractNumber()

		intervalID = setInterval(() => {
			extractNumber()
		}, timer)
		autoExtracBtn.innerText = 'Ferma estrazione'
	}
})

document.getElementById('reset').addEventListener('click', () => {
	if (intervalID) {
		clearInterval(intervalID)
		intervalID = null
		autoExtracBtn.innerText = 'Inizia estrazione'
	}
	selectedNumbers.forEach(selected => {
		document
			.querySelectorAll(`.cell[data-cell="${selected}"]`)
			.forEach(cell => cell.classList.remove('selected'))
	})
	selectedNumbers.length = 0
	extractedNumberHtml.innerText = '-'
	players = 0
	playerBaords.innerHTML = ''
	extractableNumbers.push(...allNumbers)
	playerGroups = 0
	genarateBaseRanges()
})

createMasterBoard()
