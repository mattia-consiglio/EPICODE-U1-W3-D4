const selectedNumbers = []
const masterBoard = document.getElementById('master-board')
const extractedNumberHtml = document.getElementById('etractedNumber')
const playerBaords = document.getElementById('players')
const autoExtracBtn = document.getElementById('autoEtractNumber')
let players = 0
let intervalID = null

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
				const dataCell = matrix[i][j] === '' ? 'empty' : matrix[i][j]
				cell.setAttribute('data-cell', dataCell)
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
	doNotRepeat.sort((a, b) => a - b)
	console.log(doNotRepeat)
	if (doNotRepeat.length === max - 1) {
		const numbers = Array.from({ length: 90 }, (_, i) => i + 1)
		const missingNumber = numbers.filter(number => {
			return !doNotRepeat.includes(number)
		})[0]
		randomNumber = missingNumber
		return randomNumber
	}
	while (randomNumber === null || doNotRepeat.includes(randomNumber) || randomNumber > max) {
		randomNumber = Math.floor(Math.random() * (max + max / 4 - min) + min)
		console.log(randomNumber)
	}
	return randomNumber
}

const extractNumber = () => {
	// console.log(selectedNumbers)

	if (selectedNumbers.length >= 90) {
		console.log(selectedNumbers.length)

		if (intervalID) {
			clearInterval(intervalID)
			autoExtracBtn.innerText = 'Inizia estrazione'
		}
		return
	}
	const randomNumber = generateRandomNumber({ doNotRepeat: selectedNumbers, min: 1, max: 90 })
	selectedNumbers.push(randomNumber)
	extractedNumberHtml.innerText = randomNumber
	document
		.querySelectorAll(`.cell[data-cell="${randomNumber}"]`)
		.forEach(cell => cell.classList.add('selected'))

	return randomNumber
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
	updatePlayesBoard()
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

autoExtracBtn.addEventListener('click', () => {
	if (intervalID) {
		clearInterval(intervalID)
		intervalID = null
		autoExtracBtn.innerText = 'Inizia estrazione'
	} else {
		intervalID = setInterval(() => {
			extractNumber()
		}, 1000)
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
})

createMasterBoard()
