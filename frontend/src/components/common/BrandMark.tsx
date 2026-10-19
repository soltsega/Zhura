type BrandMarkProps = {
  className?: string;
};

export default function BrandMark({ className = 'h-10 w-10' }: BrandMarkProps) {
  return <img className={className} src="/zhura-logo.svg" alt="Zhura" />;
}
