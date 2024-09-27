function ContentSpinner() {
  return (
    <div className="inset-0 flex items-center justify-center z-[999999] bg-transparent bg-opacity-70">
      <div className="w-full h-20 flex items-center justify-center">
        <div className="flex space-x-2">
          <span className="sr-only">Loading...</span>
          <div className="h-5 w-5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-5 w-5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-5 w-5 bg-white rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}

export default ContentSpinner;
