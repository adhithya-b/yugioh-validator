import React from "react";

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-32">
      <div
        class="w-12 h-12 rounded-full animate-spin
                    border-8 border-solid border-blue-500 border-t-transparent"
      ></div>
    </div>
  );
}

export default LoadingSpinner;
