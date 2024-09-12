import React from "react";
import Spinner from "./Spinner";
type Props = {};
const Loading = (props: Props) => {
  return (
    <div className="h-[85vh] flex flex-col gap-2 items-center justify-center">
      <Spinner className="w-12 fill-black mr-1 animate-spin dark-blue" />
    </div>
  );
};

export default Loading;