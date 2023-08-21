import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, setCurrentPage, totalPages }) => {
  const BOUNDARY = 3;
  const MIN_PAGE = 1;
  const MAX_PAGE = Math.max(MIN_PAGE, totalPages);

  let leftPages: number[] = [];
  let rightPages: number[] = [];

  for (let i = Math.max(MIN_PAGE, currentPage - BOUNDARY); i < currentPage; i++) {
    leftPages.push(i);
  }

  for (let i = currentPage; i <= Math.min(MAX_PAGE, currentPage + BOUNDARY); i++) {
    rightPages.push(i);
  }

  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <div>
        Page {currentPage} of {totalPages}
      </div>

      <div className="flex items-center gap-2">
        {
          <button
            className="text-primary rounded-lg p-1 px-2 hover:bg-[#007C5B1A]"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft strokeWidth={1.5} size={20} />
          </button>
        }

        {leftPages.length > 0 &&
          leftPages.map((page) => (
            <button
              key={page}
              className="text-primary rounded-lg bg-white p-1 px-3 text-sm hover:bg-[#007C5B1A]"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

        {rightPages.length > 0 &&
          rightPages.map((page) => (
            <button
              key={page}
              className={`text-primary rounded-lg p-1  px-3 text-sm hover:bg-[#007C5B1A] ${
                currentPage === page ? 'bg-[#007C5B1A]' : 'bg-white'
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

        {
          <button
            className="text-primary rounded-lg p-1 px-2 hover:bg-[#007C5B1A]"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight strokeWidth={1.5} size={20} />
          </button>
        }
      </div>
    </div>
  );
};
