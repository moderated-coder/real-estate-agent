const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-gray-300"></div>
        <div className="absolute inset-0 rounded-full border-t-4 border-blue-600 animate-spin"></div>
      </div>
    </div>
  );
};
export default Loading;
