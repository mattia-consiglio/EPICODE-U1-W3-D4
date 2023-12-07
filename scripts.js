const selectedNumbers = []
const masterBoard = document.getElementById('master-board')
const extractedNumberHtml = document.getElementById('etractedNumber')
const createMasterBoard = () => {
	for (let i = 0; i < 9; i++) {
		const row = document.createElement('div')
		row.classList.add('row')
		for (let j = 0; j < 10; j++) {
			const cell = document.createElement('div')
			cell.classList.add('cell')
			// cell.setAttribute('data-row', i)
			// cell.setAttribute('data-col', j)
			const cellText = document.createElement('span')
			cellText.classList.add('cell-text')
			cell.setAttribute('data-cell', i * 10 + j + 1)
			cellText.innerText = `${i * 10 + j + 1}`
			cell.appendChild(cellText)
			row.appendChild(cell)
		}
		masterBoard.appendChild(row)
	}
}

const extractNumber = () => {
	let randomNumber = null
	while (randomNumber === null || selectedNumbers.includes(randomNumber)) {
		randomNumber = Math.floor(Math.random() * (90 - 1) + 1)
	}
	selectedNumbers.push(randomNumber)
	extractedNumberHtml.innerText = randomNumber
	document.querySelector(`.cell[data-cell="${randomNumber}"]`).classList.add('selected')
	return randomNumber
}

document.getElementById('etractNumber').addEventListener('click', () => {
	extractNumber()
})

createMasterBoard()
