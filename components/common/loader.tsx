import { Loader } from "lucide-react";

export const Spinner = () => {
  return (
    <div className="flex w-full items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  );
};
