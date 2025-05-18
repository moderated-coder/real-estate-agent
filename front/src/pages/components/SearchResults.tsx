import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
interface RealEstateItem {
  postId: number;
  article_price: string;
  article_short_features: string[];
  article_title: string;
  deposit_fee: number;
  rent_fee: number;
}

interface SearchPostProps {
  status: "pending" | "error" | "success";
  post: RealEstateItem;
}

const Searchpost = ({ status, post }: SearchPostProps) => {
  const navigate = useNavigate();
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
          navigate(`/search/detail/${post.postId}`);
        }}
      >
        <img src="/image/sampleRoom.jpg" alt={post.article_title} className="real-estate-thumbnail" />
        <div className="real-estate-content">
          <h3 className="real-estate-title">{post.article_title}</h3>
          <h3 className="real-estate-title">{post.postId}</h3>
          <p className="real-estate-price">
            {post.deposit_fee.toLocaleString()}/{post.rent_fee.toLocaleString()} KRW
          </p>
          <div className="real-estate-features">
            {post.article_short_features.map((feature) => (
              <p key={feature}>{feature}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default Searchpost;
