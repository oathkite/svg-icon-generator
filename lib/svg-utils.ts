// SVG processing constants
const SVG_REGEX_PATTERNS = {
	width: /width="[^"]*"/g,
	height: /height="[^"]*"/g,
	fill: /fill="[^"]*"/g,
	stroke: /stroke="[^"]*"/g,
	styleFill: /style="[^"]*fill:\s*[^;]*[^"]*"/g,
	styleStroke: /style="[^"]*stroke:\s*[^;]*[^"]*"/g,
	currentColor: /currentColor/g,
} as const;

const SVG_COLORS = {
	black: "#000000",
	current: "currentColor",
	none: "none",
} as const;

/**
 * Validates if a string contains valid SVG content
 */
export const isValidSVG = (svgString: string): boolean => {
	if (!svgString || typeof svgString !== 'string' || !svgString.trim()) return false;

	try {
		const parser = new DOMParser();
		const doc = parser.parseFromString(svgString, "image/svg+xml");

		// Check for parsing errors
		const parseError = doc.querySelector("parsererror");
		if (parseError) return false;

		// Check if root element is svg
		const svgElement = doc.documentElement;
		return svgElement.tagName.toLowerCase() === "svg";
	} catch {
		return false;
	}
};

/**
 * Formats SVG string with proper indentation and structure
 */
export const formatSVG = (svgString: string): string => {
	if (!isValidSVG(svgString)) {
		throw new Error("Invalid SVG content provided");
	}

	const parser = new DOMParser();
	const doc = parser.parseFromString(svgString, "image/svg+xml");

	const formatNode = (node: Node, indent = ""): string => {
		if (node.nodeType === Node.TEXT_NODE) {
			return node.textContent?.trim() || "";
		}

		if (node.nodeType !== Node.ELEMENT_NODE) {
			return "";
		}

		const element = node as Element;
		let result = `${indent}<${element.tagName.toLowerCase()}`;

		// Format attributes
		for (const attr of Array.from(element.attributes)) {
			result += ` ${attr.name}="${attr.value}"`;
		}

		const hasChildren = element.childNodes.length > 0;
		if (!hasChildren) {
			result += " />";
			return result;
		}

		result += ">";

		const childIndent = `${indent}  `;
		let hasTextContent = false;

		// Process child nodes
		for (const child of Array.from(element.childNodes)) {
			if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
				hasTextContent = true;
				result += child.textContent.trim();
			} else if (child.nodeType === Node.ELEMENT_NODE) {
				result += `\n${formatNode(child, childIndent)}`;
			}
		}

		if (!hasTextContent && element.childNodes.length > 0) {
			result += `\n${indent}`;
		}

		result += `</${element.tagName.toLowerCase()}>`;
		return result;
	};

	const svgElement = doc.documentElement;
	return formatNode(svgElement);
};

/**
 * Resizes SVG and sets colors for download (black fill, no stroke)
 */
export const resizeSVG = (svg: string, size: number): string => {
	if (!isValidSVG(svg)) {
		console.warn("Invalid SVG provided to resizeSVG");
		return svg;
	}

	if (size <= 0 || size > 1024) {
		console.warn("Invalid size provided to resizeSVG, using default 24");
		size = 24;
	}

	return svg
		.replace(SVG_REGEX_PATTERNS.width, `width="${size}"`)
		.replace(SVG_REGEX_PATTERNS.height, `height="${size}"`)
		.replace(SVG_REGEX_PATTERNS.fill, `fill="${SVG_COLORS.black}"`)
		.replace(SVG_REGEX_PATTERNS.stroke, `stroke="${SVG_COLORS.none}"`)
		.replace(SVG_REGEX_PATTERNS.currentColor, SVG_COLORS.black)
		.replace(SVG_REGEX_PATTERNS.styleFill, (match) =>
			match.replace(/fill:\s*[^;]*/, `fill: ${SVG_COLORS.black}`),
		)
		.replace(SVG_REGEX_PATTERNS.styleStroke, (match) =>
			match.replace(/stroke:\s*[^;]*/, `stroke: ${SVG_COLORS.none}`),
		);
};

/**
 * Normalizes SVG for display (responsive sizing, currentColor)
 */
export const normalizeSVG = (svg: string): string => {
	if (!isValidSVG(svg)) {
		console.warn("Invalid SVG provided to normalizeSVG");
		return svg;
	}

	return svg
		.replace(/width="\d+"/g, 'width="100%"')
		.replace(/height="\d+"/g, 'height="100%"')
		.replace(SVG_REGEX_PATTERNS.fill, `fill="${SVG_COLORS.current}"`)
		.replace(SVG_REGEX_PATTERNS.stroke, `stroke="${SVG_COLORS.none}"`)
		.replace(SVG_REGEX_PATTERNS.styleFill, (match) =>
			match.replace(/fill:\s*[^;]*/, `fill: ${SVG_COLORS.current}`),
		)
		.replace(SVG_REGEX_PATTERNS.styleStroke, (match) =>
			match.replace(/stroke:\s*[^;]*/, `stroke: ${SVG_COLORS.none}`),
		);
};

/**
 * Optimizes SVG by removing unnecessary attributes and whitespace
 */
export const optimizeSVG = (svg: string): string => {
	if (!isValidSVG(svg)) {
		return svg;
	}

	// Remove common unnecessary attributes
	return svg
		.replace(/\s+/g, " ") // Normalize whitespace
		.replace(/data-[^=]*="[^"]*"\s*/g, "") // Remove data attributes
		.replace(/id="[^"]*"\s*/g, "") // Remove id attributes
		.replace(/class="[^"]*"\s*/g, "") // Remove class attributes
		.trim();
};

/**
 * Creates a safe SVG string for rendering
 */
export const createSafeSVG = (svgContent: string): string => {
	if (!svgContent) return "";

	// Ensure SVG has proper namespace and attributes
	if (!svgContent.includes("xmlns")) {
		svgContent = svgContent.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
	}

	// Add default viewBox if missing
	if (!svgContent.includes("viewBox")) {
		svgContent = svgContent.replace("<svg", '<svg viewBox="0 0 24 24"');
	}

	return optimizeSVG(svgContent);
};
