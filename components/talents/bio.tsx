
export const Bio = ({ body }: { body: string }) => {
  return (
    <div className="flex flex-col w-[60%] grow bg-[#FFEFD7] p-4 rounded-4 gap-3 border border-yellow-dark rounded-2xl">
      <h3 className="text-left text-title text-lg font-medium">Bio</h3>
      <div>{body}</div>
    </div>
  );
};