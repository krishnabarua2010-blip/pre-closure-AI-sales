import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export default function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors';
  const variantClasses = variant === 'primary'
    ? 'bg-primary text-white hover:bg-primary/90'
    : 'bg-card text-white border border-border hover:bg-card/80';

  return (
    <button className={`${baseClasses} ${variantClasses} ${className}`} {...props} />
  );
}