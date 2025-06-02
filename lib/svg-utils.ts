export const formatSVG = (svgString: string): string => {
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

		for (let i = 0; i < element.attributes.length; i++) {
			const attr = element.attributes[i];
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

		for (let i = 0; i < element.childNodes.length; i++) {
			const child = element.childNodes[i];
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

export const resizeSVG = (svg: string, size: number): string => {
	return svg
		.replace(/width="\d+"/, `width="${size}"`)
		.replace(/height="\d+"/, `height="${size}"`)
		.replace(/currentColor/g, "#000000");
};

export const normalizeSVG = (svg: string): string => {
	return svg
		.replace(/width="\d+"/g, 'width="100%"')
		.replace(/height="\d+"/g, 'height="100%"');
};
