interface BadgeProps {
    title?: string;
    value?: string;
    total?: string;
    textColor?: string;
    bgColor?: string;
}

export const Badge = ({
    title = "",
    value = "",
    total = "",
    textColor = "",
    bgColor = "",
}: BadgeProps): JSX.Element => {
    return (
        <div
            className="flex w-full flex-col rounded-lg border py-1 text-center text-base"
            style={{ color: textColor, background: bgColor, borderColor: textColor }}
        >
            <div className="mx-auto flex flex-col">
                <p className="border-b" style={{ borderColor: textColor }}>
                    {value}
                </p>
                <p>{total}</p>
            </div>
            <p className="text-sm">{title}</p>
        </div>
    );
};
