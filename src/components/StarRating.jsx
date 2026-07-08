import "./StarRating.css";

export default function StarRating({
  value = 0,
  onChange,
  max = 5,
  variant = "default",
}) {
  return (
    <div className={`stars-wrapper ${variant}`}>
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;

        return (
          <span
            key={`star-${i}`}
            className={`
              star
              ${starValue <= value ? "active" : ""}
              ${variant === "temperature" ? `temp-star-${starValue}` : ""}
            `}
            onClick={() => {
              if (starValue === value) {
                onChange?.(0);
              } else {
                onChange?.(starValue);
              }
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}