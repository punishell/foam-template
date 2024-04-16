export const UploadProgress = ({
    progress,
}: {
    progress: number;
}): React.JSX.Element => {
    return (
        <div className="flex w-full max-w-sm flex-col gap-2 rounded-2xl border border-[#7DDE86] bg-[#ECFCE533] p-4">
            <span className="text-sm">Uploading</span>
            <div className="h-[8px] w-full overflow-hidden rounded-full bg-[#EBEFF2]">
                <div
                    className="h-full rounded-full bg-primary-gradient"
                    style={{
                        width: `${progress}%`,
                    }}
                />
            </div>
        </div>
    );
};
