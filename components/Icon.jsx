// Inline stroke icons — redesign brief non-negotiable #5:
// "No emoji as icons. Every icon is an inline stroke SVG: 1.8 stroke-width,
// round linecap and linejoin, currentColor, 15–17px."
// Sizes come from the .icon classes in globals.css, colours from currentColor.

const base = {
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 1.8,
	strokeLinecap: "round",
	strokeLinejoin: "round",
	viewBox: "0 0 24 24",
	"aria-hidden": "true",
	focusable: "false",
};

function Svg({ children, className = "icon" }) {
	return (
		<svg {...base} className={className}>
			{children}
		</svg>
	);
}

export function IconArrowRight(props) {
	return (
		<Svg {...props}>
			<path d="M4 12h15" />
			<path d="M13 6l6 6-6 6" />
		</Svg>
	);
}

export function IconArrowUpRight(props) {
	return (
		<Svg {...props}>
			<path d="M7 17 17 7" />
			<path d="M8 7h9v9" />
		</Svg>
	);
}

export function IconMoon(props) {
	return (
		<Svg {...props}>
			<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
		</Svg>
	);
}

export function IconSun(props) {
	return (
		<Svg {...props}>
			<path d="M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M18.4 5.6l1.4-1.4M4.2 19.8l1.4-1.4" />
			<circle cx="12" cy="12" r="4" />
		</Svg>
	);
}

export function IconCard(props) {
	return (
		<Svg {...props}>
			<rect x="2.5" y="5" width="19" height="14" rx="2" />
			<path d="M2.5 10h19" />
			<path d="M6.5 15h4" />
		</Svg>
	);
}

export function IconSparkle(props) {
	return (
		<Svg {...props}>
			<path d="M12 3l2.1 5.4L19.5 10.5 14.1 12.6 12 18l-2.1-5.4L4.5 10.5 9.9 8.4z" />
			<path d="M18.5 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" />
		</Svg>
	);
}

export function IconBriefcase(props) {
	return (
		<Svg {...props}>
			<rect x="2.5" y="7.5" width="19" height="13" rx="2" />
			<path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" />
			<path d="M2.5 13h19" />
		</Svg>
	);
}

export function IconScales(props) {
	return (
		<Svg {...props}>
			<path d="M12 4v16" />
			<path d="M6 20h12" />
			<path d="M4 8h16" />
			<path d="M4 8l-2.5 6h5z" />
			<path d="M20 8l-2.5 6h5z" />
		</Svg>
	);
}

export function IconUsers(props) {
	return (
		<Svg {...props}>
			<circle cx="9" cy="8" r="3.5" />
			<path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
			<path d="M16 5.2a3.5 3.5 0 0 1 0 5.6" />
			<path d="M18 14.2a6.5 6.5 0 0 1 3.5 5.8" />
		</Svg>
	);
}

export function IconSearch(props) {
	return (
		<Svg {...props}>
			<circle cx="10.5" cy="10.5" r="6" />
			<path d="M15.2 15.2 20 20" />
		</Svg>
	);
}

export function IconClose(props) {
	return (
		<Svg {...props}>
			<path d="M6 6l12 12M18 6 6 18" />
		</Svg>
	);
}

export function IconMenu(props) {
	return (
		<Svg {...props}>
			<path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
		</Svg>
	);
}

export function IconPen(props) {
	return (
		<Svg {...props}>
			<path d="M4 20h4l10-10a2.5 2.5 0 0 0-3.5-3.5L4.5 16.5z" />
			<path d="M13.5 6.5 17.5 10.5" />
		</Svg>
	);
}

export function IconUser(props) {
	return (
		<Svg {...props}>
			<circle cx="12" cy="8" r="3.75" />
			<path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
		</Svg>
	);
}

export function IconDashboard(props) {
	return (
		<Svg {...props}>
			<rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
			<rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
			<rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
			<rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
		</Svg>
	);
}

export function IconLogout(props) {
	return (
		<Svg {...props}>
			<path d="M15 4.5h3.5a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H15" />
			<path d="M10 8l-4 4 4 4" />
			<path d="M6 12h9" />
		</Svg>
	);
}

export function IconCheck(props) {
	return (
		<Svg {...props}>
			<path d="M4.5 12.5 9.5 17.5 19.5 7" />
		</Svg>
	);
}

export function IconSpinner(props) {
	return (
		<Svg className={`${props.className ?? "icon"} animate-spin`}>
			<path d="M12 3.5a8.5 8.5 0 1 1-8.5 8.5" />
		</Svg>
	);
}

export function IconGlobe(props) {
	return (
		<Svg {...props}>
			<circle cx="12" cy="12" r="8.5" />
			<path d="M3.5 12h17" />
			<path d="M12 3.5c2.4 2.4 3.6 5.3 3.6 8.5S14.4 18.1 12 20.5C9.6 18.1 8.4 15.2 8.4 12S9.6 5.9 12 3.5z" />
		</Svg>
	);
}

export function IconBook(props) {
	return (
		<Svg {...props}>
			<path d="M4 5.5A2 2 0 0 1 6 3.5h5v17H6a2 2 0 0 0-2 2z" />
			<path d="M20 5.5a2 2 0 0 0-2-2h-5v17h5a2 2 0 0 1 2 2z" />
		</Svg>
	);
}

export function IconStore(props) {
	return (
		<Svg {...props}>
			<path d="M4 9.5V20h16V9.5" />
			<path d="M3 4.5h18l1 5H2z" />
			<path d="M9.5 20v-5.5h5V20" />
		</Svg>
	);
}
