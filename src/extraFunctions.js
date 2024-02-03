
export function shuffleArray(array) {
	const result = [], itemsLeft = array.concat([]);

	while (itemsLeft.length) {
		const randomIndex = Math.floor(Math.random() * itemsLeft.length);
		const [randomItem] = itemsLeft.splice(randomIndex, 1); // take out a random item from itemsLeft
		result.push(randomItem); // ...and add it to the result
	}

	return result;
}