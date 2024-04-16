"use client";

interface MobileSheetWrapperProps {
    children: React.ReactNode;
    isOpen: boolean;
}

export const MobileSheetWrapper = ({
    children,
    isOpen,
}: MobileSheetWrapperProps): JSX.Element => {
    return (
        <div
            className={`fixed top-16 z-50 h-[calc(100vh-129px)] w-full overflow-y-scroll bg-white transition-all duration-300 ease-in-out ${isOpen ? "right-0" : "-right-full"}`}
        >
            <div className="relative h-full w-full">{children}</div>
        </div>
    );
};
