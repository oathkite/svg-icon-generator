import { resizeSVG } from "./svg-utils";

export const downloadSVG = (svg: string, size: number) => {
	const svgWithSize = resizeSVG(svg, size);

	const blob = new Blob([svgWithSize], { type: "image/svg+xml" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `icon-${size}x${size}.svg`;
	a.click();
	URL.revokeObjectURL(url);
};

export const downloadPNG = async (svg: string, size: number) => {
	const svgWithSize = resizeSVG(svg, size);

	const canvas = document.createElement("canvas");
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext("2d");

	if (!ctx) {
		throw new Error("Failed to get canvas context");
	}

	const img = new Image();
	const svgBlob = new Blob([svgWithSize], { type: "image/svg+xml;charset=utf-8" });
	const url = URL.createObjectURL(svgBlob);

	return new Promise<void>((resolve, reject) => {
		img.onload = () => {
			ctx.drawImage(img, 0, 0, size, size);
			URL.revokeObjectURL(url);

			canvas.toBlob((blob) => {
				if (!blob) {
					reject(new Error("Failed to create PNG blob"));
					return;
				}

				const pngUrl = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = pngUrl;
				a.download = `icon-${size}x${size}.png`;
				a.click();
				URL.revokeObjectURL(pngUrl);
				resolve();
			}, "image/png");
		};

		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new Error("Failed to load SVG image"));
		};

		img.src = url;
	});
};
