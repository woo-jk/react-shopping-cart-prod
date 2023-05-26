import styled from 'styled-components';

interface SpinnerProps {
  diameter?: string;
  spinnerWidth?: string;
  color?: string;
}

const LoadingSpinner = (props: SpinnerProps) => {
  const { diameter, spinnerWidth, color } = props;

  return (
    <SpinnerDiv
      style={{
        width: diameter ?? '77px',
        height: diameter ?? '77px',
        borderWidth: spinnerWidth ?? '7px',
        borderTopColor: color ?? 'hotpink',
      }}
    />
  );
};

const SpinnerDiv = styled.div`
  content: '';
  display: inline-flex;
  justify-content: center;
  align-items: center;

  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  border: 10px solid rgba(0, 0, 0, 0.05);
  border-top-color: rgb(255, 105, 180);
  border-radius: 50%;

  animation: spin 2.3s cubic-bezier(0.2, 0.33, 0.8, 0.33) infinite;

  @keyframes spin {
    0% {
      transform: rotate(0);
    }
    33% {
      transform: rotate(120deg);
    }
    67% {
      transform: rotate(240deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default LoadingSpinner;
