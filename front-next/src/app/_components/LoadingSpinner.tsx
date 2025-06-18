const Loading = () => {
  return (
    <div className="absolute inset-0 z-50 flex justify-center bg-white/60 backdrop-blur-sm">
      <div className="relative w-12 h-12 top-10">
        <div className="absolute inset-0 rounded-full border-4 border-gray-300"></div>
        <div className="absolute inset-0 rounded-full border-t-4 border-blue-600 animate-spin"></div>
      </div>
    </div>
  );
};
export default Loading;
