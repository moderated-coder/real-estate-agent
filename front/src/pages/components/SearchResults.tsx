import { useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
interface RealEstateItem {
  postId: number;
  article_price: string;
  article_short_features: string[];
  article_title: string;
}

interface SearchResultsProps {
  status: "pending" | "error" | "success";
  results: RealEstateItem;
}

const SearchResults = ({ status, results }: SearchResultsProps) => {
  const navigate = useNavigate();
  console.log("results", results);
  // 스크롤 위치 저장
  const saveScrollPosition = () => {
    sessionStorage.setItem("scrollPosition", String(window.scrollY));
  };

  // 스크롤 위치 복원
  useEffect(() => {
    const savedPosition = sessionStorage.getItem("scrollPosition");
    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition, 10));
    }
  }, []);

  if (status === "pending") return <span>Loading...</span>;
  if (status === "error") return <span>Error</span>;
  if (status === "success") {
    return (
      <div
        className="real-estate-card"
        onClick={() => {
          saveScrollPosition();
          navigate(`/search/detail/${item.postId}`);
        }}
      >
        <img src="/image/sampleRoom.jpg" alt={results.article_title} className="real-estate-thumbnail" />
        <div className="real-estate-content">
          <h3 className="real-estate-title">{results.article_title}</h3>
          <h3 className="real-estate-title">{results.postId}</h3>
          <p className="real-estate-price">{results.article_price.toLocaleString()} KRW</p>
          <div className="real-estate-features">
            {results.article_short_features.map((feature) => (
              <p key={feature}>{feature}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default SearchResults;
