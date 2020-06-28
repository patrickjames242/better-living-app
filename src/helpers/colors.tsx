

export class Color {

	constructor(
		readonly red: number,
		readonly green: number,
		readonly blue: number,
		readonly opacity: number = 1
	) { }

	get stringValue(): string {
		return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.opacity})`;
	}

	withAdjustedOpacity(newOpacity: number): Color {
		return new Color(this.red, this.green, this.blue, newOpacity);
	}

	static gray(percentage: number): Color{
		percentage = Math.min(Math.max(percentage, 0), 1);
		const num = 255 * percentage;
		return new Color(num, num, num);
	}
	
}

export const CustomColors = {
	themeGreen: new Color(39, 196, 120),
	redColor: new Color(255, 70, 70),
	mainBackgroundColor: new Color(242, 244, 249),
	offBlackTitle: new Color(43, 55, 43),
	offBlackSubtitle: new Color(180, 180, 180),
}
