"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type * as React from "react";

type ThemeProviderProps = {
	children: React.ReactNode;
	attribute?: "class" | "data-theme" | "data-mode";
	defaultTheme?: string;
	enableSystem?: boolean;
	enableColorScheme?: boolean;
	disableTransitionOnChange?: boolean;
	storageKey?: string;
	themes?: string[];
	forcedTheme?: string;
	nonce?: string;
	value?: { [themeName: string]: string };
};

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
