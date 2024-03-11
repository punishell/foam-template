"use client";

export const Bio = ({ body }: { body: string }): JSX.Element => {
	return (
		<div className="flex w-full sm:w-[60%] grow flex-col gap-3 sm:rounded-2xl bg-white border-b sm:border sm:border-yellow-dark sm:bg-[#FFEFD7] p-4">
			<h3 className="text-left font-bold sm:text-2xl text-lg sm:font-medium text-title">Bio</h3>
			<div>{body}</div>
		</div>
	);
};
