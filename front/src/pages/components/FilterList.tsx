import { useRef, useState } from "react";
interface FilterQuery {
  [key: string]: boolean;
}

const FilterList = () => {
  const [filterQuery, setFilterQuery] = useState<FilterQuery>(
    Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`filter${i + 1}`, false]))
  );

  const tagListRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const isMoving = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    isDragging.current = true;
    isMoving.current = false;
    startX.current = event.clientX;
    scrollLeft.current = tagListRef.current?.scrollLeft || 0;
    document.body.style.cursor = "grabbing";
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !tagListRef.current) return;
    isMoving.current = true;
    event.preventDefault();
    const x = event.clientX;
    const walk = x - startX.current;
    tagListRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.body.style.cursor = "default";
    setTimeout(() => {
      isMoving.current = false;
    }, 10);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    isDragging.current = true;
    startX.current = event.touches[0].clientX;
    scrollLeft.current = tagListRef.current?.scrollLeft || 0;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging.current || !tagListRef.current) return;
    const x = event.touches[0].clientX;
    const walk = x - startX.current;
    tagListRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  const clickFilter = (index: number) => {
    if (!isMoving.current) {
      setFilterQuery((prev) => {
        const key = `filter${index + 1}`;
        return { ...prev, [key]: !prev[key] };
      });
    }
  };

  return (
    <div className="tag-list-scrolling">
      <div
        className="tag-list-wrapper"
        ref={tagListRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <li
            key={i}
            className="tag-list"
            onClick={() => clickFilter(i)}
            style={{
              backgroundColor: filterQuery[`filter${i + 1}`] ? "black" : "white",
              color: filterQuery[`filter${i + 1}`] ? "white" : "black",
            }}
          >
            필터 {i + 1}
          </li>
        ))}
      </div>
    </div>
  );
};

export default FilterList;
