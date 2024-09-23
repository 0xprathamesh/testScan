const Skeleton: React.FC<{ width: string, height: string, className?: string }> = ({ width, height, className }) => (
    <div className={`animate-pulse ${className}`} style={{ width, height, backgroundColor: "#e0e0e0", borderRadius: "0.5rem" }} />
  );
export default Skeleton;