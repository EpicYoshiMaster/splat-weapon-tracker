
export const arrayPrimitiveEquals = <T>(a: Array<T>, b: Array<T>): boolean => {
	return Array.isArray(a) &&
		Array.isArray(b) &&
		a.length === b.length &&
		a.every((value, index) => value === b[index])
}

//Based on:
//https://math.stackexchange.com/questions/466198/algorithm-to-get-the-maximum-size-of-n-squares-that-fit-into-a-rectangle-with-a
export const fitSquaresToRectGrid = (width: number, height: number, num: number) => {
	if(num <= 0) return { rows: 1, columns: 1, size: Math.min(width, height) };
	
	// Compute number of rows and columns, and cell size
	const ratio = width / height;
	const ncols_float = Math.sqrt(num * ratio);
	const nrows_float = num / ncols_float;

	// Find best option filling the whole height
	let nrows1 = Math.ceil(nrows_float);
	let ncols1 = Math.ceil(num / nrows1);
	while (nrows1 * ratio < ncols1) {
	    nrows1++;
	    ncols1 = Math.ceil(num / nrows1);
	}
	const cell_size1 = height / nrows1;

	// Find best option filling the whole width
	let ncols2 = Math.ceil(ncols_float);
	let nrows2 = Math.ceil(num / ncols2);
	while (ncols2 < nrows2 * ratio) {
	    ncols2++;
	    nrows2 = Math.ceil(num / ncols2);
	}
	const cell_size2 = width / ncols2;

	// Find the best values
	let rows, columns, size;
	if (cell_size1 < cell_size2) {
	    rows = nrows2;
	    columns = ncols2;
	    size = cell_size2;
	} else {
	    rows = nrows1;
	    columns = ncols1;
	    size = cell_size1;
	}

	return {size, rows, columns};
}

export const fitSquaresToRectColumn = (width: number, height: number, num: number) => {
	if(num <= 0) return 0;

	const min = Math.min(width, height);
	const max = Math.max(width, height);

	if(min * num <= max) return min;

	return Math.max(height / num, 0);
}