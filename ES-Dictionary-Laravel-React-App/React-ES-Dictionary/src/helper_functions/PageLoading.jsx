import React from "react";
import Loading from "./Loading";

export default function PageLoading() {
  return (
    <div className="min-h-screen bg-coffee flex justify-center items-center">
      <div className="mb-20"style={{ width: "200px", height: "200px" }}>
        <Loading />
      </div>
    </div>
  );
}
