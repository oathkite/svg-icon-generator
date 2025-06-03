"use client";

import { memo, useCallback, useEffect, useMemo, useRef } from "react";

interface SvgIconProps {
	svg: string;
	className?: string;
	style?: React.CSSProperties;
}

const SvgIconComponent = ({ svg, className, style }: SvgIconProps) => {
	const containerRef = useRef<HTMLDivElement>(null);

	// Memoize the processed SVG to avoid repeated parsing
	const processedSvg = useMemo(() => {
		if (!svg) return null;
		
		try {
			// Create a temporary container to parse the SVG
			const temp = document.createElement("div");
			temp.innerHTML = svg;

			// Get the SVG element
			const svgElement = temp.querySelector("svg");
			if (!svgElement) return null;

			// Clone the SVG to avoid moving the original
			const clonedSvg = svgElement.cloneNode(true) as SVGElement;

			// Force 100% width and height for responsive scaling
			clonedSvg.setAttribute("width", "100%");
			clonedSvg.setAttribute("height", "100%");
			
			// Ensure proper aspect ratio preservation
			if (!clonedSvg.getAttribute("viewBox")) {
				// If no viewBox, create one based on original width/height or default to 24x24
				const originalWidth = svgElement.getAttribute("width") || "24";
				const originalHeight = svgElement.getAttribute("height") || "24";
				clonedSvg.setAttribute("viewBox", `0 0 ${originalWidth} ${originalHeight}`);
			}
			
			// Set preserveAspectRatio for 1:1 aspect ratio
			clonedSvg.setAttribute("preserveAspectRatio", "xMidYMid meet");

			return clonedSvg;
		} catch (error) {
			console.error("Error processing SVG:", error);
			return null;
		}
	}, [svg]);

	// Memoized function to apply current color styling
	const applyCurrentColor = useCallback((element: Element) => {
		const el = element as HTMLElement;
		
		// Set stroke to none and fill to currentColor
		element.setAttribute("stroke", "none");
		element.setAttribute("fill", "currentColor");
		
		// Override inline styles
		if (el.style) {
			el.style.stroke = "none";
			el.style.fill = "currentColor";
			if (el.style.color) {
				el.style.color = "currentColor";
			}
		}
		
		// Apply to all child elements recursively
		Array.from(element.children).forEach(child => applyCurrentColor(child));
	}, []);

	useEffect(() => {
		if (!containerRef.current || !processedSvg) return;

		// Clear previous content
		containerRef.current.innerHTML = "";

		// Clone again for DOM insertion (to avoid issues with multiple instances)
		const svgForDom = processedSvg.cloneNode(true) as SVGElement;
		
		// Apply currentColor to the SVG and all its children
		applyCurrentColor(svgForDom);

		// Append to container
		containerRef.current.appendChild(svgForDom);
	}, [processedSvg, applyCurrentColor]);

	return <div ref={containerRef} className={className} style={style} />;
};

// Memoize the component to prevent unnecessary re-renders
export const SvgIcon = memo(SvgIconComponent);