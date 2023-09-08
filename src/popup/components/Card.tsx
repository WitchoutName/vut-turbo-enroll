import * as React from 'react';

export interface ICardProps {
    children: string | JSX.Element | JSX.Element[],
    [x:string]: any
}

export default function Card ({children, ...rest}: ICardProps) {
  return (
    <div className='card text-center' {...rest}>
        {children}
    </div>
  );
}
