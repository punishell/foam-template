export const DefaultAvatar = (): JSX.Element => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 144 144">
			<circle cx="71.789" cy="71.789" r="71.789" fill="#89FFDD" />
			<mask
				id="mask0_1_272"
				style={{ maskType: "alpha" }}
				width="144"
				height="144"
				x="0"
				y="0"
				maskUnits="userSpaceOnUse"
			>
				<circle cx="71.789" cy="71.789" r="71.789" fill="#C4C4C4" />
			</mask>
			<g mask="url(#mask0_1_272)">
				<ellipse cx="71.789" cy="126.349" fill="#007367" rx="54.56" ry="31.587" />
			</g>
			<circle cx="71.789" cy="61.021" r="25.844" fill="#007367" />
		</svg>
	);
};
