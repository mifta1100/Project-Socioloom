import "./CircularProgress.css";

interface CircularProgressProps {
  percent: number;
}

function CircularProgress({ percent }: CircularProgressProps) {
  const color = percent > 100 ? "red" : "var(--twitter-color)";

  return (
    <div
      className="circular__progress"
      style={{
        background: `conic-gradient(${color} ${percent}%, var(--twitter-background) 0%)`,
      }}
    ></div>
  );
}

export default CircularProgress;
