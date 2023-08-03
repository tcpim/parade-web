import { FallbackProps } from "react-error-boundary";

export function ErrorFallback(props: FallbackProps) {
  const { error, resetErrorBoundary } = props;

  return (
    <div>
      <h1>Error</h1>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>Reload Page</button>
    </div>
  );
}
