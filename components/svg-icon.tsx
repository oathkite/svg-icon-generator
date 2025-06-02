"use client";

import { useEffect, useRef } from "react";

interface SvgIconProps {
	svg: string;
	className?: string;
	style?: React.CSSProperties;
}

export function SvgIcon({ svg, className, style }: SvgIconProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!containerRef.current || !svg) return;

		// Clear previous content
		containerRef.current.innerHTML = "";

		// Create a temporary container to parse the SVG
		const temp = document.createElement("div");
		temp.innerHTML = svg;

		// Get the SVG element
		const svgElement = temp.querySelector("svg");
		if (svgElement) {
			// Clone the SVG to avoid moving the original
			const clonedSvg = svgElement.cloneNode(true) as SVGElement;

			// Apply styles if needed
			if (style?.width) {
				clonedSvg.setAttribute("width", String(style.width));
			}
			if (style?.height) {
				clonedSvg.setAttribute("height", String(style.height));
			}

			// Append to container
			containerRef.current.appendChild(clonedSvg);
		}
	}, [svg, style]);

	return <div ref={containerRef} className={className} style={style} />;
}
